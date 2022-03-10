'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('product_options', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      productId: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      key: {
        type: Sequelize.Sequelize.ENUM({ values: ['size', 'color', 'form'] }),
        defaultValue: 'size',
      },
      value: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      thumbnail: {
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
    return queryInterface.dropTable('product_options');
  },
};
