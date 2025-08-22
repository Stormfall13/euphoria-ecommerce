const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Product = require("../models/Product");
const User = require("../models/User");

const QnA = sequelize.define("QnA", {
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
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false, // Только для зарегистрированных!
        references: {
            model: User,
            key: "id"
        }
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    parentId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Если null - это вопрос. Если число - это ответ на вопрос с этим ID.
        references: {
            model: 'QnAs', // Ссылка на эту же таблицу
            key: 'id'
        },
        onDelete: "CASCADE",
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

// Определяем связи
QnA.belongsTo(Product, { foreignKey: "productId" });
QnA.belongsTo(User, { foreignKey: "userId" });
QnA.belongsTo(QnA, { as: 'Parent', foreignKey: 'parentId' }); // Связь на самого себя
Product.hasMany(QnA, { foreignKey: "productId" });
User.hasMany(QnA, { foreignKey: "userId" });

module.exports = QnA;