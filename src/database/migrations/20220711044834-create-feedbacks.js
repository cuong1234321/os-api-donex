'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('order_feedbacks', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      subOrderId: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      creatableType: {
        type: Sequelize.ENUM({ values: ['user', 'collaborator', 'agency', 'distributor'] }),
        defaultValue: 'user',
        allowNull: true,
      },
      creatableId: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      adminConfirmId: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      status: {
        type: Sequelize.ENUM({ values: ['pending', 'confirm'] }), defaultValue: 'pending',
      },
      content: {
        type: Sequelize.TEXT, allowNull: true,
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
    return queryInterface.dropTable('order_feedbacks');
  },
};
