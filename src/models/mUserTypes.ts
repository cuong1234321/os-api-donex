import { Model, ModelScopeOptions, Sequelize } from 'sequelize';
import MUserTypeEntity from '@entities/mUserTypes';
import MUsertypeInterface from '@interfaces/mUserTypes';

class MUserTypeModel extends Model<MUsertypeInterface> implements MUsertypeInterface {
  public id: number;
  public name: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly TYPE_ENUM = { USER: 'user', COLLABORATOR: 'collaborator', AGENCY: 'agency', DISTRIBUTOR: 'distributor' }

  static readonly scopes: ModelScopeOptions = {}

  public static initialize (sequelize: Sequelize) {
    this.init(MUserTypeEntity, {
      tableName: 'm_user_types',
      scopes: MUserTypeModel.scopes,
      sequelize,
    });
  }

  public static associate () { }
}

export default MUserTypeModel;
