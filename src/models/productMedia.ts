import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import ProductMediaEntity from '@entities/productMedia';
import ProductMediaInterface from '@interfaces/productMedia';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class MediaResourceModel extends Model<ProductMediaInterface> implements ProductMediaInterface {
  public id: number;
  public type: string;
  public source: string;
  public uploadableType: string;
  public uploadableId: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly hooks: Partial<ModelHooks<MediaResourceModel>> = {
  }

  static readonly validations: ModelValidateOptions = {
  }

  static readonly scopes: ModelScopeOptions = {
  }

  public static initialize (sequelize: Sequelize) {
    this.init(ProductMediaEntity, {
      tableName: 'product_media',
      hooks: MediaResourceModel.hooks,
      validate: MediaResourceModel.validations,
      scopes: MediaResourceModel.scopes,
      sequelize,
    });
  }

  public static associate () { }
}

export default MediaResourceModel;
