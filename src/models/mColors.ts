import { Model, ModelScopeOptions, Sequelize } from 'sequelize';
import MColorEntity from '@entities/mColors';
import MColorInterface from '@interfaces/mColors';

class MColorModel extends Model<MColorInterface> implements MColorInterface {
  public id: number;
  public title: string;
  public colorCode: string;
  public code: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly scopes: ModelScopeOptions = {}

  public static initialize (sequelize: Sequelize) {
    this.init(MColorEntity, {
      tableName: 'm_colors',
      scopes: MColorModel.scopes,
      sequelize,
    });
  }

  public static associate () { }
}

export default MColorModel;
