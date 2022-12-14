import { Model, ModelScopeOptions, Sequelize } from 'sequelize';
import MProvinceEntity from '@entities/mProvinces';
import MProvinceInterface from '@interfaces/mProvinces';
import MDistrictModel from './mDistricts';

class MProvinceModel extends Model<MProvinceInterface> implements MProvinceInterface {
  public id: number;
  public title: string;
  public code: string;
  public misaCode: string;
  public ghnProvinceId: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly scopes: ModelScopeOptions = {
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
    this.init(MProvinceEntity, {
      tableName: 'm_provinces',
      scopes: MProvinceModel.scopes,
      sequelize,
    });
  }

  public static associate () {
    this.hasMany(MDistrictModel, { as: 'district', foreignKey: 'provinceId' });
  }
}

export default MProvinceModel;
