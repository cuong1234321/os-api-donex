'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('sub_orders', 'rankDiscount', {
      type: Sequelize.BIGINT,
      defaultValue: 0,
    }, { transaction }),
    queryInterface.addColumn('orders', 'rankDiscount', {
      type: Sequelize.BIGINT,
      defaultValue: 0,
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('sub_orders', 'rankDiscount', { transaction }),
    queryInterface.removeColumn('orders', 'rankDiscount', { transaction }),
  ])),
};