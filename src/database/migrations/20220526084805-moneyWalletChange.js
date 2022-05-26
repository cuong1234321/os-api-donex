'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('money_wallet_changes', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      ownerId: {
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
      created_at: {
        type: Sequelize.DATE,
      },
      updated_at: {
        type: Sequelize.DATE,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    }, {
      charset: 'utf8mb4',
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('money_wallet_changes');
  },
};
