'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('sub_orders', 'coinUsed', {
      type: Sequelize.INTEGER, allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('sub_orders', 'coinDiscount', {
      type: Sequelize.BIGINT, allowNull: true,
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('sub_orders', 'coinUsed', { transaction }),
    queryInterface.removeColumn('sub_orders', 'coinDiscount', { transaction }),
  ])),
};
