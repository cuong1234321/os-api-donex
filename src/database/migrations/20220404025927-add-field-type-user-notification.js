'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user_notifications', 'type', {
      type: Sequelize.ENUM({ values: ['order', 'promotion', 'system'] }),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user_notifications', 'type');
  },
};
