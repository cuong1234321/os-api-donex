'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('users', 'deletedAt', {
      type: Sequelize.DATE,
    }, { transaction }),
    queryInterface.addColumn('collaborators', 'deletedAt', {
      type: Sequelize.DATE,
    }, { transaction }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('users', 'deletedAt', { transaction }),
    queryInterface.removeColumn('collaborators', 'deletedAt', { transaction }),
  ])),
};
