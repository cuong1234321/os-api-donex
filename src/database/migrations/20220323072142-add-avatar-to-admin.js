
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('admins', 'avatar', {
      type: Sequelize.TEXT,
      allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('admins', 'username', {
      type: Sequelize.STRING(255),
      allowNull: false,
    }, { transaction }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('admins', 'avatar', { transaction }),
    queryInterface.removeColumn('admins', 'username', { transaction }),
  ])),
};
