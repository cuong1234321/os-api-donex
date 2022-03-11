import ProductVariantEntity from '@entities/productVariants';
import ProductVariantInterface from '@interfaces/productVariants';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class ProductVariantModel extends Model<ProductVariantInterface> implements ProductVariantInterface {
  public id: number;
  public name: string;
  public slug: string;
  public skuCode: string;
  public barCode: string;
  public buyPrice: string;
  public sellPrice: string;
  public stock: number;

  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly hooks: Partial<ModelHooks<ProductVariantModel>> = {
  }

  static readonly validations: ModelValidateOptions = {
  }

  static readonly scopes: ModelScopeOptions = {
  }

  public static initialize (sequelize: Sequelize) {
    this.init(ProductVariantEntity, {
      hooks: ProductVariantModel.hooks,
      scopes: ProductVariantModel.scopes,
      validate: ProductVariantModel.validations,
      tableName: 'product_variants',
      sequelize,
    });
  }

  public static associate () {
  }
}

export default ProductVariantModel;
