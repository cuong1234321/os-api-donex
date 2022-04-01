'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('voucher_conditions', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      voucherApplicationId: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      orderValue: {
        type: Sequelize.INTEGER, allowNull: true, defaultValue: 0,
      },
      discountValue: {
        type: Sequelize.INTEGER, allowNull: true, defaultValue: 0,
      },
      discountType: {
        type: Sequelize.ENUM({ values: ['cash', 'percent'] }),
        defaultValue: 'cash',
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
    return queryInterface.dropTable('voucher_conditions');
  },
};
