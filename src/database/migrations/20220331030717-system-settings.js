'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('system_settings', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      applicationLink: {
        type: Sequelize.STRING(255), allowNull: true, defaultValue: 0,
      },
      coinConversionLevel: {
        type: Sequelize.INTEGER, allowNull: true, defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    }, {
      charset: 'utf8mb4',
    });
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('system_settings');
  },
};
