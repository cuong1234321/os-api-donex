import ProductOptionEntity from '@entities/productOptions';
import ProductOptionInterface from '@interfaces/productOptions';
import { Model, ModelScopeOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import ProductVariantOptionModel from './productVariantOptions';
import ProductVariantModel from './productVariants';

class ProductOptionModel extends Model<ProductOptionInterface> implements ProductOptionInterface {
  public id: number;
  public productId: number;
  public key: string;
  public value: number;
  public thumbnail: string;
  public optionMappingId?: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly TYPE_ENUM = { color: 'color', size: 'size', form: 'form' }

  static readonly UPDATABLE_ON_DUPLICATE_PARAMETERS = ['id', 'name', 'optionMappingId'];

  static readonly hooks: Partial<ModelHooks<ProductOptionModel>> = { }

  static readonly scopes: ModelScopeOptions = {
    byId (id) {
      return {
        where: { id },
      };
    },
    byKey (key) {
      return {
        where: { key },
      };
    },
    byProductId (productId) {
      return {
        where: { productId },
      };
    },
    withValueName () {
      return {
        attributes: {
          include: [
            [
              Sequelize.literal('(SELECT' +
                '(CASE product_options.key ' +
                'WHEN "color" THEN (SELECT m_colors.colorCode from m_colors WHERE m_colors.id = product_options.value) ' +
                'WHEN "size" THEN (SELECT m_sizes.code from m_sizes WHERE m_sizes.id = product_options.value) ' +
                'WHEN "form" THEN (SELECT m_forms.title from m_forms WHERE m_forms.id = product_options.value) ' +
                'END) FROM product_options WHERE product_options.id = ProductOptionModel.id)'),
              'valueName',
            ],
          ],
        },
      };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(ProductOptionEntity, {
      hooks: ProductOptionModel.hooks,
      scopes: ProductOptionModel.scopes,
      tableName: 'product_options',
      sequelize,
      paranoid: true,
    });
  }

  public static associate () {
    this.belongsToMany(ProductVariantModel, { through: ProductVariantOptionModel, as: 'variants', foreignKey: 'optionId' });
  }
}

export default ProductOptionModel;
