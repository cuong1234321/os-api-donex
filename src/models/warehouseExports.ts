import WarehouseExportEntity from '@entities/warehouseExports';
import WarehouseExportInterface from '@interfaces/warehouseExports';
import dayjs from 'dayjs';
import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import WarehouseExportVariantModel from './warehouseExportVariants';

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

  static readonly CREATABLE_PARAMETERS = ['exportDate', 'type', 'exportAbleType', 'exportAble', 'orderId', 'deliverer', 'note',
    { warehouseExportVariants: ['warehouseId', 'variantId', 'quantity', 'price', 'totalPrice'] },
  ]

  static readonly hooks: Partial<ModelHooks<WarehouseExportModel>> = {}

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
    bySorting (sortBy, sortOrder) {
      return {
        order: [[Sequelize.literal(sortBy), sortOrder]],
      };
    },
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
  }
}

export default WarehouseExportModel;
