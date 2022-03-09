'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('address_books', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      provinceId: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      districtId: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      wardId: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      address: {
        type: Sequelize.STRING(255), allowNull: false,
      },
      fullName: {
        type: Sequelize.STRING(255), allowNull: false,
      },
      phoneNumber: {
        type: Sequelize.STRING(255), allowNull: false,
      },
      isDefault: {
        type: Sequelize.BOOLEAN, defaultValue: false,
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
    return queryInterface.dropTable('address_books');
  },
};
