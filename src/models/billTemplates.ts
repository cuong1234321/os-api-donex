import BillTemplateEntity from '@entities/billTemplates';
import BillTemplateInterface from '@interfaces/billTemplates';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

class BillTemplateModel extends Model<BillTemplateInterface> implements BillTemplateInterface {
  public id: number;
  public title: string;
  public content: string;
  public status: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly CREATABLE_PARAMETERS = ['title', 'content']

  static readonly STATUS_ENUM = { ACTIVE: 'active', INACTIVE: 'inactive' }

  static readonly hooks: Partial<ModelHooks<BillTemplateModel>> = {}

  static readonly validations: ModelValidateOptions = {}

  static readonly scopes: ModelScopeOptions = {}

  public static formatDataBill (order: any, subOrder: any) {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    order = JSON.parse(JSON.stringify(order));
    subOrder = JSON.parse(JSON.stringify(subOrder));
    const billKeys = {
      buyerName: (order.shippingFullName).split(' ').pop(),
      buyerFullname: order.shippingFullName,
      buyerAddress: `${order.address}, ${order.wardName}, ${order.districtName}, ${order.provinceName}`,
      buyerPhone: order.shippingPhoneNumber,
      orderCode: subOrder.code,
      orderDate: dayjs(subOrder.createdAt).tz('Asia/Ho_Chi_Minh').format('DD-MM-YYYY HH:mm'),
      orderDay: dayjs(subOrder.createdAt).tz('Asia/Ho_Chi_Minh').format('DD-MM-YYYY'),
      orderEstimatedDelivery: '',
      orderChannel: order.saleChannel,
      salerName: order.createAbleName,
      cashierName: '',
    };
    return billKeys;
  }

  public static initialize (sequelize: Sequelize) {
    this.init(BillTemplateEntity, {
      hooks: BillTemplateModel.hooks,
      scopes: BillTemplateModel.scopes,
      validate: BillTemplateModel.validations,
      tableName: 'bill_templates',
      paranoid: true,
      sequelize,
    });
  }

  public static associate () {}
}

export default BillTemplateModel;
