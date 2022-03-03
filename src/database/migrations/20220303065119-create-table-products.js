'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('products', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255), allowNull: false,
      },
      slug: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      gender: {
        type: Sequelize.ENUM({ values: ['male', 'female', 'child'] }),
        defaultValue: 'male',
      },
      typeProductId: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      avatar: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      description: {
        type: Sequelize.TEXT, allowNull: true,
      },
      shortDescription: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      sizeGuide: {
        type: Sequelize.TEXT, allowNull: true,
      },
      status: {
        type: Sequelize.ENUM({ values: ['draft', 'active', 'inactive'] }),
        defaultValue: 'draft',
      },
      isHighlight: {
        type: Sequelize.BOOLEAN, defaultValue: false,
      },
      isNew: {
        type: Sequelize.BOOLEAN, defaultValue: false,
      },
      inFlashSale: {
        type: Sequelize.BOOLEAN, defaultValue: false,
      },
      weight: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      length: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      width: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      height: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      unit: {
        type: Sequelize.STRING(50),
      },
      minStock: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      maxStock: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      skuCode: {
        type: Sequelize.STRING(50), allowNull: false,
      },
      barCode: {
        type: Sequelize.STRING(50), allowNull: false,
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
    return queryInterface.dropTable('products');
  },
};
