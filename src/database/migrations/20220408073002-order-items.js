'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('order_items', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      subOrderId: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      productVariantId: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      sellingPrice: {
        type: Sequelize.BIGINT, allowNull: true,
      },
      commission: {
        type: Sequelize.BIGINT, allowNull: true,
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
    return queryInterface.dropTable('order_items');
  },
};
