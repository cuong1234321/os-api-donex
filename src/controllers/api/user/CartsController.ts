import { sendError, sendSuccess } from '@libs/response';
import CartItemModel from '@models/cartItems';
import CartModel from '@models/carts';
import ProductVariantOptionModel from '@models/productVariantOptions';
import WarehouseModel from '@models/warehouses';
import WarehouseVariantModel from '@models/warehouseVariants';
import { Request, Response } from 'express';
import SystemSettingModel from '@models/systemSetting';
import { RequestDiscountInvalid } from '@libs/errors';
import SaleCampaignProductDecorator from '@decorators/saleCampaignProducts';
import SaleCampaignModel from '@models/saleCampaigns';
import CollaboratorModel from '@models/collaborators';
class CartController {
  public async show (req: Request, res: Response) {
    try {
      const totalBill = 0;
      let totalDiscount = 0;
      const totalFee = 0;
      const totalTax = 0;
      const finalAmount = 0;
      const { coins } = req.query;
      const cart = (await CartModel.findOrCreate({
        where: { userId: req.currentUser.id },
        defaults: { id: undefined, userId: req.currentUser.id },
      }))[0];
      const scopes: any = [
        { method: ['byCart', cart.id] },
        'withProductVariant',
      ];
      if (coins) {
        if (req.currentUser.coinReward < parseInt(coins as string)) {
          return sendError(res, 403, RequestDiscountInvalid);
        }
        const systemSetting = (await SystemSettingModel.findOrCreate({
          where: { },
          defaults: { id: undefined },
        }))[0];
        const reduceTotalBillByCoin = parseInt(coins as string) * (systemSetting.coinConversionLevel || 1);
        totalDiscount = totalDiscount + reduceTotalBillByCoin;
      }
      let cartItems = await CartItemModel.scope(scopes).findAll({ order: [['createdAt', 'DESC']] });
      await this.variantOptions(cartItems);
      const saleCampaigns = await this.getSaleCampaigns('USER');
      cartItems = await SaleCampaignProductDecorator.calculatorVariantPrice(cartItems, saleCampaigns);
      const { warehouses, totalVariants } = await this.groupByWarehouse(cartItems);
      cart.setDataValue('warehouses', warehouses);
      cart.setDataValue('totalBill', totalBill);
      cart.setDataValue('totalDiscount', totalDiscount);
      cart.setDataValue('totalFee', totalFee);
      cart.setDataValue('totalTax', totalTax);
      cart.setDataValue('finalAmount', finalAmount);
      cart.setDataValue('totalVariants', totalVariants);
      sendSuccess(res, { cart });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async info (req: Request, res: Response) {
    try {
      const cart = (await CartModel.findOrCreate({
        where: { userId: req.currentUser.id },
        defaults: { id: undefined, userId: req.currentUser.id },
      }))[0];
      const scopes: any = [
        { method: ['byCart', cart.id] },
        'withProductVariant',
      ];
      const cartItems = await CartItemModel.scope(scopes).findAll({ order: [['createdAt', 'DESC']] });
      cart.setDataValue('totalItems', cartItems.length);
      sendSuccess(res, { cart });
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
        where: { cartId: cart.id, productVariantId: req.body.productVariantId, warehouseId: req.body.warehouseId },
        defaults: {
          id: undefined,
          cartId: cart.id,
          productVariantId: req.body.productVariantId,
          quantity: req.body.quantity,
          warehouseId: req.body.warehouseId,
        },
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
      await CartItemModel.destroy({
        where: {
          cartId: cart.id,
          productVariantId: req.params.productVariantId,
          warehouseId: req.params.warehouseId,
        },
      });
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  public async empty (req: Request, res: Response) {
    try {
      const cart = (await CartModel.findOrCreate({
        where: { userId: req.currentUser.id },
        defaults: { id: undefined, userId: req.currentUser.id },
      }))[0];
      await CartItemModel.destroy({ where: { cartId: cart.id } });
      sendSuccess(res, { });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }

  private async variantOptions (cartItems: any) {
    for (const item of cartItems) {
      item.variantOptions = [];
      const variantOptionColors = await ProductVariantOptionModel.scope([
        { method: ['byOptionId', item.getDataValue('variants').getDataValue('optionColorId')] },
      ]).findAll();
      const warehouseVariants = await WarehouseVariantModel.scope([
        { method: ['byProduct', item.getDataValue('variants').getDataValue('productId')] },
        { method: ['byWarehouseId', item.getDataValue('warehouseId')] },
      ]).findAll({ attributes: ['variantId'] });
      const variantOptionColorIds = variantOptionColors.map((record: any) => record.variantId);
      const warehouseVariantIds = [...new Set(warehouseVariants.map((record: any) => record.variantId))];
      const variantOptions = await ProductVariantOptionModel.scope([
        { method: ['byVariantId', warehouseVariantIds.filter((obj) => variantOptionColorIds.indexOf(obj) !== -1)] },
        'withProductOption',
      ]).findAll({ attributes: ['variantId', 'optionId'] });
      item.setDataValue('variantOptions', variantOptions);
    }
  }

  private async groupByWarehouse (cartItems: any) {
    let totalVariants = 0;
    const warehouses = await WarehouseModel.scope([
      { method: ['byId', [...new Set(cartItems.map((record: any) => record.warehouseId))]] },
      'withWarehouseVariant',
    ]).findAll();
    for (const warehouse of warehouses) {
      const warehouseCartItems = cartItems.filter((record: any) => record.warehouseId === warehouse.id);
      warehouse.setDataValue('cartItems', warehouseCartItems);
      let totalBill = 0;
      for (const warehouseCartItem of warehouseCartItems) {
        totalBill = totalBill + warehouseCartItem.variants.getDataValue('saleCampaignPrice');
        totalVariants = totalVariants + warehouseCartItem.quantity;
      }
      warehouse.setDataValue('totalBill', totalBill);
      warehouse.setDataValue('totalFee', 0);
      warehouse.setDataValue('totalDiscount', 0);
      warehouse.setDataValue('finalAmount', totalBill);
    }
    return { warehouses, totalVariants };
  }

  private async getSaleCampaigns (userType: string) {
    const scopes: any = [
      'isAbleToUse',
      'withProductVariant',
    ];
    switch (userType) {
      case CollaboratorModel.TYPE_ENUM.DISTRIBUTOR:
        scopes.push('isApplyToDistributor');
        break;
      case CollaboratorModel.TYPE_ENUM.AGENCY:
        scopes.push('isApplyToAgency');
        break;
      case CollaboratorModel.TYPE_ENUM.COLLABORATOR:
        scopes.push('isApplyToCollaborator');
        break;
      case 'USER':
        scopes.push('isApplyToUser');
        break;
      default:
        break;
    }
    const saleCampaigns = await SaleCampaignModel.scope(scopes).findAll();
    return saleCampaigns;
  }
}

export default new CartController();
