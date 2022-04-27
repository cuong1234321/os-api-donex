import { Model, ModelScopeOptions, Sequelize } from 'sequelize';
import MWardEntity from '@entities/mWards';
import MWardInterface from '@interfaces/mWards';

class MWardModel extends Model<MWardInterface> implements MWardInterface {
  public id: number;
  public districtId: number;
  public code: string;
  public title: string;
  public misaCode: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly scopes: ModelScopeOptions = {
    byDistrict (districtId) {
      return { where: { districtId } };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(MWardEntity, {
      tableName: 'm_wards',
      scopes: MWardModel.scopes,
      sequelize,
    });
  }

  public static associate () { }
}

export default MWardModel;
