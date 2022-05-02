'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('ratings', {
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
      orderId: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      content: {
        type: Sequelize.TEXT, allowNull: false,
      },
      status: {
        type: Sequelize.ENUM({ values: ['pending', 'active', 'inactive'] }),
        defaultValue: 'pending',
      },
      adminId: {
        type: Sequelize.INTEGER, allowNull: false,
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
    return queryInterface.dropTable('ratings');
  },
};
