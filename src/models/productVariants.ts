import ProductVariantEntity from '@entities/productVariants';
import ProductVariantInterface from '@interfaces/productVariants';
import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import CartItemModel from './cartItems';
import ProductCategoryModel from './productCategories';
import ProductOptionModel from './productOptions';
import ProductModel from './products';
import ProductVariantOptionModel from './productVariantOptions';
import SaleCampaignProductModel from './saleCampaignProducts';
import WarehouseModel from './warehouses';
import WarehouseVariantModel from './warehouseVariants';

class ProductVariantModel extends Model<ProductVariantInterface> implements ProductVariantInterface {
  public id: number;
  public productId: number;
  public name: string;
  public slug: string;
  public skuCode: string;
  public barCode: string;
  public buyPrice: string;
  public sellPrice: string;
  public stock: number;
  public optionMappingIds?: number[]

  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;
  public saleCampaignPrice?: number;

  static readonly UPDATABLE_ON_DUPLICATE_PARAMETERS = ['id', 'sku', 'buyPrice', 'sellPrice', 'stock', { optionMappingIds: new Array(0) }];

  static readonly hooks: Partial<ModelHooks<ProductVariantModel>> = {
    async afterDestroy (record) {
      await record.deleteVariantOption();
    },
  }

  static readonly validations: ModelValidateOptions = {
  }

  static readonly scopes: ModelScopeOptions = {
    byCategory (categoryId) {
      return {
        include: [
          {
            model: ProductModel,
            as: 'product',
            required: true,
            include: [{
              model: ProductCategoryModel,
              as: 'categories',
              required: true,
              where: {
                id: categoryId,
                type: ProductCategoryModel.TYPE_ENUM.NONE,
              },
            }],
          },
        ],
      };
    },
    byProduct (productId) {
      return {
        include: [
          {
            model: ProductModel,
            as: 'product',
            required: true,
            where: {
              id: productId,
            },
          },
        ],
      };
    },
    bySortOrder (orderConditions) {
      orderConditions.push([Sequelize.literal('createdAt'), 'DESC']);
      return {
        attributes: {
          include: [
            [
              Sequelize.literal('(SELECT product_categories.name FROM product_categories INNER JOIN product_category_refs ON ' +
              'product_categories.id = product_category_refs.productCategoryId WHERE product_categories.type = "none" AND product_category_refs.productId = ProductVariantModel.productId LIMIT 1)'),
              'category',
            ],
          ],
        },
        order: orderConditions,
      };
    },
    byWarehouse (warehouseId) {
      return {
        include: [
          {
            model: WarehouseVariantModel,
            as: 'warehouseVariants',
            required: true,
            where: {
              warehouseId,
            },
          },
        ],
      };
    },
    withOptions () {
      return {
        attributes: {
          include: [
            [
              Sequelize.literal('(SELECT title FROM m_colors INNER JOIN product_options ON product_options.value = m_colors.id AND product_options.key = "color" AND product_options.deletedAt IS NULL ' +
              'INNER JOIN product_variant_options ON product_variant_options.optionId = product_options.id AND product_variant_options.deletedAt IS NULL ' +
              'WHERE product_variant_options.variantId = ProductVariantModel.id)'),
              'colorTitle',
            ],
            [
              Sequelize.literal('(SELECT code FROM m_sizes INNER JOIN product_options ON product_options.value = m_sizes.id AND product_options.key = "size" AND product_options.deletedAt IS NULL ' +
              'INNER JOIN product_variant_options ON product_variant_options.optionId = product_options.id AND product_variant_options.deletedAt IS NULL ' +
              'WHERE product_variant_options.variantId = ProductVariantModel.id)'),
              'sizeTitle',
            ],
          ],
        },
      };
    },
    withUnit () {
      return {
        attributes: {
          include: [
            [
              Sequelize.literal('(SELECT unit FROM products WHERE id = ProductVariantModel.productId)'),
              'unit',
            ],
          ],
        },
      };
    },
    byId (id) {
      return {
        where: { id },
      };
    },
    byIgnoreIds (id) {
      return {
        where: { id: { [Op.notIn]: id } },
      };
    },
    bySkuCode (skuCode) {
      return {
        where: { skuCode },
      };
    },
  }

  public async deleteVariantOption () {
    await ProductVariantOptionModel.destroy({ where: { variantId: this.id }, individualHooks: true });
  }

  public static initialize (sequelize: Sequelize) {
    this.init(ProductVariantEntity, {
      hooks: ProductVariantModel.hooks,
      scopes: ProductVariantModel.scopes,
      validate: ProductVariantModel.validations,
      tableName: 'product_variants',
      sequelize,
      paranoid: true,
    });
  }

  public static associate () {
    this.belongsToMany(ProductOptionModel, { through: ProductVariantOptionModel, as: 'options', foreignKey: 'variantId' });
    this.hasMany(ProductVariantOptionModel, { as: 'variantOptions', foreignKey: 'variantId' });
    this.hasMany(SaleCampaignProductModel, { as: 'saleCampaigns', foreignKey: 'productVariantId' });
    this.belongsTo(ProductModel, { as: 'product', foreignKey: 'productId' });
    this.hasMany(CartItemModel, { as: 'cartItem', foreignKey: 'productVariantId' });
    this.hasMany(WarehouseVariantModel, { as: 'warehouseVariants', foreignKey: 'variantId' });
    this.belongsToMany(WarehouseModel, { through: WarehouseVariantModel, as: 'warehouses', foreignKey: 'variantId' });
  }
}

export default ProductVariantModel;
