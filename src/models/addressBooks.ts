import settings from '@configs/settings';
import AddressBookEntity from '@entities/addressBooks';
import AddressBookInterface from '@interfaces/addressBooks';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class AddressBookModel extends Model<AddressBookInterface> implements AddressBookInterface {
  public id: number;
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

  public static associate () {}
}

export default AddressBookModel;
