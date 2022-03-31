import SaleCampaignEntity from '@entities/saleCampaigns';
import SaleCampaignProductInterface from '@interfaces/saleCampaignProducts';
import SaleCampaignInterface from '@interfaces/saleCampaigns';
import dayjs from 'dayjs';
import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize, Transaction, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import ProductCategoryModel from './productCategories';
import ProductModel from './products';
import ProductVariantModel from './productVariants';
import SaleCampaignProductModel from './saleCampaignProducts';

class SaleCampaignModel extends Model<SaleCampaignInterface> implements SaleCampaignInterface {
  public id: number;
  public title: string;
  public description: string;
  public applicationTarget: string;
  public calculatePriceType: string;
  public value: number;
  public isActive: boolean;
  public isApplyToDistributor: boolean;
  public isApplyToAgency: boolean;
  public isApplyToCollaborator: boolean;
  public isApplyToUser: boolean;
  public productCategoryId: number;
  public appliedAt: Date;
  public appliedTo: Date;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  public static readonly CREATABLE_PARAMETERS = ['title', 'description', 'applicationTarget', 'calculatePriceType', 'value', 'isActive', 'productCategoryId',
    'isApplyToDistributor', 'isApplyToAgency', 'isApplyToCollaborator', 'isApplyToUser', 'appliedAt', 'appliedTo',
    {
      productVariants: [
        'productVariantId',
      ],
    }]

  public static readonly UPDATABLE_PARAMETERS = ['title', 'description', 'calculatePriceType', 'value', 'isActive',
    'isApplyToDistributor', 'isApplyToAgency', 'isApplyToCollaborator', 'isApplyToUser', 'appliedAt', 'appliedTo',
    {
      productVariants: [
        'id', 'productVariantId',
      ],
    }]

  public static readonly APPLICATION_TARGET_ENUM = { ALL_PRODUCT: 'allProduct', PRODUCT_CATEGORY: 'productCategory', SINGLE_PRODUCT: 'singleProduct' }
  public static readonly CALCULATE_PRICE_TYPE = {
    REDUCE_BY_AMOUNT: 'reduceByAmount',
    REDUCE_BY_PERCENT: 'reduceByPercent',
    INCREASE_BY_AMOUNT: 'increaseByAmount',
    INCREASE_BY_PERCENT: 'increaseByPercent',
  }

  public static readonly STATUS_ENUM = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    END: 'end',
  }

  static readonly hooks: Partial<ModelHooks<SaleCampaignModel>> = {
    beforeCreate (record: any) {
      if (this.applicationTarget !== SaleCampaignModel.APPLICATION_TARGET_ENUM.PRODUCT_CATEGORY) {
        delete this.productCategoryId;
      }
    },
    async afterDestroy (record: any) {
      await record.destroySaleCampaignProduct();
    },
  }

  static readonly validations: ModelValidateOptions = {
    async validateProductCategory () {
      if (this.productCategoryId && this.applicationTarget === SaleCampaignModel.APPLICATION_TARGET_ENUM.PRODUCT_CATEGORY) {
        const productCategory = await ProductCategoryModel.findByPk(this.productCategoryId);
        if (!productCategory) {
          throw new ValidationErrorItem('Danh mục sản phẩm không hợp lệ', 'validateProductCategory', 'productCategoryId', this.productCategoryId);
        }
      }
    },
    validateValue () {
      if (this.value < 0 || (this.value > 100 &&
         [SaleCampaignModel.CALCULATE_PRICE_TYPE.INCREASE_BY_PERCENT, SaleCampaignModel.CALCULATE_PRICE_TYPE.REDUCE_BY_PERCENT]
           .includes(this.calculatePriceType))) {
        throw new ValidationErrorItem('Mức tính giá không hợp lệ', 'validateValue', 'value', this.value);
      }
    },
  }

  public async destroySaleCampaignProduct () {
    await SaleCampaignProductModel.destroy({ where: { saleCampaignId: this.id }, individualHooks: true });
  }

  public async updateSaleCampaignVariant (saleCampaignProducts: any[], transaction?: Transaction) {
    if (!saleCampaignProducts) return;
    saleCampaignProducts.forEach((record: any) => {
      record.saleCampaignId = this.id;
    });
    const results = await SaleCampaignProductModel.bulkCreate(saleCampaignProducts, {
      updateOnDuplicate: SaleCampaignProductModel.UPDATABLE_ON_DUPLICATE_PARAMETERS as (keyof SaleCampaignProductInterface)[],
      individualHooks: true,
      transaction,
    });
    await SaleCampaignProductModel.destroy({
      where: { saleCampaignId: this.id, id: { [Op.notIn]: results.map((record) => record.id) } },
      individualHooks: true,
      transaction,
    });
  }

  public async reloadWithDetail () {
    await this.reload({
      include: [{
        model: SaleCampaignProductModel,
        as: 'productVariants',
        include: [
          {
            model: ProductVariantModel,
            as: 'variant',
            include: [
              {
                model: ProductModel,
                as: 'product',
              },
            ],
          },
        ],
      }],
    });
  }

  static readonly scopes: ModelScopeOptions = {
    byId (id) {
      return {
        where: { id },
      };
    },
    isActive () {
      return {
        where: { isActive: true },
      };
    },
    isNotActive () {
      return {
        where: { isActive: false },
      };
    },
    bySortOrder (sortBy, sortOrder) {
      return {
        order: [[Sequelize.literal(sortBy), sortOrder]],
      };
    },
    byFreeWord (freeWord) {
      return {
        where: {
          title: { [Op.like]: `%${freeWord || ''}%` },
        },
      };
    },
    withVariant () {
      return {
        include: [{
          model: SaleCampaignProductModel,
          as: 'productVariants',
          include: [
            {
              model: ProductVariantModel,
              as: 'variant',
              include: [
                {
                  model: ProductModel,
                  as: 'product',
                },
              ],
            },
          ],
        }],
      };
    },
    byDate (from, to) {
      if (!from && !to) return { where: {} };
      const createdAtCondition: any = {};
      if (from) Object.assign(createdAtCondition, { [Op.gt]: dayjs(from as string).startOf('day').format() });
      if (to) Object.assign(createdAtCondition, { [Op.lte]: dayjs(to as string).endOf('day').format() });
      return {
        where: { createdAt: createdAtCondition },
      };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(SaleCampaignEntity, {
      hooks: SaleCampaignModel.hooks,
      scopes: SaleCampaignModel.scopes,
      validate: SaleCampaignModel.validations,
      tableName: 'sale_campaigns',
      sequelize,
      paranoid: true,
    });
  }

  public static associate () {
    this.hasMany(SaleCampaignProductModel, { as: 'productVariants', foreignKey: 'saleCampaignId' });
  }
}

export default SaleCampaignModel;