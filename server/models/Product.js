const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Category = require("./Category");

const Product = sequelize.define("Product", {
    nameProd: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
        model: Category,
        key: "id",
        onDelete: "CASCADE", // <-- Добавляем каскадное удаление
        },
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: true, // Может быть пустым
    },
    images: {  // 🔹 массив картинок
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    },
    sizes: {  // 🔹 массив строк (размеры)
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    },
    colors: { // 🔹 массив строк (hex-коды)
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    isNew: { // Новинка
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isHit: { // Хит продаж
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isSale: { // Акция
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

module.exports = Product;
