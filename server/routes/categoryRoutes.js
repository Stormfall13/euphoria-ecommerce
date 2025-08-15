const express = require("express");
const Category = require("../models/Category");
const Product = require("../models/Product");

const router = express.Router();

// Получить все категории
router.get("/", async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: "Ошибка сервера", error: err.message });
    }
});

//     // Получить все товары из категории
//     router.get("/:name", async (req, res) => {
//     try {
//         const { name } = req.params;
//         const category = await Category.findOne({ where: { name } });

//         if (!category) {
//         return res.status(404).json({ message: "Категория не найдена" });
//         }

//         const products = await Product.findAll({ where: { categoryId: category.id } });
//         res.json(products);
//     } catch (err) {
//         res.status(500).json({ message: "Ошибка сервера", error: err.message });
//     }
// });

// Получить категорию по ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({ message: "Категория не найдена" });
        }

        res.json(category);
    } catch (err) {
        res.status(500).json({ message: "Ошибка сервера", error: err.message });
    }
});

// Создать категорию
router.post("/", async (req, res) => {
    try {
        const { name, description, image, collection } = req.body;
    
        if (!name) {
            return res.status(400).json({ message: "Название категории обязательно" });
        }
    
        const newCategory = await Category.create({ name, description, image, collection });
        res.status(201).json(newCategory);
        } catch (err) {
            console.error("❌ Ошибка при создании категории:", err);
            res.status(500).json({ message: "Ошибка сервера", error: err.message });
            
        }
});

// Обновить категорию
router.put("/:id", async (req, res) => {
    try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
        return res.status(404).json({ message: "Категория не найдена" });
    }

    category.name = name || category.name;
    await category.save();

    res.json({ message: "Категория обновлена", category });
    } catch (err) {
    res.status(500).json({ message: "Ошибка сервера", error: err.message });
    }
});

// Удалить категорию
router.delete("/:id", async (req, res) => {
    try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
        return res.status(404).json({ message: "Категория не найдена" });
    }

    await category.destroy();

    res.json({ message: "Категория удалена" });
    } catch (err) {
    res.status(500).json({ message: "Ошибка сервера", error: err.message });
    }
});

module.exports = router;
