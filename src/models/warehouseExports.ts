import WarehouseExportEntity from '@entities/warehouseExports';
import WarehouseExportInterface from '@interfaces/warehouseExports';
import dayjs from 'dayjs';
import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize, Transaction } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import ProductOptionModel from './productOptions';
import ProductModel from './products';
import ProductVariantModel from './productVariants';
import WarehouseExportVariantModel from './warehouseExportVariants';
import WarehouseModel from './warehouses';
import WarehouseVariantModel from './warehouseVariants';

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
  public status: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly CREATABLE_PARAMETERS = ['exportDate', 'type', 'exportAbleType', 'exportAble', 'orderId', 'deliverer', 'note',
    { warehouseExportVariants: ['warehouseId', 'variantId', 'quantity', 'price', 'totalPrice'] },
  ]

  static readonly UPDATABLE_PARAMETERS = ['exportDate', 'type', 'exportAbleType', 'exportAble', 'orderId', 'deliverer', 'note',
    { warehouseExportVariants: ['id', 'warehouseId', 'variantId', 'quantity', 'price', 'totalPrice'] },
  ]

  static readonly TYPE_ENUM = { SELL: 'sell', OTHERS: 'others' }

  static readonly STATUS_ENUM = { PENDING: 'pending', WAITING_TO_TRANSFER: 'waitingToTransfer', COMPLETE: 'complete', CANCEL: 'cancel' }

  static readonly hooks: Partial<ModelHooks<WarehouseExportModel>> = {
    async afterUpdate (record) {
      if (record.previous('status') !== record.status && record.status === WarehouseExportModel.STATUS_ENUM.CANCEL) {
        const warehouseExportVariants = await WarehouseExportVariantModel.scope([{ method: ['byWarehouseExport', record.id] }]).findAll();
        const warehouseVariants = await WarehouseVariantModel.scope([
          { method: ['byWarehouseId', warehouseExportVariants.map((record) => record.warehouseId)] },
          { method: ['byProductVariant', warehouseExportVariants.map((record) => record.variantId)] },
        ]).findAll();
        for (const warehouseExportVariant of warehouseExportVariants) {
          const warehouseVariant = warehouseVariants.find((record) => record.warehouseId === warehouseExportVariant.warehouseId && record.variantId === warehouseExportVariant.variantId);
          if (warehouseVariant) {
            await warehouseVariant.update({ quantity: warehouseVariant.quantity + warehouseExportVariant.quantity }, { hooks: false });
          }
        }
      }
    },
  }

  static readonly validations: ModelValidateOptions = {}

  static readonly scopes: ModelScopeOptions = {
    byDate (from, to) {
      if (!from && !to) return { where: {} };
      const createdAtCondition: any = {};
      if (from) Object.assign(createdAtCondition, { [Op.gt]: dayjs(from as string).startOf('day').format() });
      if (to) Object.assign(createdAtCondition, { [Op.lte]: dayjs(to as string).endOf('day').format() });
      return {
        where: { exportDate: createdAtCondition },
      };
    },
    byType (type) {
      return {
        where: { type },
      };
    },
    byId (id) {
      return {
        where: { id },
      };
    },
    withExportAbleName () {
      return {
        attributes: {
          include: [
            [
              Sequelize.literal('(SELECT' +
                '(CASE warehouse_exports.exportAbleType ' +
                'WHEN "customer" THEN (SELECT users.fullName from users WHERE users.id = CONVERT(warehouse_exports.exportAble, DECIMAL)) ' +
                'WHEN "collaborator" THEN (SELECT collaborators.fullName from collaborators WHERE collaborators.id = CONVERT(warehouse_exports.exportAble, DECIMAL)) ' +
                'WHEN "agency" THEN (SELECT collaborators.fullName from collaborators WHERE collaborators.id = CONVERT(warehouse_exports.exportAble, DECIMAL)) ' +
                'WHEN "distributor" THEN (SELECT collaborators.fullName from collaborators WHERE collaborators.id = CONVERT(warehouse_exports.exportAble, DECIMAL)) ' +
                'ELSE warehouse_exports.exportAble ' +
                'END) FROM warehouse_exports WHERE warehouse_exports.id = WarehouseExportModel.id)'),
              'exportAbleName',
            ],
          ],
        },
      };
    },
    withAdminName () {
      return {
        attributes: {
          include: [
            [
              Sequelize.literal('(SELECT fullName FROM admins WHERE id = WarehouseExportModel.adminId)'),
              'adminName',
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
              Sequelize.cast(Sequelize.literal('(SELECT SUM(totalPrice) FROM warehouse_export_variants WHERE warehouseExportId = WarehouseExportModel.id AND deletedAt IS NULL )'), 'SIGNED'),
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
              Sequelize.cast(Sequelize.literal('(SELECT SUM(quantity) FROM warehouse_export_variants WHERE warehouseExportId = WarehouseExportModel.id AND deletedAt IS NULL )'), 'SIGNED'),
              'totalQuantity',
            ],
          ],
        },
      };
    },
    bySorting (sortBy, sortOrder) {
      return {
        order: [[Sequelize.literal(sortBy), sortOrder]],
      };
    },
    byOrderId (orderId) {
      return {
        where: {
          orderId,
        },
      };
    },
  }

  public async updateExportVariants (exportVariants: any[], transaction?: Transaction) {
    if (!exportVariants) return;
    exportVariants.forEach((record: any) => {
      record.warehouseExportId = this.id;
    });
    let warehouseExportVariants: any = [];
    for (const exportVariant of exportVariants) {
      if (exportVariant.id) {
        const record = (await WarehouseExportVariantModel.update(exportVariant, { where: { id: exportVariant.id }, individualHooks: true, transaction }))[1];
        warehouseExportVariants.push(record);
      } else {
        exportVariant.warehouseExportId = this.id;
        const record = await WarehouseExportVariantModel.create(exportVariant, { individualHooks: true, transaction });
        warehouseExportVariants.push(record);
      }
    }
    warehouseExportVariants = warehouseExportVariants.flat(Infinity);
    await WarehouseExportVariantModel.destroy({
      where: { warehouseExportId: this.id, id: { [Op.notIn]: warehouseExportVariants.map((exportVariant: any) => exportVariant.id) } },
      individualHooks: true,
      transaction,
    });
    return warehouseExportVariants;
  }

  public async reloadWithDetail () {
    await this.reload({
      include: [
        {
          model: WarehouseExportVariantModel,
          as: 'warehouseExportVariants',
          include: [
            {
              model: ProductVariantModel,
              as: 'variant',
              include: [
                {
                  model: ProductOptionModel,
                  as: 'options',
                },
                {
                  model: ProductModel,
                  as: 'product',
                  attributes: ['unit'],
                },
              ],
            },
            {
              model: WarehouseModel,
              as: 'warehouse',
            },
          ],
        },
      ],
    });
  }

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
    this.hasMany(WarehouseExportVariantModel, { as: 'warehouseExportVariants', foreignKey: 'warehouseExportId' });
    this.hasMany(WarehouseExportVariantModel, { as: 'exportVariants', foreignKey: 'warehouseExportId' });
  }
}

export default WarehouseExportModel;
