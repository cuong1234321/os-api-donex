import ProductEntity from '@entities/products';
import ProductInterface from '@interfaces/products';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class ProductModel extends Model<ProductInterface> implements ProductInterface {
  public id: number;
  public name: string;
  public slug: string;
  public avatar: string;
  public description: string;
  public shortDescription: string;
  public status: string;
  public gender: string;
  public typeProductId: number;
  public sizeGuide: string;
  public isHighlight: boolean;
  public isNew: boolean;
  public inFlashSale: boolean;
  public weight: number;
  public length: number;
  public width: number;
  public height: number;
  public unit: string;
  public minStock: number;
  public maxStock: number;
  public skuCode: string;
  public barCode: string;

  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  static readonly hooks: Partial<ModelHooks<ProductModel>> = {
  }

  static readonly validations: ModelValidateOptions = {
  }

  static readonly scopes: ModelScopeOptions = {
  }

  public static initialize (sequelize: Sequelize) {
    this.init(ProductEntity, {
      hooks: ProductModel.hooks,
      scopes: ProductModel.scopes,
      validate: ProductModel.validations,
      tableName: 'products',
      sequelize,
    });
  }

  public static associate () {
  }
}

export default ProductModel;
