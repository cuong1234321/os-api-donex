import { Model, ModelScopeOptions, Sequelize } from 'sequelize';
import MSizeEntity from '@entities/mSizes';
import MSizeInterface from '@interfaces/mSizes';

class MSizeModel extends Model<MSizeInterface> implements MSizeInterface {
  public id: number;
  public type: string;
  public code: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly scopes: ModelScopeOptions = {}

  public static initialize (sequelize: Sequelize) {
    this.init(MSizeEntity, {
      tableName: 'm_sizes',
      scopes: MSizeModel.scopes,
      sequelize,
    });
  }

  public static associate () { }
}

export default MSizeModel;
