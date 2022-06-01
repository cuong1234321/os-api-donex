'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('address_books', 'userType', {
      type: Sequelize.ENUM({ values: ['user', 'collaborator', 'agency', 'distributor'] }), defaultValue: 'user',
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('address_books', 'userType', { transaction }),
  ])),
};
