'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.renameTable('seller_warehouses', 'admin_warehouses', { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.renameTable('admin_warehouses', 'seller_warehouses', { transaction }),
  ])),
};
