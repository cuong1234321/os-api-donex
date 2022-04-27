'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('m_districts', 'misaCode', {
      type: Sequelize.STRING(30),
      allowNull: false,
    }, { transaction }),
    queryInterface.addColumn('m_provinces', 'misaCode', {
      type: Sequelize.STRING(30),
      allowNull: false,
    }, { transaction }),
    queryInterface.addColumn('m_wards', 'misaCode', {
      type: Sequelize.STRING(30),
      allowNull: false,
    }, { transaction }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('m_districts', 'misaCode', { transaction }),
    queryInterface.removeColumn('m_provinces', 'misaCode', { transaction }),
    queryInterface.removeColumn('m_wards', 'misaCode', { transaction }),
  ])),
};
