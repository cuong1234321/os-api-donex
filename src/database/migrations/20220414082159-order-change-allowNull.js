
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('sub_orders', 'pickUpAt', {
      type: Sequelize.DATE,
    }, { transaction }),
    queryInterface.changeColumn('orders', 'code', {
      type: Sequelize.STRING(255), allowNull: true,
    }, { transaction }),
    queryInterface.changeColumn('orders', 'subTotal', {
      type: Sequelize.BIGINT, allowNull: true,
    }, { transaction }),
    queryInterface.changeColumn('orders', 'shippingFee', {
      type: Sequelize.BIGINT, allowNull: true,
    }, { transaction }),
    queryInterface.changeColumn('orders', 'total', {
      type: Sequelize.BIGINT, allowNull: true,
    }, { transaction }),
    queryInterface.changeColumn('sub_orders', 'subTotal', {
      type: Sequelize.BIGINT, allowNull: true,
    }, { transaction }),
    queryInterface.changeColumn('sub_orders', 'shippingFee', {
      type: Sequelize.BIGINT, allowNull: true,
    }, { transaction }),
    queryInterface.changeColumn('sub_orders', 'total', {
      type: Sequelize.BIGINT, allowNull: true,
    }, { transaction }),
    queryInterface.changeColumn('sub_orders', 'code', {
      type: Sequelize.STRING(255), allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('orders', 'promotionType', {
      type: Sequelize.STRING(255), allowNull: true, defaultValue: 'userVoucher',
    }, { transaction }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('sub_orders', 'pickUpAt', { transaction }),
    queryInterface.removeColumn('orders', 'promotionType', { transaction }),
    queryInterface.changeColumn('orders', 'code', {
      type: Sequelize.STRING(255), allowNull: false,
    }, { transaction }),
    queryInterface.changeColumn('sub_orders', 'code', {
      type: Sequelize.STRING(255), allowNull: false,
    }, { transaction }),
    queryInterface.changeColumn('orders', 'subTotal', {
      type: Sequelize.BIGINT, allowNull: false,
    }, { transaction }),
    queryInterface.changeColumn('orders', 'shippingFee', {
      type: Sequelize.BIGINT, allowNull: false,
    }, { transaction }),
    queryInterface.changeColumn('orders', 'total', {
      type: Sequelize.BIGINT, allowNull: false,
    }, { transaction }),
    queryInterface.changeColumn('sub_orders', 'subTotal', {
      type: Sequelize.BIGINT, allowNull: false,
    }, { transaction }),
    queryInterface.changeColumn('sub_orders', 'shippingFee', {
      type: Sequelize.BIGINT, allowNull: false,
    }, { transaction }),
    queryInterface.changeColumn('sub_orders', 'total', {
      type: Sequelize.BIGINT, allowNull: false,
    }, { transaction }),
  ])),
};
