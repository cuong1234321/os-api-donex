import AddressBookEntity from '@entities/addressBooks';
import AddressBookInterface from '@interfaces/addressBooks';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
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

  static readonly hooks: Partial<ModelHooks<AddressBookModel>> = {}

  static readonly scopes: ModelScopeOptions = {}

  static readonly validations: ModelValidateOptions = {}

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
