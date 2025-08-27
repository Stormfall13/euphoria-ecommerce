const express = require("express");
const router = express.Router();
const Comment = require('../models/Comment');
const Product = require('../models/Product');
const User = require('../models/User');
const auth = require("../middlewares/authMiddleware"); // Промежуточное ПО для проверки auth

// GET /api/comments/product/:productId - Получить все ОПУБЛИКОВАННЫЕ комментарии для товара
router.get("/product/:productId", async (req, res) => {
    try {
        const { productId } = req.params;

        const comments = await Comment.findAll({
            where: {
                productId,
                isPublished: true // Показываем только прошедшие модерацию
            },
            include: [
                {
                    model: User,
                    attributes: ["id", "username", "email"], // Не показываем пароль
                    required: false // LEFT JOIN, так как пользователь может быть гостем
                }
            ],
            order: [["createdAt", "DESC"]] // Сначала новые
        });

        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка при загрузке комментариев" });
    }
});

// POST /api/comments - Создать новый комментарий
router.post("/", async (req, res) => {
    try {
        const { productId, userId, guestName, guestEmail, text, rating } = req.body;

        // Проверка обязательных полей
        if (!productId || !text) {
            return res.status(400).json({ message: "ProductId и текст обязательны" });
        }

        // Если пользователь не аутентифицирован (гость), проверяем имя
        if (!userId && (!guestName || !guestEmail)) {
            return res.status(400).json({ message: "Для гостя обязательны имя и email" });
        }

        const newComment = await Comment.create({
            productId,
            userId: userId || null,
            guestName,
            guestEmail,
            text,
            rating,
            isPublished: false // По умолчанию на модерации
        });

        // Находим новый комментарий вместе с данными пользователя (если есть) для ответа
        const createdComment = await Comment.findByPk(newComment.id, {
            include: [
                {
                    model: User,
                    attributes: ["id", "username"],
                    required: false
                }
            ]
        });

        res.status(201).json(createdComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка при создании комментария" });
    }
});

// GET /api/comments/moderation - Получить все комментарии для модерации (Только для админов)
router.get("/moderation", auth, async (req, res) => {
    try {
        // Проверяем, что пользователь админ
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Нет доступа" });
        }

        const comments = await Comment.findAll({
            where: {
                isPublished: false // Только те, что ждут модерации
            },
            include: [
                {
                    model: Product,
                    attributes: ["id", "nameProd"]
                },
                {
                    model: User,
                    attributes: ["id", "username", "email"],
                    required: false
                }
            ],
            order: [["createdAt", "ASC"]] // Сначала старые
        });

        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка при загрузке комментариев" });
    }
});

// GET /api/comments/published - опубликованные комментарии  
router.get('/published', auth, async (req, res) => {
    try {
      const comments = await Comment.findAll({
        where: { isPublished: true },
        include: [{ model: Product }, { model: User }],
        order: [['createdAt', 'DESC']]
      });
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка загрузки' });
    }
});

// PUT /api/comments/:id/publish - Опубликовать комментарий (Только для админов)
router.put("/:id/publish", auth, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Нет доступа" });
        }

        const comment = await Comment.findByPk(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: "Комментарий не найден" });
        }

        comment.isPublished = true;
        await comment.save();

        res.json({ message: "Комментарий опубликован" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка при публикации комментария" });
    }
});

// DELETE /api/comments/:id - Удалить комментарий (Только для админов)
router.delete("/:id", auth, async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Нет доступа" });
        }

        const comment = await Comment.findByPk(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: "Комментарий не найден" });
        }

        await comment.destroy();
        res.json({ message: "Комментарий удален" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка при удалении комментария" });
    }
});

module.exports = router;