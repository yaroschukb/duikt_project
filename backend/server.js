const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

// Налаштування multer для зберігання завантажених зображень
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(cors());

// Обробка запиту для завантаження і стиснення зображення
app.post("/upload", upload.single("image"), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send("Немає файлу для завантаження");
  }

  const outputPath = path.join(
    __dirname,
    "compressed",
    `${Date.now()}-compressed.jpg`
  );

  sharp(file.buffer)
    .resize({ width: 800 }) // Зміна розміру
    .jpeg({ quality: 70 }) // Стиснення
    .toFile(outputPath, (err, info) => {
      if (err) {
        return res.status(500).send("Помилка стиснення зображення");
      }
      res.send(`Зображення успішно стиснене: ${info}`);
    });
});

app.listen(PORT, () => {
  console.log(`Сервер працює на порту ${PORT}`);
});
