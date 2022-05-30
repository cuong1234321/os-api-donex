import { Model, ModelScopeOptions, Sequelize } from 'sequelize';
import MDistrictModel from '@models/mDistricts';
import MWardEntity from '@entities/mWards';
import MWardInterface from '@interfaces/mWards';
import MProvinceModel from './mProvinces';

class MWardModel extends Model<MWardInterface> implements MWardInterface {
  public id: number;
  public districtId: number;
  public code: string;
  public title: string;
  public misaCode: string;
  public ghnWardCode: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  public district?: MDistrictModel

  static readonly scopes: ModelScopeOptions = {
    byDistrict (districtId) {
      return { where: { districtId } };
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
    withAddress () {
      return {
        include: [
          {
            model: MDistrictModel,
            as: 'district',
            required: true,
            include: [{
              model: MProvinceModel,
              as: 'province',
              required: true,
            }],
          },
        ],
      };
    },
    byWardAddress (districtId, provinceId) {
      return {
        include: [
          {
            model: MDistrictModel,
            as: 'district',
            where: { id: districtId },
            required: true,
            include: [{
              model: MProvinceModel,
              as: 'province',
              where: { id: provinceId },
              required: true,
            }],
          },
        ],
      };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(MWardEntity, {
      tableName: 'm_wards',
      scopes: MWardModel.scopes,
      sequelize,
    });
  }

  public static associate () {
    this.belongsTo(MDistrictModel, { as: 'district', foreignKey: 'districtId' });
  }
}

export default MWardModel;
