"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return queryInterface.bulkInsert("users", [
      {
        name: "Superadmin",
        email: "superadmin@gmail.com",
        password: await bcrypt.hash("password", 10),
        role: "superadmin",
      },
      {
        name: "Admin",
        email: "admin@gmail.com",
        password: await bcrypt.hash("password", 10),
        role: "admin",
      },
      {
        name: "User",
        email: "user@gmail.com",
        password: await bcrypt.hash("password", 10),
        role: "user",
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete(
      "users",
      { email: "superadmin@gmail.com" },
      { email: "admin@gmail.com" },
      { email: "user@gmail.com" },
    );
  },
};
