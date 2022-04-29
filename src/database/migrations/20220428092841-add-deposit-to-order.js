
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('sub_orders', 'deposit', {
      type: Sequelize.BIGINT,
      allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('sub_orders', 'weight', {
      type: Sequelize.INTEGER,
      allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('sub_orders', 'length', {
      type: Sequelize.INTEGER,
      allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('sub_orders', 'width', {
      type: Sequelize.INTEGER,
      allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('sub_orders', 'height', {
      type: Sequelize.INTEGER,
      allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('sub_orders', 'shippingFeeMisa', {
      type: Sequelize.BIGINT,
      allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('sub_orders', 'deliveryType', {
      type: Sequelize.STRING(255),
      allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('sub_orders', 'deliveryInfo', {
      type: Sequelize.TEXT,
      allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('sub_orders', 'note', {
      type: Sequelize.TEXT,
      allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('sub_orders', 'shippingType', {
      type: Sequelize.STRING(255),
      allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('sub_orders', 'shippingAttributeType', {
      type: Sequelize.STRING(255),
      allowNull: true,
    }, { transaction }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('sub_orders', 'weight', { transaction }),
    queryInterface.removeColumn('sub_orders', 'length', { transaction }),
    queryInterface.removeColumn('sub_orders', 'width', { transaction }),
    queryInterface.removeColumn('sub_orders', 'height', { transaction }),
    queryInterface.removeColumn('sub_orders', 'shippingFeeMisa', { transaction }),
    queryInterface.removeColumn('sub_orders', 'deliveryType', { transaction }),
    queryInterface.removeColumn('sub_orders', 'note', { transaction }),
    queryInterface.removeColumn('sub_orders', 'shippingType', { transaction }),
    queryInterface.removeColumn('sub_orders', 'shippingAttributeType', { transaction }),
    queryInterface.removeColumn('sub_orders', 'deposit', { transaction }),
    queryInterface.removeColumn('sub_orders', 'deliveryInfo', { transaction }),
  ])),
};
