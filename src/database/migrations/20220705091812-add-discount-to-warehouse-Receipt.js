'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('warehouseReceipts', 'discount', {
      type: Sequelize.BIGINT,
      defaultValue: 0,
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('warehouseReceipts', 'discount', { transaction }),
  ])),
};
