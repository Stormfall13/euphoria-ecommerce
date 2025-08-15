const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const adminMiddleware = async (req, res, next) => {
    try {
        // Проверяем, есть ли заголовок Authorization
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Нет токена, доступ запрещён" });
        }

        // Извлекаем токен
        const token = authHeader.split(" ")[1];

        // Проверяем токен
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Достаём пользователя из базы
        const user = await User.findByPk(decoded.id || decoded.userId); // Может быть `id` или `userId`
        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        // Проверяем роль
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Доступ запрещён" });
        }

        // Передаём данные пользователя дальше
        req.user = user;
        next();
    } catch (error) {
        console.error("Ошибка в adminMiddleware:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

module.exports = adminMiddleware;
