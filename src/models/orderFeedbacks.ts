import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize, ValidationErrorItem } from 'sequelize';
import OrderFeedbackEntity from '@entities/orderFeedbacks';
import OrderFeedbackInterface from '@interfaces/orderFeedbacks';
import SubOrderModel from './subOrders';

class OrderFeedbackModel extends Model<OrderFeedbackInterface> implements OrderFeedbackInterface {
  public id: number;
  public subOrderId: number;
  public creatableType: string;
  public creatableId: number;
  public adminConfirmId: number;
  public content: string;
  public status: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly CREATABLE_PARAMETERS = ['subOrderId', 'content']

  static readonly CREATABLE_TYPE = { USER: 'user', COLLABORATOR: 'collaborator', AGENCY: 'agency', DISTRIBUTOR: 'distributor' }
  static readonly STATUS_ENUM = { PENDING: 'user', CONFIRM: 'confirm' }

  static readonly scopes: ModelScopeOptions = {
    byCreatable (creatableType, creatableId) {
      return {
        where: {
          creatableId,
          creatableType,
        },
      };
    },
    bySubOrderId (subOrderId) {
      return {
        where: {
          subOrderId,
        },
      };
    },
    bySorting (sortBy, sortOrder) {
      return {
        order: [[Sequelize.literal(sortBy), sortOrder]],
      };
    },
  }

  static readonly validations: ModelValidateOptions = {
    async validatesubOrderId () {
      if (this.subOrderId) {
        const subOrder = await SubOrderModel.findByPk(this.subOrderId);
        if (!subOrder) { throw new ValidationErrorItem('Mã đơn hàng không tồn tại.', 'validatesubOrderId', 'subOrderId', this.subOrderId); }
      }
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(OrderFeedbackEntity, {
      tableName: 'order_feedbacks',
      scopes: OrderFeedbackModel.scopes,
      validate: OrderFeedbackModel.validations,
      sequelize,
    });
  }

  public static associate () { }
}

export default OrderFeedbackModel;
