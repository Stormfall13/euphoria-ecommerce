const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favoriteController");
const authMiddleware = require("../middlewares/authMiddleware"); // если есть

// ➕ Добавить товар в избранное
router.post("/add/:productId", authMiddleware, favoriteController.addToFavorites);

// ❌ Удалить товар из избранного
router.delete("/remove/:productId", authMiddleware, favoriteController.removeFromFavorites);

// 📥 Получить все избранные товары текущего пользователя
router.get("/", authMiddleware, favoriteController.getUserFavorites); // GET /api/favorites


module.exports = router;