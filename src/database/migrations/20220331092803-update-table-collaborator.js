'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.dropTable('collaborators', { transaction }),
    queryInterface.createTable('collaborators', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      parentId: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      type: {
        type: Sequelize.ENUM({ values: ['collaborator', 'agency', 'distributor'] }),
        defaultValue: 'collaborator',
      },
      status: {
        type: Sequelize.ENUM({ values: ['pending', 'active', 'inactive', 'rejected'] }),
        defaultValue: 'pending',
      },
      paperProofFront: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      paperProofBack: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      rejectionReason: {
        type: Sequelize.TEXT, allowNull: true,
      },
      openTime: {
        type: Sequelize.TIME,
      },
      closeTime: {
        type: Sequelize.TIME,
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
      lat: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      long: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      addressTitle: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      fullName: {
        type: Sequelize.STRING(255), allowNull: false,
      },
      phoneNumber: {
        type: Sequelize.STRING(15), allowNull: false,
      },
      username: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      password: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      email: {
        type: Sequelize.STRING(255), allowNull: false,
      },
      dateOfBirth: {
        type: Sequelize.DATE, allowNull: true,
      },
      defaultRank: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      forgotPasswordToken: {
        type: Sequelize.STRING(100), allowNull: true,
      },
      forgotPasswordExpireAt: {
        type: Sequelize.DATE, allowNull: true,
      },
      avatar: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      deleteAt: {
        type: Sequelize.DATE,
      },
    }, {
      uniqueKeys: {
        phone_number: { fields: ['phoneNumber'] },
        email: { fields: ['email'] },
      },
      charset: 'utf8mb4',
      transaction,
    }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.dropTable('collaborators', { transaction }),
    queryInterface.createTable('collaborators', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER, allowNull: false,
      },
      parentId: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      type: {
        type: Sequelize.ENUM({ values: ['collaborator', 'agency', 'distributor'] }),
        defaultValue: 'collaborator',
      },
      status: {
        type: Sequelize.ENUM({ values: ['pending', 'active', 'inactive', 'rejected'] }),
        defaultValue: 'pending',
      },
      paperProofFront: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      paperProofBack: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    }, {
      uniqueKeys: {
        user_id: { fields: ['userId'] },
      },
      charset: 'utf8mb4',
      transaction,
    }),
  ])),
};
