import { Model, ModelScopeOptions, Sequelize } from 'sequelize';
import MDistrictEntity from '@entities/mDistricts';
import MDistrictInterface from '@interfaces/mDistricts';
import MProvinceModel from './mProvinces';
import MWardModel from './mWards';

class MDistrictModel extends Model<MDistrictInterface> implements MDistrictInterface {
  public id: number;
  public provinceId: number;
  public code: string;
  public title: string;
  public misaCode: string;
  public ghnDistrictId: string;
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
    byId (id) {
      return {
        where: { id },
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

  public static associate () {
    this.hasMany(MWardModel, { as: 'wards', foreignKey: 'districtId' });
    this.belongsTo(MProvinceModel, { as: 'province', foreignKey: 'provinceId' });
  }
}

export default MDistrictModel;
