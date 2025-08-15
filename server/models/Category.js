const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Category = sequelize.define("Category", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        // unique: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    collection: {
        type: DataTypes.STRING, 
        allowNull: true,
    },
});

module.exports = Category;
