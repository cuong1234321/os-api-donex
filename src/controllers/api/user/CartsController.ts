import { sendError, sendSuccess } from '@libs/response';
import CartItemModel from '@models/cartItems';
import CartModel from '@models/carts';
import { Request, Response } from 'express';

class CartController {
  public async show (req: Request, res: Response) {
    try {
      const cart = (await CartModel.findOrCreate({
        where: { userId: req.currentUser.id },
        defaults: { id: undefined, userId: req.currentUser.id },
      }))[0];
      const cartItems = await CartItemModel.scope([
        { method: ['byCart', cart.id] },
        'withProductVariant',
      ]).findAll({ order: [['createdAt', 'DESC']] });
      sendSuccess(res, { cartItems });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async create (req: Request, res: Response) {
    try {
      const cart = (await CartModel.findOrCreate({
        where: { userId: req.currentUser.id },
        defaults: { id: undefined, userId: req.currentUser.id },
      }))[0];
      const cartItem = (await CartItemModel.findOrCreate({
        where: { cartId: cart.id, productVariantId: req.body.productVariantId },
        defaults: { id: undefined, cartId: cart.id, productVariantId: req.body.productVariantId, quantity: 0, warehouseId: undefined },
      }))[0];
      await cartItem.update({ quantity: cartItem.quantity + req.body.quantity });
      sendSuccess(res, { cartItem });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const cart = (await CartModel.findOrCreate({
        where: { userId: req.currentUser.id },
        defaults: { id: undefined, userId: req.currentUser.id },
      }))[0];
      const cartItem = (await CartItemModel.findOrCreate({
        where: { cartId: cart.id, productVariantId: req.body.productVariantId, warehouseId: req.body.productVariantId },
        defaults: { id: undefined, cartId: cart.id, productVariantId: req.body.productVariantId, quantity: 0, warehouseId: undefined },
      }))[0];
      await cartItem.update({ quantity: req.body.quantity, warehouseId: req.body.warehouseId });
      sendSuccess(res, { cartItem });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async delete (req: Request, res: Response) {
    try {
      const cart = (await CartModel.findOrCreate({
        where: { userId: req.currentUser.id },
        defaults: { id: undefined, userId: req.currentUser.id },
      }))[0];
      await CartItemModel.destroy({ where: { cartId: cart.id, productVariantId: req.params.productVariantId } });
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new CartController();
