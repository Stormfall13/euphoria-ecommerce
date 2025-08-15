const User = require("../models/User");

// Получить всех пользователей
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ["password"] } // Исключаем пароли из вывода
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера", error });
    }
};

// Обновить пользователя по ID
const updateUserByAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, role } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        await user.update({ username, email, role });
        res.status(200).json({ message: "Пользователь обновлён" });
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера", error });
    }
};

// Удалить пользователя по ID
const deleteUserByAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        await user.destroy();
        res.status(200).json({ message: "Пользователь удалён" });
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера", error });
    }
};


module.exports = { getAllUsers, updateUserByAdmin, deleteUserByAdmin };
