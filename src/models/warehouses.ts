import WarehouseEntity from '@entities/warehouses';
import WarehouseInterface from '@interfaces/warehouses';
import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
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
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  public cartItems?: any[];

  static readonly CREATABLE_PARAMETERS = ['name', 'type', 'description', 'code', 'wardId', 'districtId', 'provinceId', 'address']
  static readonly UPDATABLE_PARAMETERS = ['name', 'type', 'description', 'code', 'status', 'wardId', 'districtId', 'provinceId', 'address']

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
  }

  static readonly scopes: ModelScopeOptions = {
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
    byId (id) {
      return {
        where: { id },
      };
    },
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
  }
}

export default WarehouseModel;
