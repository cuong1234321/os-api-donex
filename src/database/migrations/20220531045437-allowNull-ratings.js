'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.changeColumn('ratings', 'content', {
      type: Sequelize.TEXT,
      allowNull: true,
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.changeColumn('ratings', 'content', {
      type: Sequelize.TEXT,
      allowNull: false,
    }, { transaction }),
  ])),
};
