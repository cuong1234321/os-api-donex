import WarehouseReceiptEntity from '@entities/warehouseReceipts';
import WarehouseReceiptInterface from '@interfaces/warehouseReceipts';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class WarehouseReceiptModel extends Model<WarehouseReceiptInterface> implements WarehouseReceiptInterface {
  public id: number;
  public adminId: number;
  public type: string;
  public importAbleType: string;
  public importAble: string;
  public importDate: Date;
  public orderId: number;
  public deliverer: string;
  public note: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly hooks: Partial<ModelHooks<WarehouseReceiptModel>> = {}

  static readonly validations: ModelValidateOptions = {}

  static readonly scopes: ModelScopeOptions = {}

  public static initialize (sequelize: Sequelize) {
    this.init(WarehouseReceiptEntity, {
      hooks: WarehouseReceiptModel.hooks,
      scopes: WarehouseReceiptModel.scopes,
      validate: WarehouseReceiptModel.validations,
      tableName: 'warehouseReceipts',
      paranoid: true,
      sequelize,
    });
  }

  public static associate () {
  }
}

export default WarehouseReceiptModel;
