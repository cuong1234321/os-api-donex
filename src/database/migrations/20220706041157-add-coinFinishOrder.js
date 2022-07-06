'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('system_settings', 'coinFinishOrder', {
      type: Sequelize.FLOAT,
      defaultValue: 0.5,
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('system_settings', 'coinFinishOrder', { transaction }),
  ])),
};
