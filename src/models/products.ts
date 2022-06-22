import ProductEntity from '@entities/products';
import ProductMediaInterface from '@interfaces/productMedia';
import ProductOptionInterface from '@interfaces/productOptions';
import ProductInterface from '@interfaces/products';
import { BelongsToManySetAssociationsMixin, BelongsToManyGetAssociationsMixin, HasManyGetAssociationsMixin, Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize, Transaction, ValidationErrorItem } from 'sequelize';
import ProductVariantInterface from '@interfaces/productVariants';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import MColorModel from './mColors';
import MSizeModel from './mSizes';
import ProductCategoryModel from './productCategories';
import ProductCategoryRefModel from './productCategoryRefs';
import ProductMediaModel from './productMedias';
import ProductOptionModel from './productOptions';
import ProductVariantOptionModel from './productVariantOptions';
import ProductVariantModel from './productVariants';
import FavoriteProductModel from './favoriteProducts';
import WarehouseModel from './warehouses';
import WarehouseVariantModel from './warehouseVariants';
import SubOrderModel from './subOrders';

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
  public sizeType: string;

  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;
  public variants?: ProductVariantModel[];
  public options?: ProductOptionModel[];
  public minPrice?: number;
  public maxPrice?: number;
  public thumbnail?: string;

  static readonly STATUS_ENUM = { DRAFT: 'draft', ACTIVE: 'active', INACTIVE: 'inActive' };
  static readonly SIZE_TYPE_ENUM = { CHILDREN: 'children', CLOTHES: 'clothes', SHOES: 'shoes' }

  static readonly CREATABLE_PARAMETERS = [
    'name', 'description', 'shortDescription', 'status', 'gender', 'typeProductId', 'sizeGuide', 'isHighlight',
    'isNew', 'weight', 'length', 'width', 'height', 'unit', 'minStock', 'maxStock', 'sizeType',
    { categoryRefs: ['productCategoryId'] },
    { options: ['key', 'value', 'thumbnail', 'optionMappingId'] },
    { variants: ['name', 'buyPrice', 'sellPrice', 'stock', 'skuCode', { optionMappingIds: new Array(0) }] },
    { medias: ['isThumbnail', 'source', 'type'] },
  ];

  static readonly UPDATABLE_PARAMETERS = [
    'name', 'description', 'shortDescription', 'status', 'gender', 'typeProductId', 'sizeGuide', 'isHighlight',
    'isNew', 'weight', 'length', 'width', 'height', 'unit', 'minStock', 'maxStock', 'isHighlight', 'isNew', 'inFlashSale', 'sizeType',
    { categoryRefs: ['productCategoryId'] },
    { options: ['id', 'key', 'value', 'optionMappingId'] },
    { variants: ['id', 'name', 'buyPrice', 'sellPrice', 'stock', 'skuCode', { optionMappingIds: new Array(0) }] },
    { medias: ['id', 'isThumbnail'] },
  ];

  static readonly hooks: Partial<ModelHooks<ProductModel>> = {
    async beforeCreate (record) {
      if (!record.skuCode) {
        record.skuCode = await record.generateSkuCode();
      }
      record.barCode = await record.generateBarCode();
    },
    async afterDestroy (record) {
      await record.deleteProductDetail();
      await record.deleteFavorite();
    },
  }

  static readonly validations: ModelValidateOptions = {
    async uniqueSku () {
      if (this.skuCode) {
        const existedRecord = await ProductModel.scope([{ method: ['bySkuCode', this.skuCode] }]).findOne();
        if (existedRecord && existedRecord.id !== this.id) {
          throw new ValidationErrorItem('Mã Sku chung đã được sử dụng.', 'uniqueSku', 'skuCode', this.skuCode);
        }
      }
    },
    async validateGender () {
      if (this.gender) {
        const gender = await ProductCategoryModel.scope([{ method: ['byType', ProductCategoryModel.TYPE_ENUM.GENDER] }]).findByPk(this.gender);
        if (!gender) {
          throw new ValidationErrorItem('Mã giới tính không hợp lệ.', 'validateGender', 'gender', this.gender);
        }
      }
    },
    async validateTypeProductId () {
      if (this.typeProductId) {
        const productType = await ProductCategoryModel.scope([{ method: ['byType', ProductCategoryModel.TYPE_ENUM.PRODUCT_TYPE] }]).findByPk(this.typeProductId);
        if (!productType) {
          throw new ValidationErrorItem('Loại sản phẩm không hợp lệ.', 'validateTypeProductId', 'typeProductId', this.typeProductId);
        }
      }
    },
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
    isFlashSale () {
      return {
        where: {
          inFlashSale: true,
        },
      };
    },
    isHighlight () {
      return {
        where: {
          isHighlight: true,
        },
      };
    },
    newest () {
      return {
        order: [['createdAt', 'DESC']],
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
    withCollections () {
      return {
        include: [
          {
            model: ProductCategoryModel,
            required: false,
            as: 'collections',
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
    withGender () {
      return {
        include: [
          {
            model: ProductCategoryModel,
            required: false,
            as: 'genders',
          },
        ],
      };
    },
    withProductType () {
      return {
        include: [
          {
            model: ProductCategoryModel,
            required: false,
            as: 'productType',
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
            required: false,
            where: {
              type: ProductCategoryModel.TYPE_ENUM.NONE,
            },
          },
        ],
      };
    },
    withPrice () {
      return {
        attributes: {
          include: [
            [
              Sequelize.literal('(SELECT MIN(sellPrice) from product_variants where product_variants.productId = ProductModel.id)'),
              'price',
            ],
          ],
        },
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
    byWarehouseId (warehouseId) {
      return {
        include: [{
          model: ProductVariantModel,
          as: 'variants',
          required: true,
          include: [
            {
              model: WarehouseVariantModel,
              as: 'warehouseVariants',
              where: { warehouseId },
            },
          ],
        }],
      };
    },
    verifyProduct (code) {
      return {
        where: {
          [Op.or]: [
            { barCode: code },
            { skuCode: code },
            { id: { [Op.in]: Sequelize.literal(`(SELECT productId FROM product_variants WHERE skuCode = '${code}')`) } },
          ],
        },
      };
    },
    withPriceRange () {
      return {
        attributes: {
          include: [
            [
              Sequelize.literal('(SELECT MIN(sellPrice) from product_variants where product_variants.deletedAt is NULL and ' +
              ' product_variants.productId = ProductModel.id)'),
              'minPrice',
            ],
            [
              Sequelize.literal('(SELECT MAX(sellPrice) from product_variants where product_variants.deletedAt is NULL and ' +
              ' product_variants.productId = ProductModel.id)'),
              'maxPrice',
            ],
          ],
        },
      };
    },
    isFavorite (userId) {
      if (userId) {
        return {
          attributes: {
            include: [
              [
                Sequelize.literal(`(SELECT (CASE WHEN id THEN true ELSE false END) FROM favorite_products WHERE favorite_products.productId = ProductModel.id AND favorite_products.userId = '${userId}' limit 0,1 )`),
                'isFavorite',
              ],
            ],
          },
        };
      }
    },
    withVariants () {
      return {
        include: [{
          model: ProductVariantModel,
          as: 'variants',
        }],
      };
    },
    withVariantDetails () {
      return {
        include: [{
          model: ProductVariantModel,
          as: 'variants',
          attributes: {
            include: [
              [
                Sequelize.literal('(SELECT title FROM m_colors INNER JOIN product_options ON product_options.value = m_colors.id AND product_options.key = "color" AND product_options.deletedAt IS NULL ' +
                'INNER JOIN product_variant_options ON product_variant_options.optionId = product_options.id AND product_variant_options.deletedAt IS NULL ' +
                'WHERE product_variant_options.variantId = variants.id)'),
                'colorTitle',
              ],
              [
                Sequelize.literal('(SELECT title FROM m_colors INNER JOIN product_options ON product_options.value = m_colors.id AND product_options.key = "supportingColor" AND product_options.deletedAt IS NULL ' +
                'INNER JOIN product_variant_options ON product_variant_options.optionId = product_options.id AND product_variant_options.deletedAt IS NULL ' +
                'WHERE product_variant_options.variantId = variants.id)'),
                'supportingColorTitle',
              ],
              [
                Sequelize.literal('(SELECT code FROM m_sizes INNER JOIN product_options ON product_options.value = m_sizes.id AND product_options.key = "size" AND product_options.deletedAt IS NULL ' +
                'INNER JOIN product_variant_options ON product_variant_options.optionId = product_options.id AND product_variant_options.deletedAt IS NULL ' +
                'WHERE product_variant_options.variantId = variants.id)'),
                'sizeTitle',
              ],
            ],
          },
          include: [
            {
              model: WarehouseVariantModel,
              as: 'warehouseVariants',
            },
          ],
        }],
      };
    },
    withAverageRating () {
      return {
        attributes: {
          include: [
            [Sequelize.cast(Sequelize.literal('(select ROUND(AVG(point)) from ratings WHERE ratings.status = "active" and productVariantId IN (SELECT id from product_variants WHERE productId = ProductModel.id) )'), 'SIGNED'), 'avgRating'],
          ],
        },
      };
    },
    byRating (rating) {
      return {
        where: {
          [Op.and]: [
            Sequelize.where(Sequelize.cast(Sequelize.literal('(select ROUND(AVG(point)) from ratings WHERE ratings.status = "active" and productVariantId IN (SELECT id from product_variants WHERE productId = ProductModel.id) )'), 'SIGNED'), rating),
          ],
        },
      };
    },
    withRatingSummary () {
      return {
        attributes: {
          include: [
            [Sequelize.cast(Sequelize.literal('(SELECT COUNT(*) FROM ratings WHERE ratings.status = "active" and productVariantId IN (SELECT id from product_variants WHERE productId = ProductModel.id) AND ROUND(point) = 1)'), 'SIGNED'), 'ratingOneStar'],
            [Sequelize.cast(Sequelize.literal('(SELECT COUNT(*) FROM ratings WHERE ratings.status = "active" and productVariantId IN (SELECT id from product_variants WHERE productId = ProductModel.id) AND ROUND(point) = 2)'), 'SIGNED'), 'ratingTowStar'],
            [Sequelize.cast(Sequelize.literal('(SELECT COUNT(*) FROM ratings WHERE ratings.status = "active" and productVariantId IN (SELECT id from product_variants WHERE productId = ProductModel.id) AND ROUND(point) = 3)'), 'SIGNED'), 'ratingThereStar'],
            [Sequelize.cast(Sequelize.literal('(SELECT COUNT(*) FROM ratings WHERE ratings.status = "active" and productVariantId IN (SELECT id from product_variants WHERE productId = ProductModel.id) AND ROUND(point) = 4)'), 'SIGNED'), 'ratingFourStar'],
            [Sequelize.cast(Sequelize.literal('(SELECT COUNT(*) FROM ratings WHERE ratings.status = "active" and productVariantId IN (SELECT id from product_variants WHERE productId = ProductModel.id) AND ROUND(point) = 5)'), 'SIGNED'), 'ratingFiveStar'],
          ],
        },
      };
    },
    withSellQuantity () {
      return {
        attributes: {
          include: [
            [Sequelize.cast(Sequelize.literal('(SELECT SUM(order_items.quantity) FROM order_items ' +
            `INNER JOIN sub_orders ON sub_orders.id = order_items.subOrderId AND sub_orders.status = "${SubOrderModel.STATUS_ENUM.DELIVERED}" ` +
            'WHERE order_items.productVariantId IN (SELECT product_variants.id FROM product_variants WHERE product_variants.productId = ProductModel.id))'), 'SIGNED'),
            'sellQuantity'],
          ],
        },
      };
    },
  }

  public getVariants: HasManyGetAssociationsMixin<ProductVariantModel>;
  public getMedias: HasManyGetAssociationsMixin<ProductMediaModel>;
  public getCategories: BelongsToManyGetAssociationsMixin<ProductCategoryModel>;
  public getSizes: HasManyGetAssociationsMixin<ProductOptionModel>;

  public async getVariantDetail () {
    const variants = await this.getVariants({
      include: [
        { model: ProductOptionModel, as: 'options' },
        {
          model: WarehouseVariantModel,
          as: 'warehouseVariants',
          required: false,
          where: {
            quantity: { [Op.gt]: 0 },
          },
          include: [
            {
              model: WarehouseModel,
              as: 'warehouse',
            },
          ],
        },
      ],
    });
    const sizes = await MSizeModel.findAll();
    const colors = await MColorModel.findAll();
    for (const variant of variants) {
      variant.getDataValue('options').forEach((option: any) => {
        if (option.key === ProductOptionModel.KEY_ENUM.COLOR) {
          option.setDataValue('valueName', colors.find((record: any) => record.id === option.value)?.colorCode || null);
        }
        if (option.key === ProductOptionModel.KEY_ENUM.SUPPORTING_COLOR) {
          option.setDataValue('valueName', colors.find((record: any) => record.id === option.value)?.colorCode || null);
        }
        if (option.key === ProductOptionModel.KEY_ENUM.SIZE) {
          option.setDataValue('valueName', sizes.find((record: any) => record.id === option.value)?.code || null);
        }
      });
    }
    return variants;
  }

  public async deleteProductDetail () {
    await ProductOptionModel.destroy({ where: { productId: this.id }, individualHooks: true });
    await ProductVariantModel.destroy({ where: { productId: this.id }, individualHooks: true });
    await ProductMediaModel.destroy({ where: { productId: this.id }, individualHooks: true });
  }

  public async deleteFavorite () {
    await FavoriteProductModel.destroy({ where: { productId: this.id }, individualHooks: true });
  }

  public setCategories: BelongsToManySetAssociationsMixin<ProductCategoryModel, number>;

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
        if (optionMappingId) {
          const option = options.find((option: any) => option.optionMappingId === optionMappingId);
          optionRef.push(option);
          variantOptionAttributes.push({
            variantId: variant.id,
            optionId: option.id,
          });
        }
      });
      const optionMainColor = optionRef.find((option: any) => option.key === ProductOptionModel.KEY_ENUM.COLOR);
      const optionSupportingColor = optionRef.find((option: any) => option.key === ProductOptionModel.KEY_ENUM.SUPPORTING_COLOR);
      const optionSize = optionRef.find((option: any) => option.key === ProductOptionModel.KEY_ENUM.SIZE);
      const mainColor = optionMainColor ? colors.find((record: any) => record.id === optionMainColor.value) : null;
      const supportingColor = optionSupportingColor ? colors.find((record: any) => record.id === optionSupportingColor.value) : null;
      const size = optionSize ? sizes.find((record: any) => record.id === optionSize.value) : null;
      if (!variant.skuCode) {
        let skuCode = `${this.skuCode}`;
        let mainSku = `${this.skuCode}`;
        if (mainColor) {
          skuCode = skuCode + `${mainColor.code}`;
          mainSku = skuCode;
        }
        if (supportingColor) {
          skuCode = skuCode + `${supportingColor.code}`;
          mainSku = skuCode;
        }
        if (size) skuCode = skuCode + `${size.code}`;
        await variant.update({ skuCode: skuCode, mainSku }, { transaction });
      }
    }
    const variationOptions = await ProductVariantOptionModel.bulkCreate(variantOptionAttributes, { transaction });
    await ProductVariantOptionModel.destroy({
      where: {
        variantId: this.variants.map((variant) => variant.id),
        id: { [Op.notIn]: variationOptions.map((option) => option.id) },
      },
      transaction,
    });
  }

  public async updateCategories (attributes: any[], transaction?: Transaction) {
    if (!attributes || !attributes.length) return;
    const categories = await ProductCategoryModel.scope([{ method: ['byId', attributes.map(attribute => attribute.productCategoryId)] }]).findAll();
    await this.setCategories(categories, { transaction });
  }

  public async updateMedias (medias: any[], transaction?: Transaction) {
    if (!medias) return;
    medias.forEach((record: any) => {
      record.productId = this.id;
    });
    const results = await ProductMediaModel.bulkCreate(medias, {
      updateOnDuplicate: ProductMediaModel.UPDATABLE_ON_DUPLICATE_PARAMETERS as (keyof ProductMediaInterface)[],
      individualHooks: true,
      transaction,
    });
    await ProductMediaModel.destroy({
      where: { productId: this.id, id: { [Op.notIn]: results.map((media) => media.id) } },
      individualHooks: true,
      transaction,
    });
  }

  public async updateVariants (variants: any[], transaction?: Transaction) {
    if (!variants) return;
    variants.forEach((record: any) => {
      record.productId = this.id;
    });
    const results = await ProductVariantModel.bulkCreate(variants, {
      updateOnDuplicate: ProductVariantModel.UPDATABLE_ON_DUPLICATE_PARAMETERS as (keyof ProductVariantInterface)[],
      individualHooks: true,
      transaction,
    });
    await ProductVariantModel.destroy({
      where: { productId: this.id, id: { [Op.notIn]: results.map((variant) => variant.id) } },
      individualHooks: true,
      transaction,
    });
    return results;
  }

  public async updateOptions (options: any[], transaction?: Transaction) {
    if (!options) return;
    options.forEach((record: any) => {
      record.productId = this.id;
    });
    const optionResults = await ProductOptionModel.bulkCreate(options, {
      updateOnDuplicate: ProductOptionModel.UPDATABLE_ON_DUPLICATE_PARAMETERS as (keyof ProductOptionInterface)[],
      individualHooks: true,
      transaction,
    });
    await ProductOptionModel.destroy({
      where: { productId: this.id, id: { [Op.notIn]: optionResults.map((option) => option.id) } },
      individualHooks: true,
      transaction,
    });
    return optionResults;
  }

  public async reloadWithDetail () {
    await this.reload({
      include: [
        { model: ProductMediaModel, as: 'medias' },
        { model: ProductCategoryModel, as: 'categories' },
        {
          model: ProductOptionModel,
          as: 'options',
        },
        {
          model: ProductVariantModel,
          as: 'variants',
          include: [
            { model: ProductOptionModel, as: 'options' },
          ],
        },
      ],
    });
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
    this.hasMany(ProductOptionModel, { as: 'colors', foreignKey: 'productId', scope: { key: ProductOptionModel.KEY_ENUM.COLOR } });
    this.hasMany(ProductOptionModel, { as: 'sizes', foreignKey: 'productId', scope: { key: ProductOptionModel.KEY_ENUM.SIZE } });
    this.hasMany(ProductVariantModel, { as: 'variants', foreignKey: 'productId', onDelete: 'CASCADE', hooks: true });
    this.hasMany(ProductMediaModel, { as: 'medias', foreignKey: 'productId', onDelete: 'CASCADE', hooks: true });
    this.belongsToMany(ProductCategoryModel, { through: ProductCategoryRefModel, as: 'collections', foreignKey: 'productId', onDelete: 'CASCADE', hooks: true, scope: { type: ProductCategoryModel.TYPE_ENUM.COLLECTION } });
    this.belongsTo(ProductCategoryModel, { as: 'genders', foreignKey: 'gender' });
    this.belongsTo(ProductCategoryModel, { as: 'productType', foreignKey: 'typeProductId' });
    this.hasMany(FavoriteProductModel, { as: 'favorites', foreignKey: 'productId' });
  }
}

export default ProductModel;
