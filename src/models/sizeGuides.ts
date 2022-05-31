import SizeGuideEntity from '@entities/sizeGuides';
import SizeGuideInterface from '@interfaces/sizeGuides';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class SizeGuideModel extends Model<SizeGuideInterface> implements SizeGuideInterface {
  public id: number;
  public sizeType: string;
  public mediaType: string;
  public source: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly SIZE_YPE_ENUM = { KID_SIZE: 'kidSize', CLOTHES_SIZE: 'clothesSize', SHOES_SIZE: 'shoesSize' }
  static readonly MEDIA_TYPE = { IMAGE: 'image', VIDEO: 'video' }
  static readonly CREATABLE_PARAMETERS = ['sizeType', 'mediaType', 'source']
  static readonly UPDATABLE_PARAMETERS = ['sizeType', 'mediaType', 'source']

  static readonly hooks: Partial<ModelHooks<SizeGuideModel>> = { }

  static readonly validations: ModelValidateOptions = { }

  static readonly scopes: ModelScopeOptions = {
    bySizeType (sizeType) {
      return {
        where: { sizeType },
      };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(SizeGuideEntity, {
      hooks: SizeGuideModel.hooks,
      scopes: SizeGuideModel.scopes,
      validate: SizeGuideModel.validations,
      tableName: 'size_guides',
      sequelize,
    });
  }

  public static associate () { }
}

export default SizeGuideModel;
