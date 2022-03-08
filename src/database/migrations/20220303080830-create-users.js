'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      adminId: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      provinceId: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      districtId: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      wardId: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      address: {
        type: Sequelize.STRING(255), allowNull: true,
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
      dateOfBirth: {
        type: Sequelize.DATE, allowNull: true,
      },
      gender: {
        type: Sequelize.ENUM({ values: ['male', 'female', 'other'] }),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM({ values: ['pending', 'active', 'inactive'] }),
        defaultValue: 'pending',
      },
      note: {
        type: Sequelize.TEXT, allowNull: true,
      },
      defaultRank: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      currentRank: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      registerVerificationToken: {
        type: Sequelize.STRING(10),
      },
      forgotPasswordToken: {
        type: Sequelize.STRING(10), allowNull: true,
      },
      forgotPasswordExpireAt: {
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
    return queryInterface.dropTable('users');
  },
};
