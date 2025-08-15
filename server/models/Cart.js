const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Cart = sequelize.define("Cart", {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
});

module.exports = Cart;
