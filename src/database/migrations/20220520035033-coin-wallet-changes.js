'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('coin_wallet_changes', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      type: {
        type: Sequelize.ENUM({ values: ['subtract', 'add'] }), allowNull: false,
      },
      mutableType: {
        type: Sequelize.STRING(30), allowNull: false,
      },
      mutableId: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      amount: {
        type: Sequelize.INTEGER, allowNull: false,
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
  down: async (queryInterface) => {
    return queryInterface.dropTable('coin_wallet_changes');
  },
};
