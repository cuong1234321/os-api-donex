'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('collaborator_media', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      collaboratorId: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      source: {
        type: Sequelize.STRING(255), allowNull: false,
      },
      type: {
        type: Sequelize.ENUM({ values: ['inside', 'outside'] }),
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('collaborator_media');
  },
};
