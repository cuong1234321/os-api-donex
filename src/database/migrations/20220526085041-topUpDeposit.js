'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('top_up_deposits', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      code: {
        type: Sequelize.STRING(255), allowNull: false,
      },
      ownerId: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      creatableType: {
        type: Sequelize.ENUM({ values: ['admin', 'user'] }), defaultValue: 'user',
      },
      type: {
        type: Sequelize.ENUM({ values: ['vnPay', 'banking'] }), defaultValue: 'vnPay',
      },
      transactionId: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      status: {
        type: Sequelize.ENUM({ values: ['pending', 'complete'] }), defaultValue: 'pending',
      },
      amount: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      note: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      portalConfirmAt: {
        type: Sequelize.DATE,
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
    return queryInterface.dropTable('top_up_deposits');
  },
};
