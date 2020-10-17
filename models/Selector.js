const Sequelize = require("sequelize");

const Selector = sequelize.define("Selector", {
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

module.exports = Selector