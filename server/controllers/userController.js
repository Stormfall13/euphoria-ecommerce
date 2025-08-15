const User = require("../models/User");

// Получение всех пользователей
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ["id", "username", "email", "role"] // Исключаем пароль
        });
        res.json(users);
    } catch (error) {
        console.error("Ошибка при получении пользователей:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

// Получение одного пользователя по ID
// const getUserById = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const user = await User.findByPk(id, {
//             attributes: ["id", "username", "email", "role"] // Исключаем пароль
//         });

//         if (!user) {
//             return res.status(404).json({ message: "Пользователь не найден" });
//         }

//         res.json(user);
//     } catch (error) {
//         console.error("Ошибка при получении пользователя:", error);
//         res.status(500).json({ message: "Ошибка сервера" });
//     }
// };
const getUserById = async (req, res) => {
    const userId = req.params.id;
  
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Неверный ID" });
    }
  
    try {
      const user = await User.findByPk(userId, {
        attributes: ["id", "username", "email", "role"],
      });
  
      if (!user) return res.status(404).json({ error: "Пользователь не найден" });
  
      res.json(user);
    } catch (err) {
      console.error("Ошибка при получении пользователя:", err);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  };

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        await user.update({ username, email });

        res.json({ message: "Профиль обновлён", user });
    } catch (error) {
        console.error("Ошибка обновления:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        await user.destroy();
        res.json({ message: "Пользователь удалён" });
    } catch (error) {
        console.error("Ошибка удаления:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

module.exports = { getUsers, getUserById, updateUser, deleteUser };
