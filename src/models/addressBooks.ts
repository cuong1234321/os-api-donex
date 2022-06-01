import settings from '@configs/settings';
import AddressBookEntity from '@entities/addressBooks';
import AddressBookInterface from '@interfaces/addressBooks';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import MDistrictModel from './mDistricts';
import MProvinceModel from './mProvinces';
import MWardModel from './mWards';

class AddressBookModel extends Model<AddressBookInterface> implements AddressBookInterface {
  public id: number;
  public userType: string;
  public userId: number;
  public fullName: string;
  public phoneNumber: string;
  public address: string;
  public provinceId: number;
  public districtId: number;
  public wardId: number;
  public isDefault: boolean;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly CREATABLE_PARAMETERS = ['fullName', 'phoneNumber', 'address', 'provinceId', 'districtId', 'wardId', 'isDefault'];
  static readonly UPDATABLE_PARAMETERS = ['fullName', 'phoneNumber', 'address', 'provinceId', 'districtId', 'wardId', 'isDefault'];
  static readonly USER_TYPE_ENUM = { USER: 'user', COLLABORATOR: 'collaborator', AGENCY: 'agency', DISTRIBUTOR: 'distributor' }

  static readonly hooks: Partial<ModelHooks<AddressBookModel>> = {
    async beforeSave (record) {
      if (record.isDefault) {
        const addressBook = await AddressBookModel.scope([
          'byIsDefault',
          { method: ['byUser', record.userId] },
        ]).findOne();
        if (addressBook) { await addressBook.update({ isDefault: false }); }
      }
    },
  }

  static readonly validations: ModelValidateOptions = {
    async validatePhoneNumber () {
      if (!settings.phonePattern.test(this.phoneNumber)) {
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
    byUser (userId) {
      return {
        where: { userId },
      };
    },
    byIsDefault () {
      return {
        where: { isDefault: true },
      };
    },
    bySorting (sortBy, sortOrder) {
      return {
        order: [[Sequelize.literal(sortBy), sortOrder]],
      };
    },
    addressInfo () {
      return {
        attributes: {
          include: [
            [
              Sequelize.literal('(SELECT title FROM m_provinces WHERE m_provinces.id = AddressBookModel.provinceId)'),
              'provinceTitle',
            ],
            [
              Sequelize.literal('(SELECT title FROM m_districts WHERE m_districts.id = AddressBookModel.districtId)'),
              'districtTitle',
            ],
            [
              Sequelize.literal('(SELECT title FROM m_wards WHERE m_wards.id = AddressBookModel.wardId)'),
              'wardTitle',
            ],
          ],
        },
      };
    },
    withMisaCode () {
      return {
        attributes: {
          include: [
            [
              Sequelize.literal('(SELECT misaCode FROM m_provinces WHERE m_provinces.id = AddressBookModel.provinceId)'),
              'provinceMisaCode',
            ],
            [
              Sequelize.literal('(SELECT misaCode FROM m_districts WHERE m_districts.id = AddressBookModel.districtId)'),
              'districtMisaCode',
            ],
            [
              Sequelize.literal('(SELECT misaCode FROM m_wards WHERE m_wards.id = AddressBookModel.wardId)'),
              'wardMisaCode',
            ],
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
          },
          {
            model: MDistrictModel,
            as: 'district',
          },
          {
            model: MWardModel,
            as: 'ward',
          },
        ],
      };
    },
    byUserAble (userId, userType) {
      return {
        where: {
          userId,
          userType,
        },
      };
    },
    byType (userType) {
      return {
        where: {
          userType,
        },
      };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(AddressBookEntity, {
      hooks: AddressBookModel.hooks,
      scopes: AddressBookModel.scopes,
      validate: AddressBookModel.validations,
      tableName: 'address_books',
      sequelize,
    });
  }

  public static associate () {
    this.belongsTo(MProvinceModel, { as: 'province', foreignKey: 'provinceId' });
    this.belongsTo(MDistrictModel, { as: 'district', foreignKey: 'districtId' });
    this.belongsTo(MWardModel, { as: 'ward', foreignKey: 'wardId' });
  }
}

export default AddressBookModel;
