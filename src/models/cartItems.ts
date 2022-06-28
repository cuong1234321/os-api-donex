import CartItemEntity from '@entities/cartItems';
import CartItemInterface from '@interfaces/cartItems';
import { BelongsToManyGetAssociationsMixin, Model, ModelScopeOptions, ModelValidateOptions, Sequelize, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';
import CartModel from './carts';
import ProductOptionModel from './productOptions';
import ProductModel from './products';
import ProductVariantModel from './productVariants';
import WarehouseModel from './warehouses';
import WarehouseVariantModel from './warehouseVariants';

class CartItemModel extends Model<CartItemInterface> implements CartItemInterface {
  public id: number;
  public cartId: number;
  public productVariantId: number;
  public quantity: number;
  public warehouseId: number;
  public createdAt?: Date;
  public updatedAt?: Date;

  public variants?: ProductVariantModel;
  public variantOptions?: any[];

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
      const warehouseVariant = await WarehouseVariantModel.scope([
        'withWarehouse',
        { method: ['byEnoughQuantityVariant', this.quantity, this.productVariantId, this.warehouseId] },
      ]).findOne();
      if (!warehouseVariant) {
        throw new ValidationErrorItem('Kho hàng không hợp lệ.', 'validWarehouse', 'warehouseId', this.warehouseId);
      }
    },
  }

  public getProduct: BelongsToManyGetAssociationsMixin<ProductModel>

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
            as: 'variants',
            attributes: {
              exclude: ['createdAt', 'updatedAt'],
              include: [
                [
                  Sequelize.literal('(SELECT name FROM products WHERE products.id = `variants`.productId)'),
                  'productName',
                ],
                [
                  Sequelize.literal('(SELECT weight FROM products WHERE products.id = `variants`.productId)'),
                  'productWeight',
                ],
                [
                  Sequelize.literal('(SELECT thumbnail FROM product_options WHERE product_options.thumbnail is not Null and product_options.id IN ' +
                   ' (SELECT optionId from product_variant_options WHERE product_variant_options.variantId = CartItemModel.productVariantId) limit 0,1 )'),
                  'thumbnail',
                ],
                [
                  Sequelize.literal('(SELECT id FROM product_options WHERE `key` = ' + ` "${ProductOptionModel.KEY_ENUM.COLOR}" AND id IN ` +
                   ' (SELECT optionId FROM product_variant_options WHERE product_variant_options.variantId = 99))'),
                  'optionColorId',
                ],
                [
                  Sequelize.literal('(SELECT id FROM product_options WHERE `key` = ' + ` "${ProductOptionModel.KEY_ENUM.SIZE}" AND id IN ` +
                   ' (SELECT optionId FROM product_variant_options WHERE product_variant_options.variantId = 99))'),
                  'optionSizeId',
                ],
                [
                  Sequelize.literal('(SELECT source FROM product_media WHERE productId = variants.productId LIMIT 1)'),
                  'productThumbnail',
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
    this.belongsTo(ProductVariantModel, { as: 'variants', foreignKey: 'productVariantId' });
    this.belongsTo(WarehouseModel, { as: 'warehouse', foreignKey: 'warehouseId' });
    this.belongsTo(CartModel, { as: 'cart', foreignKey: 'cartId' });
  }
}

export default CartItemModel;
