module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.addColumn('product_variants', 'productId', {
      type: Sequelize.INTEGER, allowNull: true,
    }, { transaction }),
    queryInterface.changeColumn('product_variants', 'skuCode', {
      type: Sequelize.STRING(50), allowNull: true,
    }, { transaction }),
    queryInterface.changeColumn('product_variants', 'barCode', {
      type: Sequelize.STRING(50), allowNull: true,
    }, { transaction }),
  ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize.transaction((transaction) => Promise.all([
    queryInterface.removeColumn('product_variants', 'productId', { transaction }),
    queryInterface.changeColumn('product_variants', 'skuCode', {
      type: Sequelize.STRING(50), allowNull: false,
    }, { transaction }),
    queryInterface.changeColumn('product_variants', 'barCode', {
      type: Sequelize.STRING(50), allowNull: false,
    }, { transaction }),
  ])),
};
