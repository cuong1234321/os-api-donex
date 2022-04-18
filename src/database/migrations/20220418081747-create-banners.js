'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('banners', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      title: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      linkDirect: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      position: {
        type: Sequelize.ENUM({ values: ['top', 'right', 'newProductSlide', 'newProductBanner', 'flashSale', 'highlight', 'productList', 'productDetail'] }),
        defaultValue: 'top',
      },
      image: {
        type: Sequelize.STRING(255), allowNull: false,
      },
      orderId: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      isHighLight: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      type: {
        type: Sequelize.ENUM({ values: ['homepage', 'product', 'profile', 'news'] }),
        defaultValue: 'homepage',
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
    return queryInterface.dropTable('banners');
  },
};
