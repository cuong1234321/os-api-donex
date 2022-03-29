'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('warehouseReceipts', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      adminId: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      type: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      importAbleType: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      importAble: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      importDate: {
        type: Sequelize.DATE, allowNull: true,
      },
      orderId: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      deliverer: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      note: {
        type: Sequelize.TEXT, allowNull: true,
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
    return queryInterface.dropTable('warehouseReceipts');
  },
};
