'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.changeColumn('orders', 'shippingProvinceId', {
      type: Sequelize.STRING(255),
      allowNull: true,
    }, { transaction }),
    queryInterface.changeColumn('orders', 'shippingDistrictId', {
      type: Sequelize.STRING(255),
      allowNull: true,
    }, { transaction }),
    queryInterface.changeColumn('orders', 'shippingWardId', {
      type: Sequelize.STRING(255),
      allowNull: true,
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.changeColumn('orders', 'shippingProvinceId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    }, { transaction }),
    queryInterface.changeColumn('orders', 'shippingDistrictId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    }, { transaction }),
    queryInterface.changeColumn('orders', 'shippingWardId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    }, { transaction }),
  ])),
};
