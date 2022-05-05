'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('permission_groups', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      title: {
        type: Sequelize.STRING(255), allowNull: false,
      },
      key: {
        type: Sequelize.STRING(255), allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE, field: 'created_at',
      },
      updatedAt: {
        type: Sequelize.DATE, field: 'updated_at',
      },
      deletedAt: {
        type: Sequelize.DATE, field: 'updated_at',
      },
    }, {
      charset: 'utf8mb4',
    });
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('permission_groups');
  },
};
