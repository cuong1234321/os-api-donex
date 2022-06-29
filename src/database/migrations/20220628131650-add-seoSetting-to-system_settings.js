'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('system_settings', 'seoSetting', {
      type: Sequelize.TEXT,
    }, { transaction }),
    queryInterface.addColumn('system_settings', 'robot', {
      type: Sequelize.TEXT,
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('system_settings', 'seoSetting', { transaction }),
    queryInterface.removeColumn('system_settings', 'robot', { transaction }),
  ])),
};
