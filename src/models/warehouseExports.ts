import WarehouseExportEntity from '@entities/warehouseExports';
import WarehouseExportInterface from '@interfaces/warehouseExports';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class WarehouseExportModel extends Model<WarehouseExportInterface> implements WarehouseExportInterface {
  public id: number;
  public adminId: number;
  public type: string;
  public exportAbleType: string;
  public exportAble: string;
  public exportDate: Date;
  public orderId: number;
  public deliverer: string;
  public note: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly hooks: Partial<ModelHooks<WarehouseExportModel>> = {}

  static readonly validations: ModelValidateOptions = {}

  static readonly scopes: ModelScopeOptions = {}

  public static initialize (sequelize: Sequelize) {
    this.init(WarehouseExportEntity, {
      hooks: WarehouseExportModel.hooks,
      scopes: WarehouseExportModel.scopes,
      validate: WarehouseExportModel.validations,
      tableName: 'warehouse_exports',
      paranoid: true,
      sequelize,
    });
  }

  public static associate () {
  }
}

export default WarehouseExportModel;
