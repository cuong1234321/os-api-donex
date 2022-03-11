module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.createTable('product_category_refs', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      productId: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      productCategoryId: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    }, {
      charset: 'utf8mb4',
      transaction,
    }),
    queryInterface.changeColumn('products', 'gender', {
      type: Sequelize.INTEGER, allowNull: true,
    }, { transaction }),
    queryInterface.changeColumn('products', 'skuCode', {
      type: Sequelize.STRING(50), allowNull: true,
    }, { transaction }),
    queryInterface.changeColumn('products', 'barCode', {
      type: Sequelize.STRING(50), allowNull: true,
    }, { transaction }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.dropTable('product_category_refs', { transaction }),
    queryInterface.changeColumn('products', 'gender', {
      type: Sequelize.ENUM(['male', 'female', 'child']), defaultValue: 'male',
    }, { transaction }),
    queryInterface.changeColumn('products', 'skuCode', {
      type: Sequelize.STRING(50), allowNull: false,
    }, { transaction }),
    queryInterface.changeColumn('products', 'barCode', {
      type: Sequelize.STRING(50), allowNull: false,
    }, { transaction }),
  ])),
};
