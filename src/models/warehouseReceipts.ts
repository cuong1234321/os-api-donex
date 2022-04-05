import WarehouseReceiptEntity from '@entities/warehouseReceipts';
import WarehouseReceiptInterface from '@interfaces/warehouseReceipts';
import dayjs from 'dayjs';
import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import WarehouseReceiptVariantModel from './warehouseReceiptVariants';

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

  static readonly CREATABLE_PARAMETERS = ['importDate', 'type', 'importAbleType', 'importAble', 'orderId', 'deliverer', 'note',
    { warehouseReceiptVariants: ['warehouseId', 'variantId', 'quantity', 'price', 'totalPrice'] },
  ]

  static readonly hooks: Partial<ModelHooks<WarehouseReceiptModel>> = {}

  static readonly validations: ModelValidateOptions = {}

  static readonly scopes: ModelScopeOptions = {
    byDate (from, to) {
      if (!from && !to) return { where: {} };
      const createdAtCondition: any = {};
      if (from) Object.assign(createdAtCondition, { [Op.gt]: dayjs(from as string).startOf('day').format() });
      if (to) Object.assign(createdAtCondition, { [Op.lte]: dayjs(to as string).endOf('day').format() });
      return {
        where: { importDate: createdAtCondition },
      };
    },
    byType (type) {
      return {
        where: { type },
      };
    },
    withImportAbleName () {
      return {
        attributes: {
          include: [
            [
              Sequelize.literal('(SELECT' +
                '(CASE warehouseReceipts.importAbleType ' +
                'WHEN "customer" THEN (SELECT users.fullName from users WHERE users.id = CONVERT(warehouseReceipts.importAble, DECIMAL)) ' +
                'WHEN "collaborator" THEN (SELECT collaborators.fullName from collaborators WHERE collaborators.id = CONVERT(warehouseReceipts.importAble, DECIMAL)) ' +
                'WHEN "agency" THEN (SELECT collaborators.fullName from collaborators WHERE collaborators.id = CONVERT(warehouseReceipts.importAble, DECIMAL)) ' +
                'WHEN "distributor" THEN (SELECT collaborators.fullName from collaborators WHERE collaborators.id = CONVERT(warehouseReceipts.importAble, DECIMAL)) ' +
                'ELSE warehouseReceipts.importAble ' +
                'END) FROM warehouseReceipts WHERE warehouseReceipts.id = WarehouseReceiptModel.id)'),
              'importAbleName',
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
              Sequelize.literal('(SELECT fullName FROM admins WHERE id = WarehouseReceiptModel.adminId)'),
              'adminName',
            ],
          ],
        },
      };
    },
    newest () {
      return {
        order: [['createdAt', 'DESC']],
      };
    },
  }

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
    this.hasMany(WarehouseReceiptVariantModel, { as: 'warehouseReceiptVariants', foreignKey: 'warehouseReceiptId' });
  }
}

export default WarehouseReceiptModel;
