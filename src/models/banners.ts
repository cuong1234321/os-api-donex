import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import BannerEntity from '@entities/banners';
import BannerInterface from '@interfaces/banners';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class BannerModel extends Model<BannerInterface> implements BannerInterface {
  public id: number;
  public title: string;
  public linkDirect: string;
  public position: string;
  public image: string;
  public orderId: number;
  public type: string;
  public isHighLight: boolean;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly validations: ModelValidateOptions = {};

  static readonly hooks: Partial<ModelHooks<BannerModel>> = {}

  static readonly scopes: ModelScopeOptions = {}

  public static initialize (sequelize: Sequelize) {
    this.init(BannerEntity, {
      scopes: BannerModel.scopes,
      hooks: BannerModel.hooks,
      validate: BannerModel.validations,
      tableName: 'banners',
      paranoid: true,
      sequelize,
    });
  }

  public static associate () { }
}

export default BannerModel;
