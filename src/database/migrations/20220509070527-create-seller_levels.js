'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('seller_levels', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      type: {
        type: Sequelize.ENUM({ values: ['collaborator', 'agency', 'distributor'] }),
        defaultValue: 'collaborator',
      },
      title: {
        type: Sequelize.STRING(255), allowNull: false,
      },
      conditionValue: {
        type: Sequelize.BIGINT, allowNull: false,
      },
      discountValue: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      description: {
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
    return queryInterface.dropTable('seller_levels');
  },
};
