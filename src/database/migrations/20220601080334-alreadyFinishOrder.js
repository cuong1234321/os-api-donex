'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('users', 'alreadyFinishOrder', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('users', 'alreadyFinishOrder', { transaction }),
  ])),
};
