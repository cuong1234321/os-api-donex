import ProductVariantEntity from '@entities/productVariants';
import ProductVariantInterface from '@interfaces/productVariants';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import ProductOptionModel from './productOptions';
import ProductVariantOptionModel from './productVariantOptions';

class ProductVariantModel extends Model<ProductVariantInterface> implements ProductVariantInterface {
  public id: number;
  public productId: number;
  public name: string;
  public slug: string;
  public skuCode: string;
  public barCode: string;
  public buyPrice: string;
  public sellPrice: string;
  public stock: number;
  optionMappingIds?: number[]

  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly hooks: Partial<ModelHooks<ProductVariantModel>> = {
    async afterDestroy (record) {
      await record.deleteVariantOption();
    },
  }

  static readonly validations: ModelValidateOptions = {
  }

  static readonly scopes: ModelScopeOptions = {
  }

  public async deleteVariantOption () {
    await ProductVariantOptionModel.destroy({ where: { variantId: this.id }, individualHooks: true });
  }

  public static initialize (sequelize: Sequelize) {
    this.init(ProductVariantEntity, {
      hooks: ProductVariantModel.hooks,
      scopes: ProductVariantModel.scopes,
      validate: ProductVariantModel.validations,
      tableName: 'product_variants',
      sequelize,
      paranoid: true,
    });
  }

  public static associate () {
    this.belongsToMany(ProductOptionModel, { through: ProductVariantOptionModel, as: 'options', foreignKey: 'variantId' });
    this.hasMany(ProductVariantOptionModel, { as: 'variantOptions', foreignKey: 'variantId' });
  }
}

export default ProductVariantModel;
