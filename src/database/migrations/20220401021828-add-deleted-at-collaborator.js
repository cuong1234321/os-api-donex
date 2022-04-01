'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('collaborators', 'deleteAt', { transaction }),
    queryInterface.addColumn('collaborators', 'deletedAt', {
      type: Sequelize.DATE,
    }, { transaction }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('collaborators', 'deletedAt', { transaction }),
    queryInterface.addColumn('collaborators', 'deleteAt', {
      type: Sequelize.DATE,
    }, { transaction }),
  ])),
};
