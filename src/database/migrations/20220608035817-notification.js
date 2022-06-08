'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.changeColumn('user_notifications', 'notificationTargetId', {
      type: Sequelize.INTEGER, allowNull: true,
    }, { transaction }),
  ])),

  down: async (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.changeColumn('user_notifications', 'notificationTargetId', {
      type: Sequelize.INTEGER, allowNull: false,
    }, { transaction }),
  ])),
};
