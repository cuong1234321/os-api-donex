import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize, ValidationErrorItem } from 'sequelize';
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

  static readonly STATUS_ENUM = { ACTIVE: 'active', INACTIVE: 'inActive' };

  static readonly CREATABLE_PARAMETERS = ['title', 'link', 'frequency', 'applyAt', 'applyTo'];
  static readonly UPDATABLE_PARAMETERS = ['title', 'link', 'status', 'frequency', 'applyAt', 'applyTo'];

  static readonly validations: ModelValidateOptions = {
    async validApplyTime () {
      if (this.applyAt && this.applyTo && this.applyAt >= this.applyTo) {
        throw new ValidationErrorItem('Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc', 'validApplyTime');
      }
    },
  }

  static readonly scopes: ModelScopeOptions = {}

  public static initialize (sequelize: Sequelize) {
    this.init(PopupEntity, {
      tableName: 'popups',
      scopes: PopupModel.scopes,
      validate: PopupModel.validations,
      sequelize,
    });
  }

  public static associate () { }
}

export default PopupModel;
