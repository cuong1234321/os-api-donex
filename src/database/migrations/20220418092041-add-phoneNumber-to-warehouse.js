'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('warehouses', 'phoneNumber', {
      type: Sequelize.STRING(255),
      allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('warehouses', 'warehouseManager', {
      type: Sequelize.STRING(255),
      allowNull: true,
    }, { transaction }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('warehouses', 'phoneNumber', { transaction }),
    queryInterface.removeColumn('warehouses', 'warehouseManager', { transaction }),
  ])),
};
