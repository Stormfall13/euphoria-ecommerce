const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Product = require("./Product");
const User = require("./User"); // Предполагается, что у вас есть модель User

const Comment = sequelize.define("Comment", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Product,
            key: "id"
        },
        onDelete: "CASCADE"
    },
    // Для зарегистрированных пользователей
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Может быть null для анонимных
        references: {
            model: User,
            key: "id"
        }
    },
    // Для незарегистрированных пользователей
    guestName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    guestEmail: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true
        }
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    isPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false // Комментарий скрыт до модерации
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

// Определяем связи
Comment.belongsTo(Product, { foreignKey: "productId" });
Comment.belongsTo(User, { foreignKey: "userId" });
Product.hasMany(Comment, { foreignKey: "productId" });
User.hasMany(Comment, { foreignKey: "userId" });

module.exports = Comment;