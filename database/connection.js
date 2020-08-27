const Sequelize = require("sequelize");
const sequelize = new Sequelize("dws", "root", "", {
  host: "localhost",
  dialect: "mysql",
  operatorAliases: false,
  timezone: 'Asia/Jakarta',
});

module.exports = sequelize;
global.sequelize = sequelize;
