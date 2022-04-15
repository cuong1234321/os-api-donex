import WarehouseTransferEntity from '@entities/warehouseTransfers';
import WarehouseTransferInterface from '@interfaces/warehouseTransfers';
import dayjs from 'dayjs';
import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import WarehouseModel from './warehouses';
import WarehouseTransferVariantModel from './warehouseTransferVariants';
import WarehouseVariantModel from './warehouseVariants';

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

  static readonly CREATABLE_PARAMETERS = ['fromWarehouseId', 'toWarehouseId', 'transferDate', 'note',
    { warehouseTransferVariants: ['variantId', 'quantity', 'price', 'totalPrice'] },
  ]

  static readonly hooks: Partial<ModelHooks<WarehouseTransferModel>> = {
    async afterCreate (record, options) {
      const code = 'CK' + String(record.id).padStart(6, '0');
      await record.update({ code }, { transaction: options.transaction });
    },
  }

  static readonly validations: ModelValidateOptions = {
    async validateToWarehouseId () {
      if (this.fromWarehouseId === this.toWarehouseId) {
        throw new ValidationErrorItem('Kho chuyển đến không được trùng với kho xuất.', 'validateToWarehouseId', 'toWarehouseId', this.toWarehouseId);
      }
      const warehouse = await WarehouseModel.findByPk(this.toWarehouseId);
      if (!warehouse) {
        throw new ValidationErrorItem('Kho chuyển đến không tồn tại.', 'validateToWarehouseId', 'toWarehouseId', this.toWarehouseId);
      }
    },
    async validateFromWarehouseId () {
      const warehouse = await WarehouseModel.findByPk(this.fromWarehouseId);
      if (!warehouse) {
        throw new ValidationErrorItem('Kho điều chuyển không tồn tại.', 'validateFromWarehouseId', 'fromWarehouseId', this.fromWarehouseId);
      }
    },
    async validateQuantity () {
      const warehouseVariants = await WarehouseVariantModel.scope([
        { method: ['byWarehouseId', this.fromWarehouseId] },
      ]).findAll();
      const warehouseTransferVariants = this.warehouseTransferVariants || null;
      if (warehouseTransferVariants.length > 0) {
        warehouseTransferVariants.forEach((record: any) => {
          const warehouseVariant = warehouseVariants.find((warehouseVariant: any) => warehouseVariant.variantId === record.variantId);
          if (!warehouseVariant) {
            throw new ValidationErrorItem('Sản phẩm không tồn tại trong kho điều chuyển.', 'validateQuantity');
          } else if (warehouseVariant.quantity < record.quantity) {
            throw new ValidationErrorItem('Số lượng sản phẩm không được lớn hơn số lượng sản phẩm trong kho điều chuyển.', 'validateQuantity');
          }
        });
      }
    },
  }

  static readonly scopes: ModelScopeOptions = {
    byDate (from, to) {
      if (!from && !to) return { where: {} };
      const createdAtCondition: any = {};
      if (from) Object.assign(createdAtCondition, { [Op.gt]: dayjs(from as string).startOf('day').format() });
      if (to) Object.assign(createdAtCondition, { [Op.lte]: dayjs(to as string).endOf('day').format() });
      return {
        where: { transferDate: createdAtCondition },
      };
    },
    bySorting (sortBy, sortOrder) {
      return {
        order: [[Sequelize.literal(sortBy), sortOrder]],
      };
    },
    withAdminName () {
      return {
        attributes: {
          include: [
            [
              Sequelize.literal('(SELECT fullName FROM admins WHERE id = WarehouseTransferModel.adminId)'),
              'adminName',
            ],
          ],
        },
      };
    },
    withWarehouseName () {
      return {
        attributes: {
          include: [
            [
              Sequelize.literal('(SELECT name FROM warehouses WHERE id = WarehouseTransferModel.fromWarehouseId)'),
              'fromWarehouseName',
            ],
            [
              Sequelize.literal('(SELECT name FROM warehouses WHERE id = WarehouseTransferModel.toWarehouseId)'),
              'toWarehouseName',
            ],
          ],
        },
      };
    },
  }

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
    this.hasMany(WarehouseTransferVariantModel, { as: 'warehouseTransferVariants', foreignKey: 'warehouseTransferId' });
  }
}

export default WarehouseTransferModel;
