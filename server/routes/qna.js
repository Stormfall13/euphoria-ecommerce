const express = require("express");
const router = express.Router();
const QnA = require('../models/QnA');
const Product = require('../models/Product');
const User = require('../models/User');
const auth = require("../middlewares/authMiddleware"); // Обязательная аутентификация

// GET /api/qna/product/:productId - Получить все вопросы и ответы для товара
router.get("/product/:productId", async (req, res) => {
    try {
        const { productId } = req.params;

        const allQnA = await QnA.findAll({
            where: { productId },
            include: [
                {
                    model: User,
                    attributes: ["id", "username"], // Показываем имя автора
                },
                {
                    model: QnA,
                    as: 'Parent', // Включаем данные родительского вопроса, если это ответ
                    attributes: ["id"],
                    required: false
                }
            ],
            order: [
                ["createdAt", "DESC"] // Сначала новые вопросы
            ]
        });

        // Формируем иерархическую структуру: вопросы и вложенные в них ответы
        const questions = allQnA.filter(item => item.parentId === null);
        const answers = allQnA.filter(item => item.parentId !== null);

        const qnaWithAnswers = questions.map(question => {
            const questionPlain = question.get({ plain: true });
            questionPlain.answers = answers
                .filter(answer => answer.parentId === question.id)
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Ответы по порядку
            return questionPlain;
        });

        res.json(qnaWithAnswers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка при загрузке вопросов и ответов" });
    }
});

// POST /api/qna - Создать новый вопрос ИЛИ ответ (Только для аутентифицированных)
router.post("/", auth, async (req, res) => {
    try {
        // req.user доступен благодаря middleware auth
        const { productId, text, parentId } = req.body;

        if (!productId || !text) {
            return res.status(400).json({ message: "ProductId и текст обязательны" });
        }

        const newQnA = await QnA.create({
            productId,
            userId: req.user.userId, // ID из токена
            text,
            parentId: parentId || null // Если parentId передан, это ответ.
        });

        // Находим созданный вопрос/ответ с данными пользователя
        const createdQnA = await QnA.findByPk(newQnA.id, {
            include: [
                {
                    model: User,
                    attributes: ["id", "username"],
                }
            ]
        });

        res.status(201).json(createdQnA);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка при создании вопроса/ответа" });
    }
});

// DELETE /api/qna/:id - Удалить свой вопрос/ответ (Может автор или админ)
// router.delete("/:id", auth, async (req, res) => {
//     try {
//         const qnaItem = await QnA.findByPk(req.params.id);
//         if (!qnaItem) {
//             return res.status(404).json({ message: "Вопрос/ответ не найден" });
//         }

//         // Проверяем права: автор или админ
//         if (qnaItem.userId !== req.user.id && req.user.role !== "admin") {
//             return res.status(403).json({ message: "Можно удалять только свои сообщения" });
//         }

//         // Если удаляется вопрос, каскадно удаляем все ответы (настроено в БД)
//         await qnaItem.destroy();
//         res.json({ message: "Удалено" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Ошибка при удалении" });
//     }
// });

// DELETE /api/qna/:id - Удалить вопрос/ответ (только админ)
router.delete("/:id", auth, async (req, res) => {
    try {
        // Только админ
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Нет доступа. Удалять может только админ" });
        }

        const qnaItem = await QnA.findByPk(req.params.id);
        if (!qnaItem) {
            return res.status(404).json({ message: "Вопрос/ответ не найден" });
        }

        // Каскадное удаление ответов произойдет автоматически благодаря onDelete: "CASCADE"
        await qnaItem.destroy();

        res.json({ message: "Удалено" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка при удалении" });
    }
});

module.exports = router;