import BillTemplateEntity from '@entities/billTemplates';
import BillTemplateInterface from '@interfaces/billTemplates';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class BillTemplateModel extends Model<BillTemplateInterface> implements BillTemplateInterface {
  public id: number;
  public title: string;
  public content: string;
  public status: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly CREATABLE_PARAMETERS = ['title', 'content']

  static readonly STATUS_ENUM = { ACTIVE: 'active', INACTIVE: 'inactive' }

  static readonly hooks: Partial<ModelHooks<BillTemplateModel>> = {}

  static readonly validations: ModelValidateOptions = {}

  static readonly scopes: ModelScopeOptions = {}

  public static initialize (sequelize: Sequelize) {
    this.init(BillTemplateEntity, {
      hooks: BillTemplateModel.hooks,
      scopes: BillTemplateModel.scopes,
      validate: BillTemplateModel.validations,
      tableName: 'bill_templates',
      paranoid: true,
      sequelize,
    });
  }

  public static associate () {}
}

export default BillTemplateModel;
