const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Image = require("../models/Image");

const router = express.Router();

// Настройка хранения файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "..", "assets");
    
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true }); // Создаём папку, если её нет
        }
    
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Уникальное имя файла
    },
});

const upload = multer({ storage });

// 🚀 Маршрут для загрузки изображения
router.post("/upload", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Файл не был загружен" });
        }

        console.log("Файл загружен:", req.file); // ⬅️ Проверяем, какой файл приходит

        const newImage = await Image.create({
            filename: req.file.filename,
            filepath: `/assets/${req.file.filename}`,
        });
        console.log("Файл загружен:", req.file); 
        console.log("req.body:", req.body);
        
        res.status(201).json(newImage);
    } catch (error) {
        console.error("Ошибка загрузки изображения:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});


// 🚀 Маршрут для получения всех изображений
router.get("/", async (req, res) => {
    try {
        const images = await Image.findAll();
        res.json(images);
    } catch (error) {
        console.error("Ошибка получения изображений:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

router.use("/assets", express.static(path.join(__dirname, "../assets")));


// 🚀 Удаление изображения
router.delete("/:id", async (req, res) => {
    try {
        const image = await Image.findByPk(req.params.id);
        if (!image) return res.status(404).json({ message: "Изображение не найдено" });

        const filePath = path.join(__dirname, "../assets", image.filename);
        fs.unlinkSync(filePath); // Удаляем файл с диска

        await image.destroy(); // Удаляем запись из БД
        res.json({ message: "Изображение удалено" });
    } catch (error) {
        console.error("Ошибка удаления изображения:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

module.exports = router;