'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('rank_conditions', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      rankId: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      orderAmountFrom: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      orderAmountTo: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      discountValue: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      discountType: {
        type: Sequelize.ENUM({ values: ['cash', 'percent'] }),
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
    return queryInterface.dropTable('rank_conditions');
  },
};
