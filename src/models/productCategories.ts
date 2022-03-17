import ProductCategoryEntity from '@entities/productCategories';
import ProductCategoryInterface from '@interfaces/productCategories';
import { HasManyGetAssociationsMixin, Model, ModelScopeOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import ProductCategoryRefModel from './productCategoryRefs';
import ProductModel from './products';

class ProductCategoryModel extends Model<ProductCategoryInterface> implements ProductCategoryInterface {
  public id: number;
  public parentId: number;
  public name: string;
  public slug: string;
  public thumbnail: string;
  public type: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly TYPE_ENUM = { NONE: 'none', COLLECTION: 'collection', GENDER: 'gender', PRODUCT_TYPE: 'productType' };

  static readonly CREATABLE_PARAMETERS = ['parentId', 'name', 'thumbnail'];
  static readonly UPDATABLE_PARAMETERS = ['parentId', 'name', 'thumbnail'];

  static readonly hooks: Partial<ModelHooks<ProductCategoryModel>> = { }

  public getChildren: HasManyGetAssociationsMixin<ProductCategoryModel>;

  static readonly scopes: ModelScopeOptions = { }

  public static async getCategoryIdsByParentId (categoryIds: string[]) {
    const categories = await ProductCategoryModel.findAll();
    const rootCategories = categories.filter((category) => categoryIds.includes(`${category.id}`));
    const result: any = rootCategories.map((category) => category.id);
    rootCategories.forEach((child: ProductCategoryModel) => {
      result.push(ProductCategoryModel.getChildCategoryIdsByParentId(categories, child));
    });
    return result.flat(Infinity);
  }

  private static getChildCategoryIdsByParentId (categories: ProductCategoryModel[], parentCategory: ProductCategoryModel) {
    const directChildren = categories.filter((category) => category.parentId === parentCategory.id);
    const result: any = directChildren.map((category) => category.id);
    directChildren.forEach((child: ProductCategoryModel) => {
      result.push(ProductCategoryModel.getChildCategoryIdsByParentId(categories, child));
    });
    return result;
  }

  public static initialize (sequelize: Sequelize) {
    this.init(ProductCategoryEntity, {
      hooks: ProductCategoryModel.hooks,
      scopes: ProductCategoryModel.scopes,
      tableName: 'product_categories',
      sequelize,
    });
  }

  public static associate () {
    this.hasMany(ProductCategoryRefModel, { as: 'categoryRefs', foreignKey: 'productCategoryId', onDelete: 'CASCADE', hooks: true });
    this.belongsToMany(ProductModel, { through: ProductCategoryRefModel, as: 'products', foreignKey: 'productCategoryId' });
  }
}

export default ProductCategoryModel;
