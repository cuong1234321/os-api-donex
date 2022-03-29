import SaleCampaignProductEntity from '@entities/saleCampaignProducts';
import SaleCampaignProductInterface from '@interfaces/saleCampaignProducts';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import ProductVariantModel from './productVariants';

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

  static readonly scopes: ModelScopeOptions = { }

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
  }
}

export default SaleCampaignProductModel;
