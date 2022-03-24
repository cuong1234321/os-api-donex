import { Model, ModelScopeOptions, Sequelize } from 'sequelize';
import PopupEntity from '@entities/popups';
import PopupInterface from '@interfaces/popups';

class PopupModel extends Model<PopupInterface> implements PopupInterface {
  public id: number;
  public title: string;
  public image: string;
  public link: string;
  public frequency: number;
  public applyAt: Date;
  public applyTo: Date;
  public status: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly scopes: ModelScopeOptions = {}

  public static initialize (sequelize: Sequelize) {
    this.init(PopupEntity, {
      tableName: 'popups',
      scopes: PopupModel.scopes,
      sequelize,
    });
  }

  public static associate () { }
}

export default PopupModel;
