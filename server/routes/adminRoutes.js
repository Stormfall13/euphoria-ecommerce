const express = require("express");
const { getAllUsers, updateUserByAdmin, deleteUserByAdmin } = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

// 🔒 Защищаем роуты авторизацией и проверкой роли администратора
router.get("/users", authMiddleware, adminMiddleware, getAllUsers); 
router.put("/users/:id", authMiddleware, adminMiddleware, updateUserByAdmin);
router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUserByAdmin);

module.exports = router;
