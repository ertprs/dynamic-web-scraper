const Sequelize = require("sequelize");
const Attribute = require("./Attribute");

const Scrape = sequelize.define("Scrape", {
  id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  code: {
    type: Sequelize.STRING(191),
    allowNull: false,
    unique: true,
  },
  url: {
    type: Sequelize.STRING(191),
  },
  page_title: {
    type: Sequelize.STRING(191),
    allowNull: true,
  },
  page_date: {
    type: Sequelize.STRING(191),
    allowNull: true,
  },
  content: {
    type: Sequelize.TEXT(),
  },
  user_id: Sequelize.INTEGER(11),
  attributes: {
    type: Sequelize.TEXT(),
  },
});

// Scrape.hasMany(Attribute, {
//   foreignKey: "scrape_id",
//   as: "attributes",
// });

// Attribute.belongsTo(Scrape, {
//   foreignKey: "scrape_id",
//   onDelete: "CASCADE",
//   as: "scrape",
// });

module.exports = Scrape;