'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('warehouseReceiptVariants', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      warehouseReceiptId: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      variantId: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      warehouseId: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      quantity: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      price: {
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
    return queryInterface.dropTable('warehouseReceiptVariants');
  },
};
