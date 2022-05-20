'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.changeColumn('users', 'defaultRank', {
      type: Sequelize.ENUM({ values: ['Vip', 'Basic'] }),
      allowNull: true,
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.changeColumn('users', 'defaultRank', {
      type: Sequelize.INTEGER,
      allowNull: true,
    }, { transaction }),
  ])),
};
