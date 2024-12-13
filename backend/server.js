const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const { collectDefaultMetrics, register } = require("prom-client");
const { Counter, Gauge } = require("prom-client");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

// Створення метрик для Prometheus
const uploadCounter = new Counter({
  name: "image_uploads_total",
  help: "Total number of image uploads",
});

const compressionDurationGauge = new Gauge({
  name: "image_compression_duration_seconds",
  help: "Time taken to compress an image",
});

// Запит на отримання секретних ключів для підключення до БД
async function getDbCredentials() {
  const client = new SecretManagerServiceClient();

  try {
    const [version] = await client.accessSecretVersion({
      name: `projects/secretproject-444511/secrets/mongo-db-credentials/versions/latest`,
    });

    const payload = version.payload.data.toString("utf8");
    const credentials = JSON.parse(payload);
    console.log("Secret available!");
    return credentials;
  } catch (error) {
    console.error("Failed to access secret:", error);
    throw error;
  }
}

// Приєднання до БД
async function connectToDatabase() {
  const credentials = await getDbCredentials();

  const uri = `mongodb://${credentials.username}:${credentials.password}@localhost:27017/my-appDB?authSource=admin`;

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}

connectToDatabase();

const db = mongoose.connection;
db.once("open", async () => {
  console.log("Connected to MongoDB!");

  // Перевірка та створення колекції `compressed_image`
  const compressedImageCollectionExists = await db.db
    .listCollections({ name: "compressed_image" })
    .hasNext();
  if (!compressedImageCollectionExists) {
    await db.db.createCollection("compressed_image");
    console.log("`compressed_image` collection have created!");
  }

  // Перевірка та створення колекції `user`
  const userCollectionExists = await db.db
    .listCollections({ name: "user" })
    .hasNext();
  if (!userCollectionExists) {
    await db.db.createCollection("user");
    console.log("`user` collection have created");
  }
});

const imageSchema = new mongoose.Schema({
  filename: String,
  data: Buffer,
  compressedAt: Date,
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  createdAt: { type: Date, default: Date.now },
});

const Image = mongoose.model("compressed_image", imageSchema);
const User = mongoose.model("user", userSchema);

const app = express();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "localhost";

const storage = multer.memoryStorage();
const upload = multer({ storage });
app.use(cors());
app.use(morgan("tiny"));
// Роут для отримання метрик Prometheus
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// Обробка запиту для завантаження і стиснення зображення
app.post("/api/upload", upload.single("image"), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json("No photo to download");
  }

  const start = Date.now();

  try {
    const compressedImage = await sharp(file.buffer)
      .resize({ width: 800 })
      .jpeg({ quality: 70 })
      .toBuffer();

    const newImage = new Image({
      filename: `${Date.now()}-compressed.jpg`,
      data: compressedImage,
      compressedAt: new Date(),
    });

    await newImage.save();

    const duration = (Date.now() - start) / 1000;
    compressionDurationGauge.set(duration);
    uploadCounter.inc();

    res.status(200).json("Зображення успішно завантажено та стиснуто");
  } catch (err) {
    console.error("Помилка стиснення зображення:", err);
    res.status(500).json("Помилка стиснення зображення");
  }
});

// Роут для отримання зображень
app.get("/api/getphoto", async (req, res) => {
  try {
    const images = await Image.find();

    const imageBuffers = images.map((image) => ({
      id: image._id,
      filename: image.filename,
      data: image.data.toString("base64"),
    }));

    res.json(imageBuffers);
  } catch (err) {
    console.error("An error occurred while receiving images:", err);
    res
      .status(500)
      .json({ message: "An error occurred while receiving images" });
  }
});
// Роут для видалення зображеня
app.delete("/api/images/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Пошук і видалення зображення
    const deletedImage = await Image.findByIdAndDelete(id);

    if (!deletedImage) {
      return res.status(404).json({ message: "Photo not found" });
    }

    res.status(200).json({
      message: "Photo delete successfully",
      deletedImage,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Роут для створення нового користувача
app.post("/api/user", async (req, res) => {
  try {
    const { name, email } = req.body;

    const newUser = new User({
      name,
      email,
    });

    await newUser.save();
    res.status(201).json("User have created successfull!");
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json("Error creating user");
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
