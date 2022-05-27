'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('user_notifications', 'userType', {
      type: Sequelize.ENUM({ values: ['admin', 'user', 'collaborator', 'agency', 'distributor'] }), allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('user_notifications', 'thumbnail', {
      type: Sequelize.STRING(255), allowNull: true,
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('user_notifications', 'userType', { transaction }),
    queryInterface.removeColumn('user_notifications', 'thumbnail', { transaction }),
  ])),
};
