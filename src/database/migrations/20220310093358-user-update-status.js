'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'status', {
      type: Sequelize.ENUM({ values: ['active', 'inactive'] }),
      defaultValue: 'active',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'status', {
      type: Sequelize.ENUM({ values: ['pending', 'active', 'inactive'] }),
      defaultValue: 'pending',
    });
  },
};
