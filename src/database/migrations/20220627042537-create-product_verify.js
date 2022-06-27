'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('product_verify_codes', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      skuCode: {
        type: Sequelize.STRING(255), allowNull: false,
      },
      verifyCode: {
        type: Sequelize.STRING(255), allowNull: false, unique: true,
      },
      appliedAt: {
        type: Sequelize.DATE, allowNull: true,
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
    return queryInterface.dropTable('product_verify_codes');
  },
};
