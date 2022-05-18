'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('roles', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      title: {
        type: Sequelize.STRING(255), allowNull: false,
      },
      description: {
        type: Sequelize.STRING(255), allowNull: true,
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

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('roles');
  },
};
