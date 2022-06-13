'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('look_books', {
      id: {
        type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true,
      },
      title: {
        type: Sequelize.STRING(255), allowNull: false,
      },
      description: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      thumbnail: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      slug: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      status: {
        type: Sequelize.ENUM({ values: ['active', 'inactive'] }), defaultValue: 'active',
      },
      parentId: {
        type: Sequelize.INTEGER, allowNull: true,
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
    return queryInterface.dropTable('look_books');
  },
};
