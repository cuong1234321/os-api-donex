'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeIndex('collaborators', 'phone_number', { transaction }),
    queryInterface.removeIndex('collaborators', 'email', { transaction }),
  ])),

  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addIndex('collaborators', {
      fields: ['phoneNumber'],
      type: 'unique',
      name: 'phone_number',
      transaction,
    }),
    queryInterface.addIndex('collaborators', {
      fields: ['email'],
      type: 'unique',
      name: 'email',
      transaction,
    }),
  ])),
};
