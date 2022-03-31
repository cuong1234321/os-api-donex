
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('system_settings', 'agencyAffiliate', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    }, { transaction }),
    queryInterface.addColumn('system_settings', 'collaboratorAffiliate', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    }, { transaction }),
    queryInterface.addColumn('system_settings', 'distributorAffiliate', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    }, { transaction }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('system_settings', 'agencyAffiliate', { transaction }),
    queryInterface.removeColumn('system_settings', 'collaboratorAffiliate', { transaction }),
    queryInterface.removeColumn('system_settings', 'distributorAffiliate', { transaction }),
  ])),
};
