'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('collaborators', 'rejectorId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('collaborators', 'rejectDate', {
      type: Sequelize.DATE,
      allowNull: true,
    }, { transaction }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('collaborators', 'rejectorId', { transaction }),
    queryInterface.removeColumn('collaborators', 'rejectDate', { transaction }),
  ])),
};
