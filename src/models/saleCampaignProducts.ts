import SaleCampaignProductEntity from '@entities/saleCampaignProducts';
import SaleCampaignProductInterface from '@interfaces/saleCampaignProducts';
import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import ProductVariantModel from './productVariants';
import SaleCampaignModel from './saleCampaigns';

class SaleCampaignProductModel extends Model<SaleCampaignProductInterface> implements SaleCampaignProductInterface {
  public id: number;
  public saleCampaignId: number;
  public productVariantId: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly UPDATABLE_ON_DUPLICATE_PARAMETERS = ['id', 'productVariantId'];

  static readonly hooks: Partial<ModelHooks<SaleCampaignProductModel>> = { }

  static readonly validations: ModelValidateOptions = { }

  static readonly scopes: ModelScopeOptions = {
    withSaleCampaignActiveSameTime (appliedAt, appliedTo) {
      return {
        include: [{
          model: SaleCampaignModel,
          as: 'saleCampaign',
          required: true,
          where: {
            [Op.or]: [{
              [Op.and]: [
                { appliedAt: { [Op.gte]: appliedAt } },
                { appliedTo: { [Op.lte]: appliedTo } },
              ],
              [Op.and]: [
                { appliedAt: { [Op.lte]: appliedAt } },
                { appliedTo: { [Op.gte]: appliedTo } },
              ],
              [Op.and]: [
                { appliedAt: { [Op.gte]: appliedAt } },
                { appliedAt: { [Op.lte]: appliedTo } },
              ],
              [Op.and]: [
                { appliedTo: { [Op.gte]: appliedAt } },
                { appliedTo: { [Op.lte]: appliedTo } },
              ],
            },
            ],
          },
        }],
      };
    },
    withSaleCampaignDistributor () {
      return {
        include: [
          {
            model: SaleCampaignModel,
            as: 'saleCampaign',
            required: true,
            where: {
              isApplyToDistributor: true,
            },
          },
        ],
      };
    },
    withSaleCampaignAgency () {
      return {
        include: [
          {
            model: SaleCampaignModel,
            as: 'saleCampaign',
            required: true,
            where: {
              isApplyToAgency: true,
            },
          },
        ],
      };
    },
    withSaleCampaignCollaborator () {
      return {
        include: [
          {
            model: SaleCampaignModel,
            as: 'saleCampaign',
            required: true,
            where: {
              isApplyToCollaborator: true,
            },
          },
        ],
      };
    },
    withSaleCampaignUser () {
      return {
        include: [
          {
            model: SaleCampaignModel,
            as: 'saleCampaign',
            required: true,
            where: {
              isApplyToUser: true,
            },
          },
        ],
      };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(SaleCampaignProductEntity, {
      hooks: SaleCampaignProductModel.hooks,
      scopes: SaleCampaignProductModel.scopes,
      validate: SaleCampaignProductModel.validations,
      tableName: 'sale_campaign_products',
      sequelize,
      paranoid: true,
    });
  }

  public static associate () {
    this.belongsTo(ProductVariantModel, { as: 'variant', foreignKey: 'productVariantId' });
    this.belongsTo(SaleCampaignModel, { as: 'saleCampaign', foreignKey: 'saleCampaignId' });
  }
}

export default SaleCampaignProductModel;
