'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('system_settings', 'tawktoScriptUrl', {
      type: Sequelize.STRING(255),
      defaultValue: true,
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('system_settings', 'tawktoScriptUrl', { transaction }),
  ])),
};
