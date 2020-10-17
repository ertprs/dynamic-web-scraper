const Sequelize = require("sequelize");
const Scrape = require("./Scrape");

const User = sequelize.define("User", {
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
  role: {
    type: Sequelize.STRING(191),
    allowNull: false,
  },
});

User.hasMany(Scrape, {
  foreignKey: "user_id",
  as: "Scrapes",
});
Scrape.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  as: "user",
});

module.exports = User;
