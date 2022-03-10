'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('product_media', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      type: {
        type: Sequelize.ENUM({ values: ['image', 'video'] }),
        defaultValue: 'image',
      },
      source: {
        type: Sequelize.STRING(255), allowNull: false,
      },
      isAvatar: {
        type: Sequelize.BOOLEAN, defaultValue: false,
      },
      uploadableType: {
        type: Sequelize.ENUM({ values: ['groupProduct', 'product'] }),
        defaultValue: 'groupProduct',
      },
      uploadableId: {
        type: Sequelize.INTEGER, allowNull: false,
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
    return queryInterface.dropTable('product_media');
  },
};
