'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('orders', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      code: {
        type: Sequelize.STRING(255), allowNull: false,
      },
      ownerId: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      orderableType: {
        type: Sequelize.ENUM({ values: ['user', 'collaborator', 'distributor', 'agency'] }), defaultValue: 'user',
      },
      orderableId: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      creatableType: {
        type: Sequelize.ENUM({ values: ['user', 'admin', 'supplier', 'collaborator', 'distributor'] }), defaultValue: 'user',
      },
      creatableId: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      paymentMethod: {
        type: Sequelize.ENUM({ values: ['banking', 'vnPay', 'COD', 'wallet'] }), allowNull: false,
      },
      saleChannel: {
        type: Sequelize.ENUM({ values: ['facebook', 'lazada', 'shopee', 'tiki', 'wholesale', 'other'] }), allowNull: false,
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
      coinUsed: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      total: {
        type: Sequelize.BIGINT, allowNull: false,
      },
      appliedVoucherId: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      shippingFullName: {
        type: Sequelize.STRING(255), allowNull: false,
      },
      shippingPhoneNumber: {
        type: Sequelize.STRING(30), allowNull: false,
      },
      shippingProvinceId: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      shippingDistrictId: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      shippingWardId: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      shippingAddress: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      transactionId: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      paidAt: {
        type: Sequelize.DATE, allowNull: true,
      },
      portalConfirmAt: {
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
    return queryInterface.dropTable('orders');
  },
};
