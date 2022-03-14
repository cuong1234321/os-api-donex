'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'forgotPasswordToken', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'forgotPasswordToken', {
      type: Sequelize.STRING(10),
      allowNull: true,
    });
  },
};
