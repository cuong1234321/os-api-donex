import { Model, ModelScopeOptions, Sequelize } from 'sequelize';
import MProvinceEntity from '@entities/mProvinces';
import MProvinceInterface from '@interfaces/mProvinces';

class MProvinceModel extends Model<MProvinceInterface> implements MProvinceInterface {
  public id: number;
  public title: string;
  public code: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly scopes: ModelScopeOptions = {}

  public static initialize (sequelize: Sequelize) {
    this.init(MProvinceEntity, {
      tableName: 'm_provinces',
      scopes: MProvinceModel.scopes,
      sequelize,
    });
  }

  public static associate () { }
}

export default MProvinceModel;
