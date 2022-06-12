'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('sub_order_shippings', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      subOrderId: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      content: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      incurredAt: {
        type: Sequelize.DATE, allowNull: true,
      },
      status: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      ghnWarehouse: {
        type: Sequelize.STRING(255), allowNull: true,
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
    return queryInterface.dropTable('sub_order_shippings');
  },
};
