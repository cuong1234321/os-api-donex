
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('system_settings', 'hotline', {
      type: Sequelize.INTEGER,
      allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('system_settings', 'hotlineUser', {
      type: Sequelize.INTEGER,
      allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('system_settings', 'hotlineAgency', {
      type: Sequelize.INTEGER,
      allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('system_settings', 'facebookLink', {
      type: Sequelize.STRING(255),
      allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('system_settings', 'instagramLink', {
      type: Sequelize.STRING(255),
      allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('system_settings', 'twitterLink', {
      type: Sequelize.STRING(255),
      allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('system_settings', 'shopeeLink', {
      type: Sequelize.STRING(255),
      allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('system_settings', 'lazadaLink', {
      type: Sequelize.STRING(255),
      allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('system_settings', 'tikiLink', {
      type: Sequelize.STRING(255),
      allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('system_settings', 'amazonLink', {
      type: Sequelize.STRING(255),
      allowNull: true,
    }, { transaction }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('system_settings', 'hotline', { transaction }),
    queryInterface.removeColumn('system_settings', 'hotlineUser', { transaction }),
    queryInterface.removeColumn('system_settings', 'hotlineAgency', { transaction }),
    queryInterface.removeColumn('system_settings', 'facebookLink', { transaction }),
    queryInterface.removeColumn('system_settings', 'instagramLink', { transaction }),
    queryInterface.removeColumn('system_settings', 'twitterLink', { transaction }),
    queryInterface.removeColumn('system_settings', 'shopeeLink', { transaction }),
    queryInterface.removeColumn('system_settings', 'lazadaLink', { transaction }),
    queryInterface.removeColumn('system_settings', 'tikiLink', { transaction }),
    queryInterface.removeColumn('system_settings', 'amazonLink', { transaction }),
  ])),
};
