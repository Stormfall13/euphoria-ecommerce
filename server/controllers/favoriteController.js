const Favorite = require('../models/Favorite');
const Product = require('../models/Product');


// ➕ Добавить товар в избранное
const addToFavorites = async (req, res) => {
    const userId = req.user.userId;
    const { productId } = req.params;

    try {
        // Проверка: уже в избранном?
        const existing = await Favorite.findOne({ where: { userId, productId } });
        if (existing) {
        return res.status(400).json({ message: "Товар уже в избранном." });
        }

        const favorite = await Favorite.create({ userId, productId });
        res.status(201).json(favorite);
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера", error: error.message });
    }
};

// ❌ Удалить из избранного
const removeFromFavorites = async (req, res) => {
    const userId = req.user.userId;
    const { productId } = req.params;

    try {
        const deleted = await Favorite.destroy({ where: { userId, productId } });
        if (!deleted) {
        return res.status(404).json({ message: "Товар не найден в избранном." });
        }

        res.json({ message: "Удалено из избранного." });
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера", error: error.message });
    }
};

// 📥 Получить все избранные товары пользователя
const getUserFavorites = async (req, res) => {
    try {
      const userId = req.user.userId;
  
      const favorites = await Favorite.findAll({
        where: { userId }, // <--- ОБЯЗАТЕЛЬНО
        include: [
          {
            model: Product,
            attributes: ['id', 'nameProd', 'price', 'images', 'stock', 'sizes', 'colors', 'isNew', 'isHit', 'isSale']
          }
        ]
      });
  
      res.json(favorites);
    } catch (error) {
      console.error("Ошибка при получении избранного:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
};

module.exports = {
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
};
