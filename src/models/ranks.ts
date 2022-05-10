import RankEntity from '@entities/ranks';
import RankConditionInterface from '@interfaces/rankConditions';
import RankInterface from '@interfaces/ranks';
import { HasManyGetAssociationsMixin, Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize, Transaction } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import RankConditionModel from './rankConditions';

class RankModel extends Model<RankInterface> implements RankInterface {
  public id: number;
  public type: string;
  public title?: string;
  public orderValueFrom?: number;
  public dateEarnDiscount?: string[];
  public description?: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly UPDATABLE_PARAMETERS = ['title', 'orderValueFrom', 'dateEarnDiscount', 'description',
    { conditions: ['id', 'orderAmountFrom', 'orderAmountTo', 'discountValue', 'discountType'] },
  ]

  static readonly hooks: Partial<ModelHooks<RankModel>> = { }

  static readonly validations: ModelValidateOptions = { }

  public async updateConditions (conditionAttributes: any[], transaction?: Transaction) {
    if (!conditionAttributes) return;
    conditionAttributes.forEach((attribute: any) => {
      attribute.rankId = this.id;
    });
    const results = await RankConditionModel.bulkCreate(conditionAttributes, {
      updateOnDuplicate: RankConditionModel.UPDATABLE_ON_DUPLICATE_PARAMETERS as (keyof RankConditionInterface)[],
      individualHooks: true,
      transaction,
    });
    await RankConditionModel.destroy({
      where: { rankId: this.id, id: { [Op.notIn]: results.map((condition) => condition.id) } },
      individualHooks: true,
      transaction,
    });
  }

  public getConditions: HasManyGetAssociationsMixin<RankConditionModel>

  static readonly scopes: ModelScopeOptions = {
    withRankCondition () {
      return {
        include: [{
          model: RankConditionModel,
          as: 'conditions',
        }],
      };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(RankEntity, {
      hooks: RankModel.hooks,
      scopes: RankModel.scopes,
      validate: RankModel.validations,
      tableName: 'ranks',
      sequelize,
      paranoid: true,
    });
  }

  public static associate () {
    this.hasMany(RankConditionModel, { as: 'conditions', foreignKey: 'rankId' });
  }
}

export default RankModel;
