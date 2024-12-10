const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const cors = require("cors");
const mongoose = require("mongoose");
const { collectDefaultMetrics, register } = require("prom-client");
const { Counter, Gauge } = require("prom-client");

// Створення метрик для Prometheus
const uploadCounter = new Counter({
  name: "image_uploads_total",
  help: "Total number of image uploads",
});

const compressionDurationGauge = new Gauge({
  name: "image_compression_duration_seconds",
  help: "Time taken to compress an image",
});

// Підключення до MongoDB
mongoose.connect(
  "mongodb://admin:password@localhost:27017/my-appDB?authSource=admin"
);

const db = mongoose.connection;
db.once("open", async () => {
  console.log("Підключено до бази даних MongoDB");

  // Перевірка та створення колекції `compressed_image`
  const compressedImageCollectionExists = await db.db
    .listCollections({ name: "compressed_image" })
    .hasNext();
  if (!compressedImageCollectionExists) {
    await db.db.createCollection("compressed_image");
    console.log("Колекція `compressed_image` створена");
  }

  // Перевірка та створення колекції `user`
  const userCollectionExists = await db.db
    .listCollections({ name: "user" })
    .hasNext();
  if (!userCollectionExists) {
    await db.db.createCollection("user");
    console.log("Колекція `user` створена");
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

// Налаштування multer для зберігання завантажених зображень в пам'яті
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(cors());

// Реєстрація базових метрик Prometheus
collectDefaultMetrics();

// Роут для отримання метрик Prometheus
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// Обробка запиту для завантаження і стиснення зображення
app.post("/api/upload", upload.single("image"), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json("Немає файлу для завантаження");
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
    console.error("Помилка при отриманні зображень:", err);
    res.status(500).json({ message: "Помилка при отриманні зображень" });
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
    res.status(201).json("Користувач створений успішно");
  } catch (err) {
    console.error("Помилка при створенні користувача:", err);
    res.status(500).json("Помилка при створенні користувача");
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
