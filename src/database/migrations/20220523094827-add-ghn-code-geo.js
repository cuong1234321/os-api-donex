'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('m_districts', 'ghnDistrictId', {
      type: Sequelize.STRING(50), allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('m_provinces', 'ghnProvinceId', {
      type: Sequelize.STRING(50), allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('m_wards', 'ghnWardCode', {
      type: Sequelize.STRING(50), allowNull: true,
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('m_districts', 'ghnDistrictId', { transaction }),
    queryInterface.removeColumn('m_provinces', 'ghnProvinceId', { transaction }),
    queryInterface.removeColumn('m_wards', 'ghnWardCode', { transaction }),
  ])),
};
