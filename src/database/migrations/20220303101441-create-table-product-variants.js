'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('product_variants', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      slug: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      skuCode: {
        type: Sequelize.STRING(50), allowNull: false,
      },
      barCode: {
        type: Sequelize.STRING(50), allowNull: false,
      },
      buyPrice: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      sellPrice: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      stock: {
        type: Sequelize.INTEGER, allowNull: true,
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
    return queryInterface.dropTable('product_variants');
  },
};
