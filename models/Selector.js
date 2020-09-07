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
  type: {
    type: Sequelize.STRING(191),
    allowNul: false,
  },
  traversal_type: {
    type: Sequelize.STRING(191),
    allowNul: false,
  },
  attribute_id: Sequelize.INTEGER(11),
});
