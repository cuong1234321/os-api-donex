import ProductOptionEntity from '@entities/productOptions';
import ProductOptionInterface from '@interfaces/productOptions';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import MColorModel from './mColors';
import MFormModel from './mForms';
import MSizeModel from './mSizes';
import ProductVariantOptionModel from './productVariantOptions';
import ProductVariantModel from './productVariants';

class ProductOptionModel extends Model<ProductOptionInterface> implements ProductOptionInterface {
  public id: number;
  public productId: number;
  public key: string;
  public value: number;
  public thumbnail: string[];
  public optionMappingId?: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly KEY_ENUM = { COLOR: 'color', SIZE: 'size', FORM: 'form', SUPPORTING_COLOR: 'supportingColor' }

  static readonly UPDATABLE_ON_DUPLICATE_PARAMETERS = ['id', 'name', 'optionMappingId', 'thumbnail'];

  static readonly hooks: Partial<ModelHooks<ProductOptionModel>> = { }

  static readonly validations: ModelValidateOptions = {
    async validateKeyValue () {
      if (this.key === ProductOptionModel.KEY_ENUM.COLOR || this.key === ProductOptionModel.KEY_ENUM.SUPPORTING_COLOR) {
        const color = await MColorModel.findByPk(this.value);
        if (!color) throw new ValidationErrorItem('Mã màu không hợp lệ', 'validateKeyValue', 'value', this.value);
      }
      if (this.key === ProductOptionModel.KEY_ENUM.SIZE) {
        const size = await MSizeModel.findByPk(this.value);
        if (!size) throw new ValidationErrorItem('Mã kích cỡ không hợp lệ', 'validateKeyValue', 'value', this.value);
      }
      if (this.key === ProductOptionModel.KEY_ENUM.FORM) {
        const form = await MFormModel.findByPk(this.value);
        if (!form) throw new ValidationErrorItem('Mã form không hợp lệ', 'validateKeyValue', 'value', this.value);
      }
    },
  }

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
                'WHEN "supportingColor" THEN (SELECT m_colors.colorCode from m_colors WHERE m_colors.id = product_options.value) ' +
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
      validate: ProductOptionModel.validations,
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
