import settings from '@configs/settings';
import WarehouseEntity from '@entities/warehouses';
import WarehouseInterface from '@interfaces/warehouses';
import WarehouseVariantInterface from '@interfaces/warehouseVariants';
import { HasManyGetAssociationsMixin, Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import ProductModel from './products';
import ProductVariantModel from './productVariants';
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
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  public cartItems?: any[];
  public warehouseVariant?: WarehouseVariantInterface[];
  public districtName?: string;
  public wardName?: string;
  public provinceName?: string;

  static readonly CREATABLE_PARAMETERS = ['name', 'type', 'description', 'code', 'wardId', 'districtId', 'provinceId', 'address', 'phoneNumber', 'warehouseManager']
  static readonly UPDATABLE_PARAMETERS = ['name', 'type', 'description', 'code', 'status', 'wardId', 'districtId', 'provinceId', 'address', 'phoneNumber', 'warehouseManager']

  static readonly hooks: Partial<ModelHooks<WarehouseModel>> = {}

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
  }

  public getWarehouseVariants: HasManyGetAssociationsMixin<WarehouseVariantModel>

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
  }
}

export default WarehouseModel;
