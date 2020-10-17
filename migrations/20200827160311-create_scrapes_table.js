"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("scrapes", {
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
      createdAt: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("scrapes");
  },
};
