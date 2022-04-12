'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('warehouse_transfers', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      adminId: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      code: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      fromWarehouseId: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      toWarehouseId: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      transferDate: {
        type: Sequelize.DATE, allowNull: true,
      },
      note: {
        type: Sequelize.TEXT, allowNull: true,
      },
      status: {
        type: Sequelize.ENUM({ values: ['pending', 'confirm'] }), defaultValue: 'pending',
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
    return queryInterface.dropTable('warehouse_transfers');
  },
};
