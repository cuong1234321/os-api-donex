'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('users', 'username', {
      type: Sequelize.STRING(255),
      allowNull: true,
    }, { transaction }),
    queryInterface.addIndex('users', ['username'], {
      name: 'username',
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('users', 'username');
  },
};
