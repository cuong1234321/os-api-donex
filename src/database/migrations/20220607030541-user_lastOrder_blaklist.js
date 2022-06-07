'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('users', 'lastOrderFinishedAt', {
      type: Sequelize.DATE,
    }, { transaction }),
    queryInterface.addColumn('users', 'isBlackList', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('users', 'lastOrderFinishedAt', { transaction }),
    queryInterface.removeColumn('users', 'isBlackList', { transaction }),
  ])),
};
