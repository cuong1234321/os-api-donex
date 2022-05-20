'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('sub_orders', 'isAlreadyRating', {
      type: Sequelize.BOOLEAN, defaultValue: false,
    }, { transaction }),
    queryInterface.addColumn('ratings', 'isAnonymous', {
      type: Sequelize.BOOLEAN, defaultValue: false,
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('sub_orders', 'isAlreadyRating', { transaction }),
    queryInterface.removeColumn('ratings', 'isAnonymous', { transaction }),
  ])),
};
