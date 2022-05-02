'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('history_earned_points', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      userType: {
        type: Sequelize.ENUM({ values: ['collaborator', 'agency', 'distributor', 'user'] }),
        defaultValue: 'user',
      },
      applicationAbleId: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      applicationAbleType: {
        type: Sequelize.STRING(255), allowNull: false,
      },
      point: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      isAlreadyAlert: {
        type: Sequelize.BOOLEAN, defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    }, {
      charset: 'utf8mb4',
    });
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('history_earned_points');
  },
};
