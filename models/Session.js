const Sequelize = require("sequelize");
const User = require("./User")

const Session = sequelize.define("Session", {
  id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: Sequelize.INTEGER,
  name: Sequelize.STRING,
  code: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  lastLoggedIn: Sequelize.STRING,
  lastLoggedOut: Sequelize.STRING,
});

    // Session.belongsTo(User, {
    //   foreignKey: "user_id",
    //   onDelete: "CASCADE",
    // });

module.exports = Session
