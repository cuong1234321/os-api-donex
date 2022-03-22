'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('collaborators', 'openTime', {
      type: Sequelize.TIME,
      allowNull: true,
    });
    await queryInterface.addColumn('collaborators', 'closeTime', {
      type: Sequelize.TIME,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('collaborators', 'openTime');
    queryInterface.removeColumn('collaborators', 'closeTime');
  },
};
