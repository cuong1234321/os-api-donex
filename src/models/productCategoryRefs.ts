import { Model, Sequelize } from 'sequelize';
import ProductCategoryRefEntity from '@entities/productCategoryRefs';
import ProductCategoryRefInterface from '@interfaces/productCategoryRefs';

class ProductCategoryRefModel extends Model<ProductCategoryRefInterface> implements ProductCategoryRefInterface {
  public id: number;
  public productId: number;
  public productCategoryId: number;
  public createdAt?: Date;
  public updatedAt?: Date;

  public static initialize (sequelize: Sequelize) {
    this.init(ProductCategoryRefEntity, {
      tableName: 'product_category_refs',
      sequelize,
    });
  }

  public static associate () { }
}

export default ProductCategoryRefModel;
