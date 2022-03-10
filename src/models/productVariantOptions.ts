import ProductVariantOptionEntity from '@entities/productVariantOptions';
import ProductVariantOptionInterface from '@interfaces/productVariantOptions';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class ProductVariantOptionModel extends Model<ProductVariantOptionInterface> implements ProductVariantOptionInterface {
  public id: number;
  public variantId: number;
  public optionId: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly hooks: Partial<ModelHooks<ProductVariantOptionModel>> = { }

  static readonly validations: ModelValidateOptions = { }

  static readonly scopes: ModelScopeOptions = { }

  public static initialize (sequelize: Sequelize) {
    this.init(ProductVariantOptionEntity, {
      hooks: ProductVariantOptionModel.hooks,
      scopes: ProductVariantOptionModel.scopes,
      validate: ProductVariantOptionModel.validations,
      tableName: 'product_variant_options',
      sequelize,
      paranoid: true,
    });
  }

  public static associate () {
  }
}

export default ProductVariantOptionModel;
