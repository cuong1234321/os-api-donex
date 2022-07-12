import { Model, ModelValidateOptions, Sequelize, ValidationErrorItem } from 'sequelize';
import ProductCategoryRefEntity from '@entities/productCategoryRefs';
import ProductCategoryRefInterface from '@interfaces/productCategoryRefs';
import ProductCategoryModel from './productCategories';

class ProductCategoryRefModel extends Model<ProductCategoryRefInterface> implements ProductCategoryRefInterface {
  public id: number;
  public productId: number;
  public productCategoryId: number;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly validations: ModelValidateOptions = {
    async validateProductCategoryId () {
      if (this.productCategoryId) {
        const category = await ProductCategoryModel.findByPk(this.productCategoryId);
        if (!category) {
          throw new ValidationErrorItem('Mã danh mục hoặc bộ sưu tập không hợp lệ.', 'validateProductCategoryId', 'productCategoryId', this.productCategoryId);
        }
      }
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(ProductCategoryRefEntity, {
      tableName: 'product_category_refs',
      validate: ProductCategoryRefModel.validations,
      sequelize,
    });
  }

  public static associate () { }
}

export default ProductCategoryRefModel;
