import ProductEntity from '@entities/products';
import ProductInterface from '@interfaces/products';
import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize, Transaction } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import MColorModel from './mColors';
import MSizeModel from './mSizes';
import ProductCategoryModel from './productCategories';
import ProductCategoryRefModel from './productCategoryRefs';
import ProductMediaModel from './productMedias';
import ProductOptionModel from './productOptions';
import ProductVariantOptionModel from './productVariantOptions';
import ProductVariantModel from './productVariants';

class ProductModel extends Model<ProductInterface> implements ProductInterface {
  public id: number;
  public name: string;
  public slug: string;
  public avatar: string;
  public description: string;
  public shortDescription: string;
  public status: string;
  public gender: number;
  public typeProductId: number;
  public sizeGuide: string;
  public isHighlight: boolean;
  public isNew: boolean;
  public inFlashSale: boolean;
  public weight: number;
  public length: number;
  public width: number;
  public height: number;
  public unit: string;
  public minStock: number;
  public maxStock: number;
  public skuCode: string;
  public barCode: string;

  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;
  public variants?: ProductVariantModel[];
  public options?: ProductOptionModel[];

  static readonly STATUS_ENUM = { DRAFT: 'draft', ACTIVE: 'active', INACTIVE: 'inActive' };

  static readonly CREATABLE_PARAMETERS = [
    'name', 'description', 'shortDescription', 'status', 'gender', 'typeProductId', 'sizeGuide', 'isHighlight',
    'isNew', 'weight', 'length', 'width', 'height', 'unit', 'minStock', 'maxStock',
    { categoryRefs: ['productCategoryId'] },
    { options: ['key', 'value', 'optionMappingId'] },
    { variants: ['name', 'buyPrice', 'sellPrice', 'stock', 'skuCode', { optionMappingIds: new Array(0) }] },
    { medias: ['isThumbnail'] },
  ];

  static readonly hooks: Partial<ModelHooks<ProductModel>> = {
    async beforeCreate (record) {
      record.skuCode = await record.generateSkuCode();
      record.barCode = await record.generateBarCode();
    },
    async afterDestroy (record) {
      await record.deleteProductDetail();
    },
  }

  static readonly validations: ModelValidateOptions = {
  }

  static readonly scopes: ModelScopeOptions = {
    byId (id) {
      return {
        where: { id },
      };
    },
    bySkuCode (skuCode) {
      return {
        where: { skuCode },
      };
    },
    byBarCode (barCode) {
      return {
        where: { barCode },
      };
    },
    isActive () {
      return {
        where: {
          status: ProductModel.STATUS_ENUM.ACTIVE,
        },
      };
    },
    isNotActive () {
      return {
        where: {
          status: { [Op.notIn]: [ProductModel.STATUS_ENUM.ACTIVE] },
        },
      };
    },
    byCategory (categoryIds) {
      return {
        include: [
          {
            model: ProductCategoryModel,
            as: 'categories',
            required: true,
            where: {
              id: categoryIds,
              type: ProductCategoryModel.TYPE_ENUM.NONE,
            },
          },
        ],
      };
    },
    byCollectionId (collectionIds) {
      return {
        include: [
          {
            model: ProductCategoryModel,
            as: 'collections',
            required: true,
            where: {
              id: collectionIds,
            },
          },
        ],
      };
    },
    byGenderId (genderIds) {
      return {
        include: [
          {
            model: ProductCategoryModel,
            as: 'genders',
            required: true,
            where: {
              id: genderIds,
            },
          },
        ],
      };
    },
    byProductTypeId (productTypeIds) {
      return {
        include: [
          {
            model: ProductCategoryModel,
            as: 'productType',
            required: true,
            where: {
              id: productTypeIds,
            },
          },
        ],
      };
    },
    byFreeWord (freeWord) {
      return {
        where: {
          name: { [Op.like]: `%${freeWord || ''}%` },
        },
      };
    },
    byPriceRange (fromPrice, toPrice) {
      const priceConditions = [];
      if (fromPrice) {
        priceConditions.push({
          [Op.and]: [
            Sequelize.where(Sequelize.literal('(SELECT MIN(sellPrice) from product_variants where product_variants.productId = ProductModel.id)'), {
              [Op.gte]: fromPrice,
            }),
          ],
        });
      }
      if (toPrice) {
        priceConditions.push({
          [Op.and]: [
            Sequelize.where(Sequelize.literal('(SELECT MIN(sellPrice) from product_variants where product_variants.productId = ProductModel.id)'), {
              [Op.lte]: toPrice,
            }),
          ],
        });
      }
      return {
        where: {
          [Op.and]: priceConditions,
        },
      };
    },
    byColor (colorIds) {
      return {
        include: [
          {
            model: ProductOptionModel,
            as: 'colors',
            attributes: [],
            required: true,
            where: {
              value: colorIds,
            },
          },
        ],
      };
    },
    bySize (sizeIds) {
      return {
        include: [
          {
            model: ProductOptionModel,
            as: 'sizes',
            attributes: [],
            required: true,
            where: {
              value: sizeIds,
            },
          },
        ],
      };
    },
    withThumbnail () {
      return {
        include: [{
          model: ProductMediaModel,
          as: 'medias',
          required: false,
          where: {
            isThumbnail: true,
          },
        }],
      };
    },
    bySorting (orderConditions) {
      return {
        attributes: {
          include: [
            [
              Sequelize.literal('(SELECT MIN(sellPrice) from product_variants where product_variants.productId = ProductModel.id)'),
              'price',
            ],
          ],
        },
        order: orderConditions,
      };
    },
    bySkuCodeName (name) {
      return {
        where: { skuCode: { [Op.like]: `%${name || ''}%` } },
      };
    },
    byStatus (status) {
      return {
        where: { status },
      };
    },
    byName (name) {
      return {
        where: { name: { [Op.like]: `%${name || ''}%` } },
      };
    },
    byCategoryName (name) {
      return {
        include: [
          {
            model: ProductCategoryRefModel,
            as: 'categoryRefs',
            required: true,
            attributes: [],
            where: {
              productCategoryId: { [Op.in]: Sequelize.literal(`(SELECT id FROM product_categories WHERE type = "none" AND name LIKE '%${name}%')`) },
            },
          },
        ],
      };
    },
    byUnit (unit) {
      return {
        where: { unit },
      };
    },
    byPrice (price) {
      return {
        where: {
          [Op.and]: [
            Sequelize.where(Sequelize.cast(Sequelize.literal('(SELECT MIN(sellPrice) from product_variants where product_variants.productId = ProductModel.id)'), 'SIGNED'), {
              [Op.between]: [price, price],
            }),
          ],
        },
      };
    },
    withCollections () {
      return {
        include: [
          {
            model: ProductCategoryModel,
            as: 'collections',
          },
        ],
      };
    },
    withCategories () {
      return {
        include: [
          {
            model: ProductCategoryModel,
            as: 'categories',
            where: {
              type: ProductCategoryModel.TYPE_ENUM.NONE,
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
              Sequelize.literal('(SELECT MIN(sellPrice) from product_variants where product_variants.productId = ProductModel.id)'),
              'price',
            ],
            [
              Sequelize.literal('(SELECT product_categories.name FROM product_categories INNER JOIN product_category_refs ON ' +
              'product_categories.id = product_category_refs.productCategoryId WHERE product_categories.type = "none" AND product_category_refs.productId = ProductModel.id LIMIT 1)'),
              'category',
            ],
          ],
        },
        order: orderConditions,
      };
    },
  }

  public async deleteProductDetail () {
    await ProductOptionModel.destroy({ where: { productId: this.id }, individualHooks: true });
    await ProductVariantModel.destroy({ where: { productId: this.id }, individualHooks: true });
    await ProductMediaModel.destroy({ where: { productId: this.id }, individualHooks: true });
  }

  public async generateSkuCode () {
    let code = '';
    const characters = '0123456789';
    for (let i = 6; i > 0; --i) code += characters[Math.floor(Math.random() * characters.length)];
    const existCode = await ProductModel.scope([{ method: ['bySkuCode', code] }]).findOne();
    if (existCode) code = await this.generateSkuCode();
    return code;
  }

  public async generateBarCode () {
    let code = '';
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 9; i > 0; --i) code += characters[Math.floor(Math.random() * characters.length)];
    const existCode = await ProductModel.scope([{ method: ['byBarCode', code] }]).findOne();
    if (existCode) code = await this.generateSkuCode();
    return code;
  }

  public async updateVariationOptions (transaction?: Transaction) {
    if (!this.options || !this.variants) return;
    const variantOptionAttributes: any = [];
    const options = this.options;
    const sizes = await MSizeModel.findAll();
    const colors = await MColorModel.findAll();
    for (const variant of this.variants) {
      const optionRef: any = [];
      variant.optionMappingIds.forEach((optionMappingId: any) => {
        const option = options.find((option: any) => option.optionMappingId === optionMappingId);
        optionRef.push(option);
        variantOptionAttributes.push({
          variantId: variant.id,
          optionId: option.id,
        });
      });
      const optionColor = optionRef.find((option: any) => option.key === ProductOptionModel.TYPE_ENUM.color);
      const optionSize = optionRef.find((option: any) => option.key === ProductOptionModel.TYPE_ENUM.size);
      const color = colors.find((record: any) => record.id === optionColor.value);
      const size = sizes.find((record: any) => record.id === optionSize.value);
      const skuCode = `${this.skuCode}-${color.code}-${size.code}`;
      await variant.update({ skuCode: skuCode }, { transaction });
    }
    await ProductVariantOptionModel.bulkCreate(variantOptionAttributes, { transaction });
  }

  public static initialize (sequelize: Sequelize) {
    this.init(ProductEntity, {
      hooks: ProductModel.hooks,
      scopes: ProductModel.scopes,
      validate: ProductModel.validations,
      tableName: 'products',
      sequelize,
      paranoid: true,
    });
  }

  public static associate () {
    this.hasMany(ProductCategoryRefModel, { as: 'categoryRefs', foreignKey: 'productId', onDelete: 'CASCADE', hooks: true });
    this.belongsToMany(ProductCategoryModel, { through: ProductCategoryRefModel, as: 'categories', foreignKey: 'productId', onDelete: 'CASCADE', hooks: true });
    this.hasMany(ProductOptionModel, { as: 'options', foreignKey: 'productId', onDelete: 'CASCADE', hooks: true });
    this.hasMany(ProductOptionModel, { as: 'colors', foreignKey: 'productId', scope: { key: ProductOptionModel.TYPE_ENUM.color } });
    this.hasMany(ProductOptionModel, { as: 'sizes', foreignKey: 'productId', scope: { key: ProductOptionModel.TYPE_ENUM.size } });
    this.hasMany(ProductVariantModel, { as: 'variants', foreignKey: 'productId', onDelete: 'CASCADE', hooks: true });
    this.hasMany(ProductMediaModel, { as: 'medias', foreignKey: 'productId', onDelete: 'CASCADE', hooks: true });
    this.belongsToMany(ProductCategoryModel, { through: ProductCategoryRefModel, as: 'collections', foreignKey: 'productId', onDelete: 'CASCADE', hooks: true, scope: { type: ProductCategoryModel.TYPE_ENUM.COLLECTION } });
    this.belongsTo(ProductCategoryModel, { as: 'genders', foreignKey: 'gender' });
    this.belongsTo(ProductCategoryModel, { as: 'productType', foreignKey: 'typeProductId' });
  }
}

export default ProductModel;
