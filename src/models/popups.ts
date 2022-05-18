import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize, ValidationErrorItem } from 'sequelize';
import PopupEntity from '@entities/popups';
import PopupInterface from '@interfaces/popups';
import dayjs from 'dayjs';

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

  static readonly CREATABLE_PARAMETERS = ['title', 'link', 'frequency', 'applyAt', 'applyTo'];
  static readonly UPDATABLE_PARAMETERS = ['title', 'link', 'status', 'frequency', 'applyAt', 'applyTo'];

  static readonly STATUS_ENUM = { ACTIVE: 'active', INACTIVE: 'inactive' }
  static readonly STATUSREF_ENUM = { ACTIVE: 'active', INACTIVE: 'inactive', OUT_OF_DATE: 'outOfDate', INCOMING: 'incoming' }

  static readonly validations: ModelValidateOptions = {
    async validApplyTime () {
      if (this.applyAt && this.applyTo && this.applyAt >= this.applyTo) {
        throw new ValidationErrorItem('Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc', 'validApplyTime');
      }
    },
  }

  static readonly scopes: ModelScopeOptions = {
    isActive () {
      return {
        where: {
          status: PopupModel.STATUS_ENUM.ACTIVE,
          applyAt: { [Op.lte]: dayjs().format() },
          applyTo: { [Op.gte]: dayjs().format() },
        },
      };
    },
    bySortOrder (orderConditions) {
      orderConditions.push([Sequelize.literal('createdAt'), 'DESC']);
      return {
        order: orderConditions,
      };
    },
  }

  public static getStatus (popups: any) {
    popups.forEach((popup: any) => {
      if (popup.status === PopupModel.STATUS_ENUM.INACTIVE) {
        popup.setDataValue('statusRef', PopupModel.STATUSREF_ENUM.INACTIVE);
      } else if (popup.applyAt > dayjs() && popup.status === PopupModel.STATUS_ENUM.ACTIVE) {
        popup.setDataValue('statusRef', PopupModel.STATUSREF_ENUM.INCOMING);
      } else if (popup.applyTo && popup.applyTo < dayjs() && popup.status === PopupModel.STATUS_ENUM.ACTIVE) {
        popup.setDataValue('statusRef', PopupModel.STATUSREF_ENUM.OUT_OF_DATE);
      } else {
        popup.setDataValue('statusRef', PopupModel.STATUSREF_ENUM.ACTIVE);
      }
    });
    return popups;
  }

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
