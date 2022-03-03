'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('product_categories', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      parentId: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      name: {
        type: Sequelize.STRING(255), allowNull: false,
      },
      slug: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      thumbnail: {
        type: Sequelize.STRING(255), allowNull: true,
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
    return queryInterface.dropTable('product_categories');
  },
};
