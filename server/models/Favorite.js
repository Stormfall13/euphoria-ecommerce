const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Favorite = sequelize.define("Favorite", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['userId', 'productId'] // чтобы не было дублей
    }
  ]
});

module.exports = Favorite;