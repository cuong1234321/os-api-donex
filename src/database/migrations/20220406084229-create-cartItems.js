'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('cart_items', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      cartId: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      productVariantId: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      quantity: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      warehouseVariantId: {
        type: Sequelize.INTEGER, allowNull: true,
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
    return queryInterface.dropTable('cart_items');
  },
};
