
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('warehouses', 'status', {
      type: Sequelize.ENUM({ values: ['active', 'inactive'] }),
      defaultValue: 'inactive',
    }, { transaction }),
    queryInterface.addColumn('warehouses', 'code', {
      type: Sequelize.STRING(255),
      allowNull: true,
    }, { transaction }),
    queryInterface.changeColumn('warehouses', 'type', {
      type: Sequelize.ENUM({ values: ['storage', 'sell'] }),
      defaultValue: 'storage',
    }, { transaction }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('warehouses', 'status', { transaction }),
    queryInterface.removeColumn('warehouses', 'code', { transaction }),
    queryInterface.changeColumn('warehouses', 'type', {
      type: Sequelize.STRING(255),
      allowNull: true,
    }, { transaction }),
  ])),
};
