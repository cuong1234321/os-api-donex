'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('seller_banks', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      sellerId: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      bankId: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      branch: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      ownerName: {
        type: Sequelize.STRING(255), allowNull: false,
      },
      accountNumber: {
        type: Sequelize.STRING(255), allowNull: false,
      },
      isDefaultAccount: {
        type: Sequelize.BOOLEAN, defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DATE, field: 'created_at',
      },
      updatedAt: {
        type: Sequelize.DATE, field: 'updated_at',
      },
    }, {
      charset: 'utf8mb4',
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('seller_banks');
  },
};
