'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('withdrawal_requests', {
      id: {
        type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true,
      },
      code: {
        type: Sequelize.STRING(255), allowNull: false,
      },
      ownerId: {
        type: Sequelize.STRING, allowNull: true,
      },
      userBankId: {
        type: Sequelize.STRING, allowNull: true,
      },
      amount: {
        type: Sequelize.STRING, allowNull: true,
      },
      status: {
        type: Sequelize.ENUM({ values: ['pending', 'approved', 'rejected'] }), defaultValue: 'pending',
      },
      approvalNote: {
        type: Sequelize.TEXT, allowNull: true,
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
    return queryInterface.dropTable('withdrawal_requests');
  },
};
