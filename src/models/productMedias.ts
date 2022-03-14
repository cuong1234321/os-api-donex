import ProductMediaEntity from '@entities/productMedia';
import ProductMediaInterface from '@interfaces/productMedia';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class ProductMediaModel extends Model<ProductMediaInterface> implements ProductMediaInterface {
  public id: number;
  public productId: number;
  public source: string;
  public type: string;
  public isThumbnail: boolean;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly UPDATABLE_ON_DUPLICATE_PARAMETERS = ['id', 'isThumbnail'];

  static readonly TYPE_ENUM = { IMAGE: 'image', VIDEO: 'video' }

  static readonly hooks: Partial<ModelHooks<ProductMediaModel>> = { }

  static readonly validations: ModelValidateOptions = { }

  static readonly scopes: ModelScopeOptions = { }

  public static initialize (sequelize: Sequelize) {
    this.init(ProductMediaEntity, {
      hooks: ProductMediaModel.hooks,
      scopes: ProductMediaModel.scopes,
      validate: ProductMediaModel.validations,
      tableName: 'product_media',
      sequelize,
    });
  }

  public static associate () { }
}

export default ProductMediaModel;
