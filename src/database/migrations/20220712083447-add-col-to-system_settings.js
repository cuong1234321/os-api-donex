'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('system_settings', 'header', {
      type: Sequelize.TEXT,
      defaultValue: '[]',
    }, { transaction }),
    queryInterface.addColumn('system_settings', 'footer', {
      type: Sequelize.TEXT,
      defaultValue: '[]',
    }, { transaction }),
    queryInterface.addColumn('system_settings', 'mediaSocial', {
      type: Sequelize.TEXT,
      defaultValue: '[]',
    }, { transaction }),
    queryInterface.addColumn('system_settings', 'contact', {
      type: Sequelize.TEXT,
      defaultValue: '[]',
    }, { transaction }),
    queryInterface.addColumn('system_settings', 'supportInfo', {
      type: Sequelize.TEXT,
      defaultValue: '[]',
    }, { transaction }),
    queryInterface.addColumn('system_settings', 'suggestionKeyword', {
      type: Sequelize.TEXT,
      defaultValue: '[]',
    }, { transaction }),
    queryInterface.addColumn('system_settings', 'storeInfo', {
      type: Sequelize.TEXT,
      defaultValue: '[]',
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('system_settings', 'header', { transaction }),
    queryInterface.removeColumn('system_settings', 'footer', { transaction }),
    queryInterface.removeColumn('system_settings', 'mediaSocial', { transaction }),
    queryInterface.removeColumn('system_settings', 'contact', { transaction }),
    queryInterface.removeColumn('system_settings', 'supportInfo', { transaction }),
    queryInterface.removeColumn('system_settings', 'suggestionKeyword', { transaction }),
    queryInterface.removeColumn('system_settings', 'storeInfo', { transaction }),
  ])),
};
