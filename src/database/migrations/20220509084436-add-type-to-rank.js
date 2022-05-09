'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('ranks', 'type', {
      type: Sequelize.ENUM({ values: ['basic', 'vip'] }),
      defaultValue: 'basic',
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('ranks', 'type'),
  ])),
};
