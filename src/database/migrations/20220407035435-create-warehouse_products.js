'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('warehouse_variants', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      warehouseId: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      variantId: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      quantity: {
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
    return queryInterface.dropTable('warehouse_variants');
  },
};
