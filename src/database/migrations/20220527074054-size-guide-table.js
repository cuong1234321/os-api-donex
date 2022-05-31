'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('size_guides', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      sizeType: {
        type: Sequelize.ENUM({ values: ['kidSize', 'adultSize', 'shoesSize'] }),
        defaultValue: 'adultSize',
      },
      mediaType: {
        type: Sequelize.ENUM({ values: ['image', 'video'] }),
        defaultValue: 'image',
      },
      source: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE, field: 'created_at',
      },
      updatedAt: {
        type: Sequelize.DATE, field: 'updated_at',
      },
    }, {
      charset: 'utf8mb4',
    });
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('size_guides');
  },
};
