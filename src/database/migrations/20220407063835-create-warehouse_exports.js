'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('warehouse_exports', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      adminId: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      type: {
        type: Sequelize.ENUM({ values: ['sell', 'others'] }), defaultValue: 'sell',
      },
      exportAbleType: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      exportAble: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      exportDate: {
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
    return queryInterface.dropTable('warehouse_exports');
  },
};
