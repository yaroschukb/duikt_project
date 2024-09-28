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

// Шлях до папки зі зібраним Angular-проєктом
const distDir = path.join(__dirname, "browser");

// Налаштування віддачі статичних файлів Angular
app.use(express.static(distDir));

// Перевірка наявності папки 'compressed', створення, якщо не існує
const compressedDir = path.join(__dirname, "compressed");
if (!fs.existsSync(compressedDir)) {
  fs.mkdirSync(compressedDir);
}

app.get("*", (req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

// Обробка запиту для завантаження і стиснення зображення
app.post("/upload", upload.single("image"), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send("Немає файлу для завантаження");
  }

  const outputPath = path.join(compressedDir, `${Date.now()}-compressed.jpg`);

  sharp(file.buffer)
    .resize({ width: 800 }) // Зміна розміру
    .jpeg({ quality: 70 }) // Стиснення
    .toFile(outputPath, (err, info) => {
      if (err) {
        return res.status(500).send("Помилка стиснення зображення");
      }
      // Відправлення стисненого зображення клієнту
      res.sendFile(outputPath, (err) => {
        if (err) {
          return res.status(500).send("Помилка відправлення зображення");
        }
        // Видалення стисненого файлу після відправлення
        fs.unlinkSync(outputPath);
      });
    });
});

app.listen(PORT, () => {
  console.log(`Сервер працює на порту ${PORT}`);
});
