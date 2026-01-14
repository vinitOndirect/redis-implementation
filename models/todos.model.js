const sequelize = require("../database");
const { DataTypes } = require("sequelize");

const Todo = sequelize.define(
  "todo",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    completed: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    tableName: "todos",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Todo;
