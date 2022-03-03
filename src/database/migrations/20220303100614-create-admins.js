'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('admins', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      fullName: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      phoneNumber: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      password: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      email: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      address: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      dateOfBirth: {
        type: Sequelize.DATE, allowNull: true,
      },
      gender: {
        type: Sequelize.ENUM({ values: ['male', 'female', 'other'] }),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM({ values: ['active', 'inactive'] }),
        defaultValue: 'active',
      },
      note: {
        type: Sequelize.TEXT, allowNull: true,
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
    return queryInterface.dropTable('admins');
  },
};
