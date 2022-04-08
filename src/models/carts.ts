import CartEntity from '@entities/carts';
import CartInterface from '@interfaces/carts';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import CartItemModel from './cartItems';

class CartModel extends Model<CartInterface> implements CartInterface {
  public id: number;
  public userId: number;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly hooks: Partial<ModelHooks<CartModel>> = {
  }

  static readonly validations: ModelValidateOptions = { }

  static readonly scopes: ModelScopeOptions = {
    byUser (userId) {
      return { where: { userId } };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(CartEntity, {
      hooks: CartModel.hooks,
      scopes: CartModel.scopes,
      validate: CartModel.validations,
      tableName: 'carts',
      sequelize,
    });
  }

  public static associate () {
    this.hasOne(CartItemModel, { as: 'cartItem', foreignKey: 'cartId' });
  }
}

export default CartModel;
