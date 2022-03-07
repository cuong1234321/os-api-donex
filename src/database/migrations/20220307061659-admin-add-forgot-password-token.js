'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('admins', 'forgotPasswordToken', {
      type: Sequelize.STRING(10),
      allowNull: true,
    }, { transaction }),
    queryInterface.addColumn('admins', 'forgotPasswordExpireAt', {
      type: Sequelize.DATE,
      allowNull: true,
    }, { transaction }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('admins', 'forgotPasswordToken', { transaction }),
    queryInterface.removeColumn('admins', 'forgotPasswordExpireAt', { transaction }),
  ])),
};
