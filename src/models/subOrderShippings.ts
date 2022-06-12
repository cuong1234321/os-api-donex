import SubOrderShippingEntity from '@entities/subOrderShippings';
import SubOrderShippingInterface from '@interfaces/subOrderShippings';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import SubOrderModel from './subOrders';

class SubOrderShippingModel extends Model<SubOrderShippingInterface> implements SubOrderShippingInterface {
  public id: number;
  public subOrderId: number;
  public content: string;
  public incurredAt: Date;
  public status: string;
  public ghnWarehouse: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly hooks: Partial<ModelHooks<SubOrderShippingModel>> = {
  }

  static readonly validations: ModelValidateOptions = {

  }

  static readonly scopes: ModelScopeOptions = {
    byId (id) {
      return { where: { id } };
    },
    bySubOrder (subOrderId) {
      return { where: { subOrderId } };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(SubOrderShippingEntity, {
      hooks: SubOrderShippingModel.hooks,
      scopes: SubOrderShippingModel.scopes,
      validate: SubOrderShippingModel.validations,
      tableName: 'sub_order_shippings',
      sequelize,
    });
  }

  public static associate () {
    this.belongsTo(SubOrderModel, { as: 'subOrder', foreignKey: 'subOrderId' });
  }
}

export default SubOrderShippingModel;
