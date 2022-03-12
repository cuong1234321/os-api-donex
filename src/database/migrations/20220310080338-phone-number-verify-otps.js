'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('phone_number_verify_otps', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      otp: {
        type: Sequelize.STRING(10), allowNull: false,
      },
      phoneNumber: {
        type: Sequelize.STRING(20), allowNull: false,
      },
      otpExpiresAt: {
        type: Sequelize.DATE, allowNull: false,
      },
      verifyToken: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('phone_number_verify_otps');
  },
};
