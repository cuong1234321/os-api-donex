'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('orders', 'finalAmount', {
      type: Sequelize.BIGINT,
      defaultValue: 0,
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('orders', 'finalAmount', { transaction }),
  ])),
};
