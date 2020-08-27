const Sequelize = require("sequelize");

module.exports = sequelize.define("User", {
  id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING(191),
    allowNul: false,
  },
  email: {
    type: Sequelize.STRING(191),
    unique: true,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING(191),
    allowNull: false,
  },
});
