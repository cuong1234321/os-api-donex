import WarehouseTransferEntity from '@entities/warehouseTransfers';
import WarehouseTransferInterface from '@interfaces/warehouseTransfers';
import dayjs from 'dayjs';
import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize, Transaction, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import settings from '@configs/settings';
import ProductVariantModel from './productVariants';
import ProductOptionModel from './productOptions';
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

  static readonly UPDATABLE_PARAMETERS = ['toWarehouseId', 'transferDate', 'note', 'status',
    { warehouseTransferVariants: ['id', 'variantId', 'quantity', 'price', 'totalPrice'] },
  ]

  static readonly STATUS_ENUM = { PENDING: 'pending', CONFIRM: 'confirm', REJECT: 'reject' }

  static readonly hooks: Partial<ModelHooks<WarehouseTransferModel>> = {
    async afterCreate (record, options) {
      const code = settings.warehouseTransferCode + String(record.id).padStart(6, '0');
      await record.update({ code }, { transaction: options.transaction });
    },
    async afterUpdate (record) {
      if (record.previous('status') === WarehouseTransferModel.STATUS_ENUM.PENDING && record.status === WarehouseTransferModel.STATUS_ENUM.CONFIRM) {
        await record.updateWarehouseVariantConfirm();
      }
      if (record.previous('status') === WarehouseTransferModel.STATUS_ENUM.PENDING && record.status === WarehouseTransferModel.STATUS_ENUM.REJECT) {
        await record.updateWarehouseVariantReject();
      }
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
      if (warehouseTransferVariants && warehouseTransferVariants.length > 0) {
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
    byId (id) {
      return {
        where: { id },
      };
    },
    byStatus (status) {
      return {
        where: { status },
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
    withTotalPrice () {
      return {
        attributes: {
          include: [
            [
              Sequelize.cast(Sequelize.literal('(SELECT SUM(totalPrice) FROM warehouse_transfer_variants WHERE warehouseTransferId = WarehouseTransferModel.id AND deletedAt IS NULL )'), 'SIGNED'),
              'totalPrice',
            ],
          ],
        },
      };
    },
    withTotalQuantity () {
      return {
        attributes: {
          include: [
            [
              Sequelize.cast(Sequelize.literal('(SELECT SUM(quantity) FROM warehouse_transfer_variants WHERE warehouseTransferId = WarehouseTransferModel.id AND deletedAt IS NULL )'), 'SIGNED'),
              'totalQuantity',
            ],
          ],
        },
      };
    },
  }

  public async updateTransferVariants (transferVariants: any[], transaction?: Transaction) {
    if (!transferVariants) return;
    transferVariants.forEach((record: any) => {
      record.warehouseTransferId = this.id;
    });
    let results: any = [];
    for (const transferVariant of transferVariants) {
      if (transferVariant.id) {
        const result = await WarehouseTransferVariantModel.update(transferVariant, { where: { id: transferVariant.id }, individualHooks: true, transaction });
        results.push(result[1]);
      } else {
        transferVariant.warehouseReceiptId = this.id;
        const result = await WarehouseTransferVariantModel.create(transferVariant, { individualHooks: true, transaction });
        results.push(result);
      }
    }
    results = results.flat(Infinity);
    await WarehouseTransferVariantModel.destroy({
      where: { warehouseTransferId: this.id, id: { [Op.notIn]: results.map((receiptVariant: any) => receiptVariant.id) } },
      individualHooks: true,
      transaction,
    });
    return results;
  }

  public async reloadWithDetail () {
    await this.reload({
      include: [
        {
          model: WarehouseTransferVariantModel,
          as: 'warehouseTransferVariants',
          include: [
            {
              model: ProductVariantModel,
              as: 'variant',
              include: [
                {
                  model: ProductOptionModel,
                  as: 'options',
                  required: false,
                  where: {
                    thumbnail: { [Op.ne]: null },
                  },
                },
              ],
            },
          ],
        },
      ],
    });
  }

  private async updateWarehouseVariantConfirm () {
    const transferVariants = await WarehouseTransferVariantModel.scope([
      { method: ['byWarehouseTransfer', this.id] },
    ]).findAll();
    const warehouseVariantReceipts = await WarehouseVariantModel.scope([
      { method: ['byWarehouseId', this.toWarehouseId] },
    ]).findAll();
    for (const transferVariant of transferVariants) {
      const warehouseVariantReceipt = warehouseVariantReceipts.find((warehouseVariant: any) => warehouseVariant.variantId === transferVariant.variantId);
      if (warehouseVariantReceipt) {
        await warehouseVariantReceipt.update({ quantity: warehouseVariantReceipt.quantity + (transferVariant.quantity || 0) });
      } else {
        await WarehouseVariantModel.create({
          id: undefined,
          warehouseId: this.toWarehouseId,
          variantId: transferVariant.variantId,
          quantity: transferVariant.quantity || 0,
        });
      }
    }
  }

  private async updateWarehouseVariantReject () {
    const transferVariants = await WarehouseTransferVariantModel.scope([
      { method: ['byWarehouseTransfer', this.id] },
    ]).findAll();
    const warehouseVariantExports = await WarehouseVariantModel.scope([
      { method: ['byWarehouseId', this.fromWarehouseId] },
    ]).findAll();
    for (const transferVariant of transferVariants) {
      const warehouseVariantExport = warehouseVariantExports.find((warehouseVariant: any) => warehouseVariant.variantId === transferVariant.variantId);
      if (warehouseVariantExport) {
        await warehouseVariantExport.update({ quantity: warehouseVariantExport.quantity + (transferVariant.quantity || 0) });
      }
    }
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
