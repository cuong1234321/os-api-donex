'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('seller_warehouses', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      adminId: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      warehouseId: {
        type: Sequelize.INTEGER, allowNull: false,
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
    return queryInterface.dropTable('seller_warehouses');
  },
};
