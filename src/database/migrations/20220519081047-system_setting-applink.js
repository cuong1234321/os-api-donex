'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.renameColumn('system_settings', 'applicationLink', 'androidAppLink', { transaction }),
    queryInterface.addColumn('system_settings', 'iosAppLink', {
      type: Sequelize.STRING(255), allowNull: true,
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.renameColumn('system_settings', 'androidAppLink', 'applicationLink', { transaction }),
    queryInterface.removeColumn('system_settings', 'iosAppLink', { transaction }),
  ])),
};
