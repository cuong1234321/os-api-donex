'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('news', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      title: {
        type: Sequelize.STRING(255), allowNull: false,
      },
      content: {
        type: Sequelize.TEXT, allowNull: false,
      },
      thumbnail: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      newsCategoryId: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      publicAt: {
        type: Sequelize.DATE,
      },
      status: {
        type: Sequelize.ENUM({ values: ['draft', 'active', 'inactive'] }),
        defaultValue: 'draft',
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    },
    {
      charset: 'utf8mb4',
    });
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('news');
  },
};
