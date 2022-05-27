'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('orders', 'transportUnit', {
      type: Sequelize.STRING(30), allowNull: true,
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('orders', 'transportUnit', { transaction }),
  ])),
};
