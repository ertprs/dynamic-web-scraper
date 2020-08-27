const Sequelize = require("sequelize");

module.exports = sequelize.define("Scrape", {
  id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING(191),
  },
  user_id: Sequelize.INTEGER(11),
});
