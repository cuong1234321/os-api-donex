'use strict';
const bcrypt = require('bcryptjs');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = bcrypt.genSaltSync();
    const password = bcrypt.hashSync('admin001', salt);
    const admin = [{
      id: undefined,
      fullName: 'Admin001',
      username: 'Admin001',
      phoneNumber: '0963866952',
      email: 'anhlee556@gmail.com',
      password: password,
      address: 'fffff',
      roleId: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }];
    await queryInterface.bulkInsert('admins', admin, {});
  },

  down: async (queryInterface, Sequelize) => {
  },
};
