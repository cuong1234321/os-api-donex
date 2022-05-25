'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.changeColumn('m_wards', 'misaCode', {
      type: Sequelize.STRING(30), allowNull: true,
    }, { transaction }),
    queryInterface.changeColumn('m_districts', 'misaCode', {
      type: Sequelize.STRING(30), allowNull: true,
    }, { transaction }),
    queryInterface.changeColumn('m_provinces', 'misaCode', {
      type: Sequelize.STRING(30), allowNull: true,
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.changeColumn('m_wards', 'misaCode', {
      type: Sequelize.STRING(30), allowNull: false,
    }, { transaction }),
    queryInterface.changeColumn('m_districts', 'misaCode', {
      type: Sequelize.STRING(30), allowNull: false,
    }, { transaction }),
    queryInterface.changeColumn('m_provinces', 'misaCode', {
      type: Sequelize.STRING(30), allowNull: false,
    }, { transaction }),
  ])),
};
