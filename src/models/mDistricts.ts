import { Model, ModelScopeOptions, Sequelize } from 'sequelize';
import MDistrictEntity from '@entities/mDistricts';
import MDistrictInterface from '@interfaces/mDistricts';

class MDistrictModel extends Model<MDistrictInterface> implements MDistrictInterface {
  public id: number;
  public provinceId: number;
  public code: string;
  public title: string;
  public misaCode: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly scopes: ModelScopeOptions = {
    byProvince (provinceId) {
      return { where: { provinceId } };
    },
    byMisaCode (misaCode) {
      return {
        where: { misaCode },
      };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(MDistrictEntity, {
      tableName: 'm_districts',
      scopes: MDistrictModel.scopes,
      sequelize,
    });
  }

  public static associate () { }
}

export default MDistrictModel;
