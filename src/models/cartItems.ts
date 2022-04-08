import CartItemEntity from '@entities/cartItems';
import CartItemInterface from '@interfaces/cartItems';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import CartModel from './carts';
import ProductVariantModel from './productVariants';
import WarehouseModel from './warehouses';
import WarehouseVariantModel from './warehouseVariants';

class CartItemModel extends Model<CartItemInterface> implements CartItemInterface {
  public id: number;
  public cartId: number;
  public productVariantId: number;
  public quantity: number;
  public warehouseVariantId: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public productVariant?: ProductVariantModel;

  static readonly hooks: Partial<ModelHooks<CartItemModel>> = {
    async afterUpdate (record) {
      await record.removeItemFromCart();
    },
  }

  static readonly validations: ModelValidateOptions = {
    async validSku () {
      const productVariant = await ProductVariantModel.findByPk(this.productVariantId);
      if (!productVariant) {
        throw new ValidationErrorItem('Sản phẩm không hợp lệ.', 'validSku', 'productVariantId', this.productVariantId);
      }
    },
    async validWarehouse () {
      const warehouse = await WarehouseVariantModel.scope([
        'withWarehouseVariant',
      ]).findOne();
      if (!warehouse) {
        throw new ValidationErrorItem('Kho hàng không hợp lệ.', 'validWarehouse', 'warehouseId', this.warehouseId);
      }
    },
  }

  static readonly scopes: ModelScopeOptions = {
    byId (id) {
      return { where: { id } };
    },
    byCart (cartId) {
      return { where: { cartId } };
    },
    withProductVariant () {
      return {
        include: [
          {
            model: ProductVariantModel,
            as: 'productVariant',
            attributes: {
              exclude: ['createdAt', 'updatedAt'],
              include: [
                [
                  Sequelize.literal('(SELECT name FROM products WHERE products.id = `productVariant`.productId)'),
                  'productName',
                ],
                [
                  Sequelize.literal('(SELECT weight FROM products WHERE products.id = `productVariant`.productId)'),
                  'productWeight',
                ],
              ],
            },
          },
        ],
      };
    },
    withWarehouseVariant () {
      return {
        include: [{
          model: WarehouseVariantModel,
          as: 'warehouseVariant',
          required: true,
          include: [
            {
              model: WarehouseModel,
              as: 'warehouse',
            },
          ],
        }],
      };
    },
  }

  private async removeItemFromCart () {
    if (this.quantity > 0 || this.isNewRecord) return;
    await CartItemModel.destroy({ where: { id: this.id }, hooks: false });
  }

  public static initialize (sequelize: Sequelize) {
    this.init(CartItemEntity, {
      hooks: CartItemModel.hooks,
      scopes: CartItemModel.scopes,
      validate: CartItemModel.validations,
      tableName: 'cart_items',
      sequelize,
    });
  }

  public static associate () {
    this.belongsTo(ProductVariantModel, { as: 'productVariant', foreignKey: 'productVariantId' });
    this.belongsTo(WarehouseVariantModel, { as: 'warehouseVariant', foreignKey: 'warehouseVariantId' });
    this.belongsTo(CartModel, { as: 'cart', foreignKey: 'cartId' });
  }
}

export default CartItemModel;
