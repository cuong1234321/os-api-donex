import ProductEntity from '@entities/products';
import ProductInterface from '@interfaces/products';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import ProductCategoryModel from './productCategories';
import ProductCategoryRefModel from './productCategoryRefs';
import ProductOptionModel from './productOptions';

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

  static readonly CREATABLE_PARAMETERS = [
    'name', 'description', 'shortDescription', 'status', 'gender', 'typeProductId', 'sizeGuide', 'isHighlight',
    'isNew', 'weight', 'length', 'width', 'height', 'unit', 'minStock', 'maxStock',
    { categoryRefs: ['productCategoryId'] },
    { options: ['key', 'value'] },
  ];

  static readonly hooks: Partial<ModelHooks<ProductModel>> = {
    async beforeCreate (record) {
      record.skuCode = await record.generateSkuCode();
      record.barCode = await record.generateBarCode();
    },
  }

  static readonly validations: ModelValidateOptions = {
  }

  static readonly scopes: ModelScopeOptions = {
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

  public static initialize (sequelize: Sequelize) {
    this.init(ProductEntity, {
      hooks: ProductModel.hooks,
      scopes: ProductModel.scopes,
      validate: ProductModel.validations,
      tableName: 'products',
      sequelize,
    });
  }

  public static associate () {
    this.hasMany(ProductCategoryRefModel, { as: 'categoryRefs', foreignKey: 'productId', onDelete: 'CASCADE', hooks: true });
    this.hasMany(ProductOptionModel, { as: 'options', foreignKey: 'productId', onDelete: 'CASCADE', hooks: true });
    this.belongsToMany(ProductCategoryModel, { through: ProductCategoryRefModel, as: 'categories', foreignKey: 'productId', onDelete: 'CASCADE', hooks: true });
  }
}

export default ProductModel;
