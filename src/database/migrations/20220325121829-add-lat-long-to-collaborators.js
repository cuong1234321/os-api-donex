
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('collaborators', 'lat', {
      type: Sequelize.STRING(255),
      allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('collaborators', 'long', {
      type: Sequelize.STRING(255),
      allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('collaborators', 'title', {
      type: Sequelize.STRING(255),
      allowNull: true,
    }, { transaction }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('collaborators', 'lat', { transaction }),
    queryInterface.removeColumn('collaborators', 'long', { transaction }),
    queryInterface.removeColumn('collaborators', 'title', { transaction }),
  ])),
};
