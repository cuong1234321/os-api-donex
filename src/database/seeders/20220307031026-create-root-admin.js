'use strict';
const bcrypt = require('bcryptjs');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = bcrypt.genSaltSync();
    const password = bcrypt.hashSync('admin001', salt);
    const admin = [{
      id: 1,
      fullName: 'Admin001',
      username: 'Admin001',
      phoneNumber: '0123456789',
      email: 'anhlee556@gmail.com',
      password: password,
      address: 'fffff',
      createdAt: new Date(),
      updatedAt: new Date(),
    }];
    await queryInterface.bulkInsert('admins', admin, {});
  },

  down: async (queryInterface, Sequelize) => {
  },
};
