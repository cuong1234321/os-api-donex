'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.changeColumn('orders', 'ownerId', {
      type: Sequelize.INTEGER, allowNull: true,
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.changeColumn('orders', 'ownerId', {
      type: Sequelize.INTEGER, allowNull: false,
    }),
  ])),
};
