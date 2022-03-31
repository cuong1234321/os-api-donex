import SystemSettingEntity from '@entities/systemSetting';
import SystemSettingInterface from '@interfaces/systemSetting';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize, ValidationErrorItem } from 'sequelize';

class SystemSettingModel extends Model<SystemSettingInterface> implements SystemSettingInterface {
  public id: number;
  public applicationLink?: number;
  public coinConversionLevel?: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly scopes: ModelScopeOptions = { }

  static readonly validations: ModelValidateOptions = {
    validateSystemValue () {
      for (const [key, value] of Object.entries(this.dataValues)) {
        if (value < 0 && ['coinConversionLevel'].includes(key)) {
          throw new ValidationErrorItem('Giá trị cần lớn hơn 0', 'validateSystemValue', `${key}`, key);
        }
      }
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(SystemSettingEntity, {
      scopes: SystemSettingModel.scopes,
      validate: SystemSettingModel.validations,
      tableName: 'system_settings',
      sequelize,
    });
  }

  public static associate () { }
}

export default SystemSettingModel;
