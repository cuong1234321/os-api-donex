'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('sub_orders', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      code: {
        type: Sequelize.STRING(255), allowNull: false,
      },
      partnerCode: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      orderId: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      warehouseId: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      subTotal: {
        type: Sequelize.BIGINT, allowNull: false,
      },
      shippingFee: {
        type: Sequelize.BIGINT, allowNull: false,
      },
      shippingDiscount: {
        type: Sequelize.BIGINT, allowNull: true,
      },
      total: {
        type: Sequelize.BIGINT, allowNull: false,
      },
      shippingCode: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      status: {
        type: Sequelize.STRING(255), defaultValue: 'pending',
      },
      orderFinishAt: {
        type: Sequelize.DATE, allowNull: true,
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
      uniqueKeys: {
        unique_code: { fields: ['code'] },
      },
    });
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('sub_orders');
  },
};
