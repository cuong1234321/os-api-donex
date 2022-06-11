'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('sub_orders', 'otherDiscounts', {
      type: Sequelize.TEXT,
      defaultValue: '[]',
    }, { transaction }),
    queryInterface.addColumn('sub_orders', 'totalOtherDiscount', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('sub_orders', 'otherDiscounts', { transaction }),
    queryInterface.removeColumn('sub_orders', 'totalOtherDiscount', { transaction }),
  ])),
};
