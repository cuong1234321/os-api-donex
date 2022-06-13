'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('look_books', {
      id: {
        type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true,
      },
      lookBookId: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      source: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    }, {
      charset: 'utf8mb4',
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('look_books');
  },
};
