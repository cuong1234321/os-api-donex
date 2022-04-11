import WarehouseVariantEntity from '@entities/warehouseVariants';
import WarehouseVariantInterface from '@interfaces/warehouseVariants';
import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import WarehouseModel from './warehouses';

class WarehouseVariantModel extends Model<WarehouseVariantInterface> implements WarehouseVariantInterface {
  public id: number;
  public warehouseId: number;
  public variantId: number;
  public quantity: number;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly hooks: Partial<ModelHooks<WarehouseVariantModel>> = {}

  static readonly validations: ModelValidateOptions = {}

  static readonly scopes: ModelScopeOptions = {
    byWarehouseId (warehouseId) {
      return {
        where: { warehouseId },
      };
    },
    byProductVariant (variantId) {
      return {
        where: { variantId },
      };
    },
    withWarehouse () {
      return {
        include: [{
          model: WarehouseModel,
          as: 'warehouse',
          required: true,
        }],
      };
    },
    byEnoughQuantityVariant (quantity, variantId, warehouseId) {
      return {
        where: {
          [Op.and]: [
            { variantId },
            { warehouseId },
            { quantity: { [Op.gte]: quantity } },
          ],
        },
      };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(WarehouseVariantEntity, {
      hooks: WarehouseVariantModel.hooks,
      scopes: WarehouseVariantModel.scopes,
      validate: WarehouseVariantModel.validations,
      tableName: 'warehouse_variants',
      sequelize,
    });
  }

  public static associate () {
    this.belongsTo(WarehouseModel, { as: 'warehouse', foreignKey: 'warehouseId' });
  }
}

export default WarehouseVariantModel;
