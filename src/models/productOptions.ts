import ProductOptionEntity from '@entities/productOptions';
import ProductOptionInterface from '@interfaces/productOptions';
import { Model, ModelScopeOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import ProductVariantOptionModel from './productVariantOptions';
import ProductVariantModel from './productVariants';

class ProductOptionModel extends Model<ProductOptionInterface> implements ProductOptionInterface {
  public id: number;
  public productId: number;
  public key: string;
  public value: number;
  public thumbnail: string;
  public optionMappingId?: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly TYPE_ENUM = { color: 'color', size: 'size', form: 'form' }

  static readonly hooks: Partial<ModelHooks<ProductOptionModel>> = { }

  static readonly scopes: ModelScopeOptions = {
    byId (id) {
      return {
        where: { id },
      };
    },
    byKey (key) {
      return {
        where: { key },
      };
    },
    byProductId (productId) {
      return {
        where: { productId },
      };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(ProductOptionEntity, {
      hooks: ProductOptionModel.hooks,
      scopes: ProductOptionModel.scopes,
      tableName: 'product_options',
      sequelize,
      paranoid: true,
    });
  }

  public static associate () {
    this.belongsToMany(ProductVariantModel, { through: ProductVariantOptionModel, as: 'variants', foreignKey: 'optionId' });
  }
}

export default ProductOptionModel;
