'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('bank_accounts', {
      id: {
        type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true,
      },
      bankId: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      bankAccount: {
        type: Sequelize.STRING(255), allowNull: false,
      },
      bankOwner: {
        type: Sequelize.STRING(255), allowNull: false,
      },
      qrCode: {
        type: Sequelize.STRING, allowNull: true,
      },
      status: {
        type: Sequelize.ENUM({ values: ['active', 'inactive'] }), defaultValue: 'active',
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    }, {
      charset: 'utf8mb4',
    });
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('bank_accounts');
  },
};
