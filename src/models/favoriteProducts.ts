import FavoriteProductEntity from '@entities/favoriteProducts';
import FavoriteProductInterface from '@interfaces/favoriteProducts';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import ProductModel from './products';

class FavoriteProductModel extends Model<FavoriteProductInterface> implements FavoriteProductInterface {
  public id: number;
  public userId: number;
  public productId: number;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly hooks: Partial<ModelHooks<FavoriteProductModel>> = { }

  static readonly validations: ModelValidateOptions = { }

  static readonly scopes: ModelScopeOptions = {
    byUser (userId) {
      return {
        where: { userId },
      };
    },
    byProduct (productId) {
      return {
        where: { productId },
      };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(FavoriteProductEntity, {
      hooks: FavoriteProductModel.hooks,
      scopes: FavoriteProductModel.scopes,
      validate: FavoriteProductModel.validations,
      tableName: 'favorite_products',
      sequelize,
    });
  }

  public static associate () {
    this.belongsTo(ProductModel, { as: 'product', foreignKey: 'productId' });
  }
}

export default FavoriteProductModel;
