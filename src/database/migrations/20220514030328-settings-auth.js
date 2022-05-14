'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('system_settings', 'environment', {
      type: Sequelize.STRING(255), allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('system_settings', 'accessToken', {
      type: Sequelize.TEXT, allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('system_settings', 'companyCode', {
      type: Sequelize.STRING(255), allowNull: true,
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('system_settings', 'environment'),
    queryInterface.removeColumn('system_settings', 'accessToken'),
    queryInterface.removeColumn('system_settings', 'companyCode'),
  ])),
};
