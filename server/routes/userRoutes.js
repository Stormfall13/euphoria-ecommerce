const express = require("express");
const { updateUser, deleteUser, getUsers, getUserById } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/users", authMiddleware, getUsers); // 🔒 Получение всех пользователей
router.get("/users/:id", authMiddleware, getUserById); // 🔒 Получение пользователя по ID
router.put("/update/:id", authMiddleware, updateUser);  
router.delete("/delete/:id", authMiddleware, deleteUser); 

module.exports = router;
