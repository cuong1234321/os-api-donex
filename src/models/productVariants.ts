import ProductVariantEntity from '@entities/productVariants';
import ProductVariantInterface from '@interfaces/productVariants';
import dayjs from 'dayjs';
import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import CartItemModel from './cartItems';
import ProductCategoryModel from './productCategories';
import ProductMediaModel from './productMedias';
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
  public mainSku: string;
  public barCode: string;
  public buyPrice: number;
  public sellPrice: number;
  public stock: number;
  public optionMappingIds?: number[]

  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;
  public saleCampaignPrice?: number;
  public colorTitle?: string;
  public supportingColorTitle?: string;
  public sizeTitle?: string;
  public product?: ProductModel;
  public unit?: string;

  static readonly UPDATABLE_ON_DUPLICATE_PARAMETERS = ['id', 'sku', 'buyPrice', 'sellPrice', 'stock', { optionMappingIds: new Array(0) }];

  static readonly hooks: Partial<ModelHooks<ProductVariantModel>> = {
    async afterDestroy (record) {
      await record.deleteVariantOption();
    },
  }

  static readonly validations: ModelValidateOptions = {
    async uniqueSku () {
      if (this.skuCode) {
        const existedRecord = await ProductVariantModel.scope([{ method: ['bySkuCode', this.skuCode] }]).findOne();
        if (existedRecord && existedRecord.id !== this.id) {
          throw new ValidationErrorItem('Mã Sku sản phẩm con đã được sử dụng.', 'uniqueSku', 'skuCode', this.skuCode);
        }
      }
    },
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
    byName (name) {
      return {
        where: {
          name: { [Op.like]: `%${name || ''}%` },
        },
      };
    },
    withWarehouseVariant () {
      return {
        include: [
          {
            model: WarehouseVariantModel,
            as: 'warehouseVariants',
          },
        ],
      };
    },
    withListOptions () {
      return {
        include: [
          {
            model: ProductOptionModel,
            as: 'options',
            attributes: ['id', 'thumbnail'],
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
              Sequelize.literal('(SELECT title FROM m_colors INNER JOIN product_options ON product_options.value = m_colors.id AND product_options.key = "supportingColor" AND product_options.deletedAt IS NULL ' +
              'INNER JOIN product_variant_options ON product_variant_options.optionId = product_options.id AND product_variant_options.deletedAt IS NULL ' +
              'WHERE product_variant_options.variantId = ProductVariantModel.id)'),
              'supportingColorTitle',
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
    byMainSku (mainSku) {
      return {
        where: { mainSku },
      };
    },
    byProductId (productId) {
      return {
        where: { productId },
      };
    },
    withProduct () {
      return {
        include: [{
          model: ProductModel,
          as: 'product',
          attributes: {
            include: [
              [
                Sequelize.literal('(SELECT source FROM product_media WHERE productId = product.id AND isThumbnail is true AND ' +
                `type = "${ProductMediaModel.TYPE_ENUM.IMAGE}")`), 'thumbnail',
              ],
            ],
          },
        }],
      };
    },
    withAboutQuantity () {
      return {
        attributes: {
          include: [
            [
              Sequelize.literal('(SELECT ' +
                '(CASE ' +
                'WHEN SUM(quantity) > 100 THEN "100+" ' +
                'WHEN SUM(quantity) > 50 THEN "50+" ' +
                'WHEN SUM(quantity) > 10 THEN "10+" ' +
                'ELSE "1+" ' +
                'END) FROM warehouse_variants WHERE variantId = ProductVariantModel.id)'),
              'quantity',
            ],
          ],
        },
      };
    },
    withVariantAttributes () {
      return {
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
          include: [
            [
              Sequelize.literal('(SELECT name FROM products WHERE products.id = ProductVariantModel.productId)'),
              'productName',
            ],
            [
              Sequelize.literal('(SELECT weight FROM products WHERE products.id = ProductVariantModel.productId)'),
              'productWeight',
            ],
            [
              Sequelize.literal('(SELECT thumbnail FROM product_options WHERE product_options.thumbnail is not Null and product_options.id IN ' +
               ' (SELECT optionId from product_variant_options WHERE product_variant_options.variantId = ProductVariantModel.id) limit 0,1 )'),
              'thumbnail',
            ],
            [
              Sequelize.literal('(SELECT id FROM product_options WHERE `key` = ' + ` "${ProductOptionModel.KEY_ENUM.COLOR}" AND id IN ` +
               ' (SELECT optionId FROM product_variant_options WHERE product_variant_options.variantId = 99))'),
              'optionColorId',
            ],
            [
              Sequelize.literal('(SELECT id FROM product_options WHERE `key` = ' + ` "${ProductOptionModel.KEY_ENUM.SIZE}" AND id IN ` +
               ' (SELECT optionId FROM product_variant_options WHERE product_variant_options.variantId = 99))'),
              'optionSizeId',
            ],
            [
              Sequelize.literal('(SELECT source FROM product_media WHERE productId = ProductVariantModel.productId LIMIT 1)'),
              'productThumbnail',
            ],
          ],
        },
      };
    },
    byFreeWord (freeWord) {
      return {
        where: { name: { [Op.substring]: freeWord } },
      };
    },
    bySorting (sortBy, sortOrder) {
      return {
        order: [[Sequelize.literal(sortBy), sortOrder]],
      };
    },
    withTotalSale (fromDate, toDate) {
      let conditions = '';
      if (fromDate && toDate) {
        conditions = ` AND createdAt > "${dayjs(fromDate).format()}" AND createdAt < "${dayjs(toDate).format()}"`;
      }
      return {
        attributes: {
          include: [
            [Sequelize.cast(Sequelize.literal(`(SELECT sum(quantity) FROM order_items WHERE productVariantId = ProductVariantModel.id ${conditions})`), 'SIGNED'), 'totalSale'],
          ],
        },
      };
    },
    withQuantity (warehouseId) {
      return {
        attributes: {
          include: [
            [
              Sequelize.cast(Sequelize.literal(`(SELECT quantity FROM warehouse_variants WHERE warehouseId = ${warehouseId} AND variantId = ProductVariantModel.id)`), 'SIGNED'),
              'quantity',
            ],
          ],
        },
      };
    },
    withQuantityByMainSku (warehouseId) {
      return {
        attributes: {
          include: [
            [
              Sequelize.cast(Sequelize.literal(`(SELECT SUM(quantity) FROM warehouse_variants WHERE warehouseId = ${warehouseId} AND variantId IN ` +
              '(SELECT id FROM product_variants WHERE product_variants.mainSku = ProductVariantModel.mainSku))'), 'SIGNED'),
              'totalQuantity',
            ],
          ],
        },
      };
    },
    withProductName () {
      return {
        attributes: {
          include: [
            [
              Sequelize.literal('(SELECT name FROM products WHERE products.id = ProductVariantModel.productId)'),
              'productName',
            ],
          ],
        },
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
