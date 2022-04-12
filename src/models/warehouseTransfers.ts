import WarehouseTransferEntity from '@entities/warehouseTransfers';
import WarehouseTransferInterface from '@interfaces/warehouseTransfers';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class WarehouseTransferModel extends Model<WarehouseTransferInterface> implements WarehouseTransferInterface {
  public id: number;
  public adminId: number;
  public code: string;
  public fromWarehouseId: number;
  public toWarehouseId: number;
  public transferDate: Date;
  public note: string;
  public status: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly hooks: Partial<ModelHooks<WarehouseTransferModel>> = {}

  static readonly validations: ModelValidateOptions = {}

  static readonly scopes: ModelScopeOptions = {}

  public static initialize (sequelize: Sequelize) {
    this.init(WarehouseTransferEntity, {
      hooks: WarehouseTransferModel.hooks,
      scopes: WarehouseTransferModel.scopes,
      validate: WarehouseTransferModel.validations,
      tableName: 'warehouse_transfers',
      paranoid: true,
      sequelize,
    });
  }

  public static associate () {
  }
}

export default WarehouseTransferModel;
