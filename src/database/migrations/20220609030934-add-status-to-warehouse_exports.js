'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('warehouse_exports', 'status', {
      type: Sequelize.ENUM({ values: ['pending', 'waitingToTransfer', 'complete', 'cancel'] }),
      defaultValue: 'pending',
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('warehouse_exports', 'status', { transaction }),
  ])),
};
