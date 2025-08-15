const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey"; // Лучше хранить в .env

// Регистрация пользователя (уже есть)
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ message: "Пользователь уже существует" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword });

        res.status(201).json({ message: "Пользователь зарегистрирован", user: newUser });
    } catch (error) {
        console.error("Ошибка регистрации:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: "Пользователь не найден" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Неверный пароль" });
        }

        // Генерируем JWT-токен
        const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, {
            expiresIn: "24h",
        });
        
        // Отправляем токен и пользователя
        res.json({
            message: "Успешный вход",
            token,
            user: { id: user.id, username: user.username , email: user.email, role: user.role } // 🔥 Добавляем user
        });

    } catch (error) {
        console.error("Ошибка авторизации:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

const logout = async (req, res) => {
    try {
        // На клиенте токен удаляется, поэтому сервер просто отправляет ответ
        res.json({ message: "Вы вышли из системы" });
    } catch (error) {
        console.error("Ошибка логаута:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

module.exports = { register, login, logout };
