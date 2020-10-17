const Sequelize = require("sequelize");
const Selector = require("./Selector");

const Attribute = sequelize.define("Attribute", {
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
  scrape_id: Sequelize.INTEGER(11),
});

Attribute.hasOne(Selector, {
  foreignKey: "attribute_id",
  as: "selector",
});

Selector.belongsTo(Attribute, {
  foreignKey: "attribute_id",
  onDelete: "CASCADE",
  as: "attribute",
});


module.exports = Attribute