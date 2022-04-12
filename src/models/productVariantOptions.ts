import ProductVariantOptionEntity from '@entities/productVariantOptions';
import ProductVariantOptionInterface from '@interfaces/productVariantOptions';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import ProductOptionModel from './productOptions';

class ProductVariantOptionModel extends Model<ProductVariantOptionInterface> implements ProductVariantOptionInterface {
  public id: number;
  public variantId: number;
  public optionId: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  public valueName?: string;

  static readonly hooks: Partial<ModelHooks<ProductVariantOptionModel>> = { }

  static readonly validations: ModelValidateOptions = { }

  static readonly scopes: ModelScopeOptions = {
    byId (id) {
      return {
        where: { id },
      };
    },
    byVariantId (variantId) {
      return {
        where: { variantId },
      };
    },
    byOptionId (optionId) {
      return {
        where: {
          optionId,
        },
      };
    },
    withProductOption () {
      return {
        include: [{
          model: ProductOptionModel,
          as: 'option',
          where: { key: ProductOptionModel.KEY_ENUM.SIZE },
          attributes: {
            include: [
              [
                Sequelize.literal('(Select code from m_sizes where m_sizes.id = option.value)'),
                'valueName',
              ],
            ],
          },
        }],
      };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(ProductVariantOptionEntity, {
      hooks: ProductVariantOptionModel.hooks,
      scopes: ProductVariantOptionModel.scopes,
      validate: ProductVariantOptionModel.validations,
      tableName: 'product_variant_options',
      sequelize,
      paranoid: true,
    });
  }

  public static associate () {
    this.belongsTo(ProductOptionModel, { as: 'option', foreignKey: 'optionId' });
  }
}

export default ProductVariantOptionModel;
