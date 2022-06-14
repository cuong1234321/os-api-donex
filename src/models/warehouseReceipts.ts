import WarehouseReceiptEntity from '@entities/warehouseReceipts';
import WarehouseReceiptInterface from '@interfaces/warehouseReceipts';
import dayjs from 'dayjs';
import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize, Transaction, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import ProductOptionModel from './productOptions';
import ProductModel from './products';
import ProductVariantModel from './productVariants';
import WarehouseReceiptVariantModel from './warehouseReceiptVariants';
import WarehouseModel from './warehouses';

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

  static readonly UPDATABLE_PARAMETERS = ['importDate', 'type', 'importAbleType', 'importAble', 'orderId', 'deliverer', 'note',
    { warehouseReceiptVariants: ['id', 'warehouseId', 'variantId', 'quantity', 'price', 'totalPrice'] },
  ]

  static readonly IMPORTABLE_TYPE: any = { ORDER: 'order' };

  static readonly hooks: Partial<ModelHooks<WarehouseReceiptModel>> = {}

  static readonly validations: ModelValidateOptions = {
    async uniqueOrderId () {
      if (this.orderId) {
        const existedRecord = await WarehouseReceiptModel.scope([{ method: ['byOrderId', this.orderId] }]).findOne();
        if (existedRecord && existedRecord.id !== this.id) {
          throw new ValidationErrorItem('Đơn hàng này đã được tạo phiếu nhập kho.', 'uniqueOrderId', 'orderId', this.orderId);
        }
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
        where: { createdAt: createdAtCondition },
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
    withTotalPrice () {
      return {
        attributes: {
          include: [
            [
              Sequelize.cast(Sequelize.literal('(SELECT SUM(totalPrice) FROM warehouseReceiptVariants WHERE warehouseReceiptId = WarehouseReceiptModel.id AND deletedAt IS NULL )'), 'SIGNED'),
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
              Sequelize.cast(Sequelize.literal('(SELECT SUM(quantity) FROM warehouseReceiptVariants WHERE warehouseReceiptId = WarehouseReceiptModel.id AND deletedAt IS NULL )'), 'SIGNED'),
              'totalQuantity',
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
    byOrderId (orderId) {
      return {
        where: {
          orderId,
        },
      };
    },
  }

  public async updateReceiptVariants (receiptVariants: any[], transaction?: Transaction) {
    if (!receiptVariants) return;
    receiptVariants.forEach((record: any) => {
      record.warehouseReceiptId = this.id;
    });
    let warehouseReceiptVariants: any = [];
    for (const receiptVariant of receiptVariants) {
      if (receiptVariant.id) {
        const record = (await WarehouseReceiptVariantModel.update(receiptVariant, { where: { id: receiptVariant.id }, individualHooks: true, transaction }))[1];
        warehouseReceiptVariants.push(record);
      } else {
        receiptVariant.warehouseReceiptId = this.id;
        const record = await WarehouseReceiptVariantModel.create(receiptVariant, { individualHooks: true, transaction });
        warehouseReceiptVariants.push(record);
      }
    }
    warehouseReceiptVariants = warehouseReceiptVariants.flat(Infinity);
    await WarehouseReceiptVariantModel.destroy({
      where: { warehouseReceiptId: this.id, id: { [Op.notIn]: warehouseReceiptVariants.map((receiptVariant: any) => receiptVariant.id) } },
      individualHooks: true,
      transaction,
    });
    return warehouseReceiptVariants;
  }

  public async reloadWithDetail () {
    await this.reload({
      include: [
        {
          model: WarehouseReceiptVariantModel,
          as: 'warehouseReceiptVariants',
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
    this.hasMany(WarehouseReceiptVariantModel, { as: 'receiptVariants', foreignKey: 'warehouseReceiptId' });
  }
}

export default WarehouseReceiptModel;
