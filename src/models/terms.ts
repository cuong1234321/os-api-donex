import TermsEntity from '@entities/terms';
import TermsInterface from '@interfaces/terms';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class TermsModel extends Model<TermsInterface> implements TermsInterface {
  public id: number;
  public type: string;
  public title: string;
  public content: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly UPDATABLE_PARAMETERS = ['content'];
  static readonly CREATABLE_PARAMETERS = ['content'];
  static readonly TYPE_ENUM = { RULE_USING_BONUS_POINT: 'ruleUsingBonusPoint', GUIDE_HUNTING_BONUS_POINT: 'guideHuntingBonusPoint', INTRODUCE: 'introduce', GUIDE_BUY: 'guideBuy', GUIDE_CHOOSE_SIZE: 'guideChooseSize', POLICY: 'policy', CHANCE_JOB: 'chanceJob', TRANSPORT: 'transport' }
  static readonly STATUS_ENUM = { ACTIVE: 'active', INACTIVE: 'inactive' }
  static readonly TYPE_MAPPING: any = { ruleUsingBonusPoint: 'Quy định sử dụng điểm thưởng', guideHuntingBonusPoint: 'Hướng dẫn cách săn điểm thưởng', introduce: 'Giới thiệu', guideBuy: 'Hướng dẫn mua hàng', guideChooseSize: 'Hướng dẫn chọn kích thước', policy: 'Chính sách và điều khoản', chanceJob: 'Cơ hội nghề nghiệp', transport: 'Vận chuyển và giao nhận' };

  static readonly validations: ModelValidateOptions = { }

  static readonly hooks: Partial<ModelHooks<TermsModel>> = {
    beforeSave (record) {
      record.title = TermsModel.TYPE_MAPPING[record.type];
    },
  }

  static readonly scopes: ModelScopeOptions = {
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
  }

  public static initialize (sequelize: Sequelize) {
    this.init(TermsEntity, {
      scopes: TermsModel.scopes,
      validate: TermsModel.validations,
      hooks: TermsModel.hooks,
      tableName: 'terms',
      sequelize,
    });
  }

  public static associate () { }
}

export default TermsModel;
