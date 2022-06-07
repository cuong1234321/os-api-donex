'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('withdrawal_requests', 'requestNote', {
      type: Sequelize.STRING(255), allowNull: false,
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('withdrawal_requests', 'requestNote', { transaction }),
  ])),
};
