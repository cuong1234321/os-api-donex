import ProductOptionEntity from '@entities/productOptions';
import ProductOptionInterface from '@interfaces/productOptions';
import { Model, ModelScopeOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class ProductOptionModel extends Model<ProductOptionInterface> implements ProductOptionInterface {
  public id: number;
  public productId: number;
  public key: string;
  public value: number;
  public thumbnail: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly hooks: Partial<ModelHooks<ProductOptionModel>> = { }

  static readonly scopes: ModelScopeOptions = { }

  public static initialize (sequelize: Sequelize) {
    this.init(ProductOptionEntity, {
      hooks: ProductOptionModel.hooks,
      scopes: ProductOptionModel.scopes,
      tableName: 'product_optionss',
      sequelize,
      paranoid: true,
    });
  }

  public static associate () {
  }
}

export default ProductOptionModel;
