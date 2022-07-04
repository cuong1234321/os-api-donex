import settings from '@configs/settings';
import WarehouseEntity from '@entities/warehouses';
import WarehouseInterface from '@interfaces/warehouses';
import WarehouseVariantInterface from '@interfaces/warehouseVariants';
import { BelongsToManyGetAssociationsMixin, HasManyGetAssociationsMixin, Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import Store from '@repositories/models/stores';
import AdminModel from './admins';
import MDistrictModel from './mDistricts';
import MProvinceModel from './mProvinces';
import MWardModel from './mWards';
import ProductModel from './products';
import ProductVariantModel from './productVariants';
import AdminWarehouseModel from './adminWarehouses';
import WarehouseVariantModel from './warehouseVariants';

class WarehouseModel extends Model<WarehouseInterface> implements WarehouseInterface {
  public id: number;
  public name: string;
  public type: string;
  public status: string;
  public code: string;
  public description: string;
  public address: string;
  public provinceId: number;
  public districtId: number;
  public wardId: number;
  public phoneNumber: string;
  public warehouseManager: string;
  public ghnStoreId: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  public cartItems?: any[];
  public warehouseVariant?: WarehouseVariantInterface[];
  public districtName?: string;
  public wardName?: string;
  public provinceName?: string;
  public province?: MProvinceModel;
  public ward?: MWardModel;
  public district?: MDistrictModel;
  public ghnDistrictId?: number;
  public totalBill?: number;
  public totalFee?: number;
  public totalTax?: number;
  public coinDiscount?: number;
  public voucherDiscount?: number;
  public rankDiscount?: number;
  public dailyDiscount?: number;
  public totalDiscount?: number;
  public finalAmount?: number;

  static readonly CREATABLE_PARAMETERS = ['name', 'type', 'description', 'code', 'wardId', 'districtId', 'provinceId', 'address', 'phoneNumber', 'warehouseManager']
  static readonly UPDATABLE_PARAMETERS = ['name', 'type', 'description', 'code', 'status', 'wardId', 'districtId', 'provinceId', 'address', 'phoneNumber', 'warehouseManager', 'ghnStoreId']

  static readonly STATUS_ENUM = { INACTIVE: 'inactive', ACTIVE: 'active' }
  static readonly hooks: Partial<ModelHooks<WarehouseModel>> = {
    async beforeSave (record) {
      const district = await MDistrictModel.findByPk(record.districtId);
      const ward = await MWardModel.findByPk(record.wardId);
      if (district && ward) {
        const paramStore = {
          ghnDistrictId: parseInt(district.ghnDistrictId),
          ghnWardCode: ward.ghnWardCode,
          name: record.name,
          phone: record.phoneNumber || '',
          address: record.address,
        };
        const store = await Store.createStore(paramStore);
        record.ghnStoreId = store?.shop_id;
      }
    },
  }

  static readonly validations: ModelValidateOptions = {
    async uniqueName () {
      if (this.name) {
        const existedRecord = await WarehouseModel.scope([
          { method: ['byName', this.name] },
        ]).findOne();
        if (existedRecord && existedRecord.id !== this.id) {
          throw new ValidationErrorItem('Tên kho đã được sử dụng.', 'uniqueName', 'name', this.name);
        }
      }
    },
    async uniqueCode () {
      if (this.name) {
        const existedRecord = await WarehouseModel.scope([
          { method: ['byCode', this.code] },
        ]).findOne();
        if (existedRecord && existedRecord.id !== this.id) {
          throw new ValidationErrorItem('Mã kho đã được sử dụng.', 'uniqueCode', 'code', this.code);
        }
      }
    },
    async validatePhoneNumber () {
      if (this.phoneNumber && !settings.phonePattern.test(this.phoneNumber)) {
        throw new ValidationErrorItem('Số điện thoại không hợp lệ', 'validatePhoneNumber', 'phoneNumber');
      }
    },
    async validateStatus () {
      if (this.deletedAt && this.status !== WarehouseModel.STATUS_ENUM.INACTIVE) {
        throw new ValidationErrorItem('Không được xóa kho ở trạng thái Đang hoạt động.', 'validStatus', 'status', this.status);
      }
    },
  }

  static readonly scopes: ModelScopeOptions = {
    byId (id) {
      return {
        where: { id },
      };
    },
    byCode (code) {
      return {
        where: { code },
      };
    },
    byName (name) {
      return {
        where: { name },
      };
    },
    byStatus (status) {
      return {
        where: { status },
      };
    },
    byType (type) {
      return {
        where: { type },
      };
    },
    byFreeWord (freeWord) {
      return {
        where: {
          name: { [Op.like]: `%${freeWord || ''}%` },
        },
      };
    },
    newest () {
      return {
        order: [['createdAt', 'DESC']],
      };
    },
    totalQuantity () {
      return {
        attributes: {
          include: [
            [
              Sequelize.cast(Sequelize.literal('(SELECT SUM(quantity) FROM warehouse_variants WHERE warehouseId = WarehouseModel.id)'), 'SIGNED'),
              'totalQuantity',
            ],
          ],
        },
      };
    },
    withWarehouseVariant () {
      return {
        include: [
          {
            model: WarehouseVariantModel,
            as: 'warehouseVariant',
          },
        ],
      };
    },
    withWarehouseVariantDetail () {
      return {
        include: [
          {
            model: WarehouseVariantModel,
            as: 'warehouseVariants',
            include: [
              {
                model: ProductVariantModel,
                as: 'variants',
                include: [
                  {
                    model: ProductModel,
                    as: 'product',
                    attributes: ['unit'],
                  },
                ],
              },
            ],
          },
        ],
      };
    },
    withAddress () {
      return {
        attributes: {
          include: [
            [Sequelize.literal('(SELECT title FROM m_districts WHERE id = WarehouseModel.districtId)'), 'districtName'],
            [Sequelize.literal('(SELECT title FROM m_wards WHERE id = WarehouseModel.wardId)'), 'wardName'],
            [Sequelize.literal('(SELECT title FROM m_provinces WHERE id = WarehouseModel.provinceId)'), 'provinceName'],
          ],
        },
      };
    },
    withAddressInfo () {
      return {
        include: [
          {
            model: MProvinceModel,
            as: 'province',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
          {
            model: MDistrictModel,
            as: 'district',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
          {
            model: MWardModel,
            as: 'ward',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
        ],
      };
    },
    withGhnDistrict () {
      return {
        include: [
          {
            model: MDistrictModel,
            as: 'district',
          },
        ],
      };
    },
    bySorting (sortBy, sortOrder) {
      return {
        order: [[Sequelize.literal(sortBy), sortOrder]],
      };
    },
    withOrderQuantity (from, to) {
      const conditions = (from && to) ? `AND sub_orders.createdAt BETWEEN "${from}" AND "${to}"` : '';
      return {
        attributes: {
          include: [
            [
              Sequelize.cast(Sequelize.literal(`(SELECT COUNT(*) FROM sub_orders WHERE sub_orders.deletedAt IS NULL AND sub_orders.status = "delivered" 
              AND sub_orders.warehouseId = WarehouseModel.id
              ${conditions})`), 'SIGNED'),
              'orderQuantity',
            ],
          ],
        },
      };
    },
    withTotalListedPrice (from, to) {
      const conditions = (from && to) ? `AND sub_orders.createdAt BETWEEN "${from}" AND "${to}"` : '';
      return {
        attributes: {
          include: [
            [
              Sequelize.cast(Sequelize.literal('(SELECT SUM(listedPrice * quantity) FROM order_items WHERE order_items.deletedAt IS NULL AND ' +
              'order_items.subOrderId IN (SELECT id FROM sub_orders WHERE sub_orders.deletedAt IS NULL AND sub_orders.status = "delivered" ' +
              `${conditions} AND sub_orders.warehouseId = WarehouseModel.id))`), 'SIGNED'),
              'totalListedPrice',
            ],
          ],
        },
      };
    },
    withTotalDiscount (from, to) {
      const conditions = (from && to) ? `AND sub_orders.createdAt BETWEEN "${from}" AND "${to}"` : '';
      return {
        attributes: {
          include: [
            [
              Sequelize.cast(Sequelize.literal('(SELECT SUM(order_items.saleCampaignDiscount * order_items.quantity) + SUM(sub_orders.coinDiscount + sub_orders.voucherDiscount + sub_orders.rankDiscount + sub_orders.totalOtherDiscount) FROM order_items ' +
              'INNER JOIN sub_orders ON sub_orders.id = order_items.subOrderId AND sub_orders.status = "delivered" AND sub_orders.deletedAt IS NUll ' +
              `${conditions} WHERE sub_orders.warehouseId = WarehouseModel.id)`), 'SIGNED'),
              'totalDiscount',
            ],
          ],
        },
      };
    },
    byOrderQuantity (fromValue, toValue, fromDate, toDate) {
      const conditions = (fromDate && toDate) ? `AND sub_orders.createdAt BETWEEN "${fromDate}" AND "${toDate}"` : '';
      return {
        where: {
          [Op.and]: [
            Sequelize.where(Sequelize.cast(Sequelize.literal(`(SELECT COUNT(*) FROM sub_orders WHERE sub_orders.deletedAt IS NULL AND sub_orders.status = "delivered" 
            AND sub_orders.warehouseId = WarehouseModel.id
            ${conditions})`), 'SIGNED'),
            {
              [Op.between]: [fromValue, toValue],
            }),
          ],
        },
      };
    },
    byTotalListedPrice (fromValue, toValue, fromDate, toDate) {
      const conditions = (fromDate && toDate) ? `AND sub_orders.createdAt BETWEEN "${fromDate}" AND "${toDate}"` : '';
      return {
        where: {
          [Op.and]: [
            Sequelize.where(Sequelize.cast(Sequelize.literal('(SELECT SUM(listedPrice * quantity) FROM order_items WHERE order_items.deletedAt IS NULL AND ' +
            'order_items.subOrderId IN (SELECT id FROM sub_orders WHERE sub_orders.deletedAt IS NULL AND sub_orders.status = "delivered" ' +
            `${conditions} AND sub_orders.warehouseId = WarehouseModel.id))`), 'SIGNED'),
            {
              [Op.between]: [fromValue, toValue],
            }),
          ],
        },
      };
    },
    byTotalDiscount (fromValue, toValue, fromDate, toDate) {
      const conditions = (fromDate && toDate) ? `AND sub_orders.createdAt BETWEEN "${fromDate}" AND "${toDate}"` : '';
      return {
        where: {
          [Op.and]: [
            Sequelize.where(Sequelize.cast(Sequelize.literal('(SELECT SUM(order_items.saleCampaignDiscount * order_items.quantity) + SUM(sub_orders.coinDiscount + sub_orders.voucherDiscount + sub_orders.rankDiscount + sub_orders.totalOtherDiscount) FROM order_items ' +
            'INNER JOIN sub_orders ON sub_orders.id = order_items.subOrderId AND sub_orders.status = "delivered" AND sub_orders.deletedAt IS NUll ' +
            `${conditions} WHERE sub_orders.warehouseId = WarehouseModel.id)`), 'SIGNED'),
            {
              [Op.between]: [fromValue, toValue],
            }),
          ],
        },
      };
    },
  }

  public getWarehouseVariants: HasManyGetAssociationsMixin<WarehouseVariantModel>
  public getAdmins: BelongsToManyGetAssociationsMixin<AdminModel>

  public async checkDelete () {
    const warehouseVariants = await this.getWarehouseVariants();
    if (warehouseVariants.length !== 0) {
      return false;
    } else {
      return true;
    }
  }

  public static initialize (sequelize: Sequelize) {
    this.init(WarehouseEntity, {
      hooks: WarehouseModel.hooks,
      scopes: WarehouseModel.scopes,
      validate: WarehouseModel.validations,
      tableName: 'warehouses',
      paranoid: true,
      sequelize,
    });
  }

  public static associate () {
    this.hasMany(WarehouseVariantModel, { as: 'warehouseVariant', foreignKey: 'warehouseId' });
    this.belongsToMany(ProductVariantModel, { through: WarehouseVariantModel, as: 'variants', foreignKey: 'warehouseId' });
    this.hasMany(WarehouseVariantModel, { as: 'warehouseVariants', foreignKey: 'warehouseId' });
    this.belongsTo(MProvinceModel, { as: 'province', foreignKey: 'provinceId' });
    this.belongsTo(MDistrictModel, { as: 'district', foreignKey: 'districtId' });
    this.belongsTo(MWardModel, { as: 'ward', foreignKey: 'wardId' });
    this.hasMany(AdminWarehouseModel, { as: 'adminWarehouses', foreignKey: 'warehouseId', onDelete: 'CASCADE', hooks: true });
    this.belongsToMany(AdminModel, { through: AdminWarehouseModel, as: 'admins', foreignKey: 'warehouseId' });
  }
}

export default WarehouseModel;
