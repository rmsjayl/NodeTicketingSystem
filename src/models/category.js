const commonConstants = require("../common/constants");
const sequelize = require("../database/db_conn");
const { DataTypes } = require("sequelize");

const Category = sequelize.define("Category", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  details: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  timestamps: true,
});

module.exports = Category;