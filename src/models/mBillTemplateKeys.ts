import MBillTemplateKeyEntity from '@entities/mBillTemplatelKeys';
import MBillTemplateKeyInterface from '@interfaces/mBillTemplateKeys';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class MBillTemplateKeyModel extends Model<MBillTemplateKeyInterface> implements MBillTemplateKeyInterface {
  public id: number;
  public title: string;
  public key: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly hooks: Partial<ModelHooks<MBillTemplateKeyModel>> = { }

  static readonly validations: ModelValidateOptions = { }

  static readonly scopes: ModelScopeOptions = { }

  public static initialize (sequelize: Sequelize) {
    this.init(MBillTemplateKeyEntity, {
      hooks: MBillTemplateKeyModel.hooks,
      scopes: MBillTemplateKeyModel.scopes,
      validate: MBillTemplateKeyModel.validations,
      tableName: 'm_bill_template_keys',
      sequelize,
    });
  }

  public static associate () {
  }
}

export default MBillTemplateKeyModel;
