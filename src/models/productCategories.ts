import ProductCategoryEntity from '@entities/productCategories';
import ProductCategoryInterface from '@interfaces/productCategories';
import { BelongsToManyGetAssociationsMixin, HasManyGetAssociationsMixin, Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize, ValidationErrorItem } from 'sequelize';
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
  public misaId?: string;
  public index: number;
  public sizeType: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly TYPE_ENUM = { NONE: 'none', COLLECTION: 'collection', GENDER: 'gender', PRODUCT_TYPE: 'productType' };

  static readonly CREATABLE_PARAMETERS = ['parentId', 'name', 'type', 'index', 'sizeType'];
  static readonly UPDATABLE_PARAMETERS = ['parentId', 'name', 'thumbnail', 'index', 'sizeType'];

  static readonly hooks: Partial<ModelHooks<ProductCategoryModel>> = {
    async afterDestroy (record) {
      await record.destroyCateChild();
    },
    async beforeCreate (record) {
      if (!record.index) {
        const lastIndexRecord = await ProductCategoryModel.scope({ method: ['bySortOrder', 'index', 'DESC'] }).findOne();
        record.index = lastIndexRecord ? lastIndexRecord.index + 1 : 1;
      }
    },
  }

  static readonly validations: ModelValidateOptions = {
    async validateParentId () {
      if (this.parentId && this.id === this.parentId) {
        throw new ValidationErrorItem('Giá trị id cha không được trùng với id con.', 'validateParentId', 'parentId');
      }
    },
  }

  public getChildren: HasManyGetAssociationsMixin<ProductCategoryModel>;

  static readonly scopes: ModelScopeOptions = {
    byType (type) {
      return {
        where: { type },
      };
    },
    notChildren () {
      return {
        where: {
          parentId: null,
        },
      };
    },
    byId (id) {
      return {
        where: { id },
      };
    },
    newest () {
      return {
        order: [['createdAt', 'DESC']],
      };
    },
    bySortOrder (sortBy, sortOrder) {
      return {
        order: [[sortBy, sortOrder]],
      };
    },
  }

  public static async getHierarchy (type: any) {
    const scopes: any = [{ method: ['bySortOrder', 'index', 'DESC'] }];
    if (type) scopes.push({ method: ['byType', type] });
    const productCategories = await ProductCategoryModel.scope(scopes).findAll();
    const parentNodes = productCategories.filter(productCategory => productCategory.parentId === null);
    const result = parentNodes.map(node => node.levelDistribution(productCategories));
    return result;
  }

  public static async getHierarchyByParentNodes (productCategoryParents: any, productCategories: any) {
    const result = productCategoryParents.map((node: any) => node.levelDistribution(productCategories));
    return result;
  }

  private levelDistribution (productCategories: ProductCategoryModel[]) {
    const directChildren = productCategories.filter(productCategory => productCategory.parentId === this.id);
    this.setDataValue('children', directChildren.map(child => child.levelDistribution(productCategories)));
    return this;
  }

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

  public getProducts: BelongsToManyGetAssociationsMixin<ProductModel>

  public async destroyCateChild () {
    await ProductCategoryModel.destroy({ where: { parentId: this.id }, individualHooks: true });
    if (this.type === ProductCategoryModel.TYPE_ENUM.NONE) {
      const products = await this.getProducts();
      const productIds = products.map((result: any) => result.id);
      await ProductCategoryModel.destroy({ where: { id: { [Op.in]: productIds } }, individualHooks: true });
    }
  }

  public static initialize (sequelize: Sequelize) {
    this.init(ProductCategoryEntity, {
      hooks: ProductCategoryModel.hooks,
      scopes: ProductCategoryModel.scopes,
      validate: ProductCategoryModel.validations,
      tableName: 'product_categories',
      sequelize,
      paranoid: true,
    });
  }

  public static associate () {
    this.hasMany(ProductCategoryRefModel, { as: 'categoryRefs', foreignKey: 'productCategoryId', onDelete: 'CASCADE', hooks: true });
    this.belongsToMany(ProductModel, { through: ProductCategoryRefModel, as: 'products', foreignKey: 'productCategoryId' });
  }
}

export default ProductCategoryModel;
