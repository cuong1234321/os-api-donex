'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('ranks', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      title: {
        type: Sequelize.STRING(255), allowNull: false, defaultValue: 'VIP',
      },
      orderValueFrom: {
        type: Sequelize.INTEGER, allowNull: true, defaultValue: 0,
      },
      orderValueTo: {
        type: Sequelize.INTEGER, allowNull: true, defaultValue: 0,
      },
      dateEarnDiscount: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      description: {
        type: Sequelize.TEXT, allowNull: true,
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
    return queryInterface.dropTable('ranks');
  },
};
