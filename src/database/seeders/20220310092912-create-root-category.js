'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = [
      {
        id: undefined,
        name: 'Giới tính',
        type: 'gender',
        slug: 'gioi-tinh',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: undefined,
        name: 'Bộ sưu tập',
        type: 'collection',
        slug: 'bo-suu-tap',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: undefined,
        name: 'Loại sản phẩm',
        type: 'productType',
        slug: 'loai-san-pham',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await queryInterface.bulkInsert('product_categories', categories, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('product_categories', null, {});
  },
};
