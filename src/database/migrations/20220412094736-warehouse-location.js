
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('warehouses', 'provinceId', {
      type: Sequelize.INTEGER, allowNull: false,
    }, { transaction }),
    queryInterface.addColumn('warehouses', 'districtId', {
      type: Sequelize.INTEGER, allowNull: false,
    }, { transaction }),
    queryInterface.addColumn('warehouses', 'wardId', {
      type: Sequelize.INTEGER, allowNull: false,
    }, { transaction }),
    queryInterface.addColumn('warehouses', 'address', {
      type: Sequelize.STRING(255), allowNull: false,
    }, { transaction }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('warehouses', 'provinceId', { transaction }),
    queryInterface.removeColumn('warehouses', 'districtId', { transaction }),
    queryInterface.removeColumn('warehouses', 'wardId', { transaction }),
    queryInterface.removeColumn('warehouses', 'address', { transaction }),
  ])),
};
