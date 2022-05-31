import { sendError, sendSuccess } from '@libs/response';
import CartItemModel from '@models/cartItems';
import CartModel from '@models/carts';
import { Request, Response } from 'express';
import VoucherModel from '@models/vouchers';
import ProductVariantOptionModel from '@models/productVariantOptions';
import WarehouseModel from '@models/warehouses';
import WarehouseVariantModel from '@models/warehouseVariants';
import SaleCampaignModel from '@models/saleCampaigns';
import SaleCampaignProductDecorator from '@decorators/saleCampaignProducts';
import MWardModel from '@models/mWards';
import Fee from '@repositories/models/fee';
import settings from '@configs/settings';
import VoucherConditionModel from '@models/voucherConditions';
import SystemSettingModel from '@models/systemSetting';
import UserModel from '@models/users';
import RankModel from '@models/ranks';

class CartController {
  public async showCart (req: Request, res: Response) {
    try {
      const systemSetting: any = (await SystemSettingModel.findOrCreate({
        where: { },
        defaults: { id: undefined },
      }))[0];
      const params = req.parameters.permit(CartModel.CREATABLE_PARAMETERS).value();
      const validCartItems = params.cartItems ? params.cartItems.map((record: any) => { return { warehouseId: record.warehouseId, productVariantIds: record.productVariantIds.split(',') }; }) : [];
      const { currentUser } = req;
      const cart = (await CartModel.findOrCreate({
        where: { userId: req.currentUser.id },
        defaults: { id: undefined, userId: req.currentUser.id },
      }))[0];
      let cartItems = await CartItemModel.scope([
        { method: ['byCart', cart.id] },
        'withProductVariant',
      ]).findAll({ order: [['createdAt', 'DESC']] });
      await this.variantOptions(cartItems);
      const saleCampaigns = await this.getSaleCampaigns();
      cartItems = await SaleCampaignProductDecorator.calculatorVariantPrice(cartItems, saleCampaigns);
      const ward = await this.validateAddress(params);
      const { warehouses, cartTotalBill, cartTotalFee, cartTotalTax, warehouseQuantity } = await this.groupByWarehouse(cartItems, ward, validCartItems);
      let cartSubTotal = cartTotalBill + cartTotalFee + cartTotalTax;
      const voucher = await this.validateVoucher(params, currentUser);
      const applicationDiscount = await this.calculatorOrderDiscount(voucher, cartSubTotal);
      let coinDiscount = params.coins ? (systemSetting.coinConversionLevel * params.coins) : 0;
      if (cartSubTotal < coinDiscount) {
        coinDiscount = cartSubTotal;
      }
      cart.setDataValue('coinDiscount', coinDiscount);
      cart.setDataValue('finalAmount', 0);
      cart.setDataValue('voucherDiscount', 0);
      cart.setDataValue('totalDiscount', 0);
      cart.setDataValue('rankDiscount', 0);
      for (const warehouse of warehouses) {
        if ((warehouse.totalBill + warehouse.totalFee + warehouse.totalTax) >= cartSubTotal) {
          cart.setDataValue('coinDiscount', coinDiscount);
          cart.setDataValue('finalAmount', 0);
          warehouse.setDataValue('coinDiscount', coinDiscount);
          warehouse.setDataValue('finalAmount', 0);
        } else {
          const warehouseCoinDiscount = Math.round((warehouse.getDataValue('finalAmount') / cartSubTotal) * coinDiscount);
          warehouse.setDataValue('finalAmount', warehouse.getDataValue('finalAmount') - warehouseCoinDiscount);
          warehouse.setDataValue('coinDiscount', warehouseCoinDiscount);
          warehouse.setDataValue('totalDiscount', warehouse.getDataValue('totalDiscount') + warehouseCoinDiscount);
          cart.setDataValue('finalAmount', cart.getDataValue('finalAmount') + warehouse.getDataValue('finalAmount'));
          cart.setDataValue('totalDiscount', cart.getDataValue('totalDiscount') + warehouse.getDataValue('coinDiscount'));
        }
      }
      cartSubTotal = cart.getDataValue('finalAmount');
      cart.setDataValue('finalAmount', 0);
      for (const warehouse of warehouses) {
        const voucherDiscount = applicationDiscount ? Math.round((warehouse.getDataValue('finalAmount') / cartSubTotal) * applicationDiscount) : 0;
        warehouse.setDataValue('voucherDiscount', voucherDiscount);
        warehouse.setDataValue('finalAmount', warehouse.getDataValue('finalAmount') - voucherDiscount);
        warehouse.setDataValue('totalDiscount', warehouse.getDataValue('totalDiscount') + voucherDiscount);
        cart.setDataValue('finalAmount', cart.getDataValue('finalAmount') + warehouse.getDataValue('finalAmount'));
        cart.setDataValue('voucherDiscount', cart.getDataValue('voucherDiscount') + warehouse.getDataValue('voucherDiscount'));
        cart.setDataValue('totalDiscount', cart.getDataValue('totalDiscount') + warehouse.getDataValue('voucherDiscount'));
      }
      cartSubTotal = cart.getDataValue('finalAmount');
      cart.setDataValue('finalAmount', 0);
      const rankDiscountValue = await this.applyRankDiscount(currentUser, warehouseQuantity, cartSubTotal);
      for (const warehouse of warehouses) {
        const rankDiscount = rankDiscountValue ? Math.round((warehouse.getDataValue('finalAmount') / cartSubTotal) * rankDiscountValue) : 0;
        warehouse.setDataValue('rankDiscount', rankDiscount);
        warehouse.setDataValue('finalAmount', warehouse.getDataValue('finalAmount') - rankDiscount);
        warehouse.setDataValue('totalDiscount', warehouse.getDataValue('totalDiscount') + rankDiscount);
        cart.setDataValue('finalAmount', cart.getDataValue('finalAmount') + warehouse.getDataValue('finalAmount'));
        cart.setDataValue('rankDiscount', cart.getDataValue('rankDiscount') + warehouse.getDataValue('rankDiscount'));
        cart.setDataValue('totalDiscount', cart.getDataValue('totalDiscount') + warehouse.getDataValue('rankDiscount'));
      }
      cart.setDataValue('warehouses', warehouses);
      cart.setDataValue('totalBill', cartTotalBill);
      cart.setDataValue('totalFee', cartTotalFee);
      cart.setDataValue('totalTax', cartTotalTax);
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

  private async groupByWarehouse (cartItems: any, ward: any, validCartItems: any) {
    const warehouses = await WarehouseModel.scope([
      { method: ['byId', [...new Set(cartItems.map((record: any) => record.warehouseId))]] },
      'withAddressInfo',
    ]).findAll();
    let cartTotalBill = 0;
    let cartTotalFee = 0;
    let cartTotalTax = 0;
    let warehouseQuantity = 0;
    for (const warehouse of warehouses) {
      const warehouseCartItems = cartItems.filter((record: any) => record.warehouseId === warehouse.id);
      warehouse.setDataValue('cartItems', warehouseCartItems);
      let totalBill = 0;
      let totalWeight = 0;
      let totalFee = 0;
      for (const warehouseCartItem of warehouseCartItems) {
        const warehouseValid = validCartItems.find((record: any) => record.warehouseId === warehouse.id);
        if (warehouseValid && warehouseValid.productVariantIds.includes(warehouseCartItem.productVariantId.toString())) {
          totalWeight = totalWeight + (warehouseCartItem.variants.getDataValue('productWeight') * warehouseCartItem.quantity);
          totalBill = totalBill + warehouseCartItem.variants.getDataValue('saleCampaignPrice');
          warehouseQuantity = warehouseQuantity + warehouseCartItem.quantity;
        }
      }
      if (ward) {
        const feeParams = {
          serviceTypeId: 2,
          fromDistrictId: parseInt(warehouse.district.ghnDistrictId),
          toDistrictId: parseInt(ward.district.ghnDistrictId),
          height: 10,
          length: 20,
          weight: totalWeight,
          width: 10,
          toWardCode: ward.ghnWardCode,
        };
        const fee = await Fee.calculate(feeParams);
        if (fee.code === 400) { totalFee = 0; } else { totalFee = fee.data.total; }
      }
      const totalTax = totalBill * (settings.defaultTax / 100);
      const finalAmount = totalBill + totalFee + totalTax;
      cartTotalBill = cartTotalBill + totalBill;
      cartTotalFee = cartTotalFee + totalFee;
      cartTotalTax = cartTotalTax + totalTax;
      warehouse.setDataValue('totalBill', totalBill);
      warehouse.setDataValue('totalFee', totalFee);
      warehouse.setDataValue('totalTax', totalTax);
      warehouse.setDataValue('coinDiscount', 0);
      warehouse.setDataValue('voucherDiscount', 0);
      warehouse.setDataValue('rankDiscount', 0);
      warehouse.setDataValue('totalDiscount', 0);
      warehouse.setDataValue('finalAmount', finalAmount);
    }
    return { warehouses, cartTotalBill, cartTotalFee, cartTotalTax, warehouseQuantity };
  }

  private async getSaleCampaigns () {
    const scopes: any = [
      'isAbleToUse',
      'withProductVariant',
      'isApplyToUser',
    ];
    const saleCampaigns = await SaleCampaignModel.scope(scopes).findAll();
    return saleCampaigns;
  }

  private async validateAddress (params: any) {
    if (!params.wardId || !params.districtId || !params.provinceId) return false;
    const ward = await MWardModel.scope([
      { method: ['byId', params.wardId] },
      { method: ['byWardAddress', params.districtId, params.provinceId] },
    ]).findOne();
    if (ward) return ward;
    return false;
  }

  private async validateVoucher (params: any, user: any) {
    if (!params.voucherId) return false;
    const voucher = await VoucherModel.scope([
      { method: ['byRecipient', user.id] },
      { method: ['byId', params.voucherId] },
      { method: ['byVoucherApplication', params.paymentMethod] },
      'isNotUsed',
    ]).findOne();
    if (voucher) return voucher;
    return false;
  }

  private async calculatorOrderDiscount (promoApplication: any, subtotal: number) {
    let applicationDiscount = 0;
    if (!promoApplication || !promoApplication?.application || !promoApplication?.application?.conditions?.length) {
      return applicationDiscount;
    }
    const conditions = promoApplication?.application?.conditions;
    let applicationCondition: any;
    for (const condition of conditions) {
      if (condition.orderValue < subtotal) {
        applicationCondition = condition;
      }
    }
    if (!applicationCondition) {
      return applicationDiscount;
    }
    if (applicationCondition.discountType === VoucherConditionModel.DISCOUNT_TYPE_ENUM.CASH) {
      applicationDiscount = applicationCondition.discountValue;
    } else {
      applicationDiscount = subtotal * (applicationCondition.discountValue / 100);
    };
    return applicationDiscount;
  }

  private async applyRankDiscount (user: any, totalQuantity: number, totalPrice: number) {
    let rankDiscount = 0;
    let rank: any;
    if (user.rank === UserModel.RANK_ENUM.VIP) {
      rank = await RankModel.scope([
        { method: ['byType', UserModel.RANK_ENUM.VIP] },
        { method: ['byCondition', totalQuantity] },
        'byDateEarnDiscount',
      ]).findOne();
      if (!rank) {
        rank = await RankModel.scope([
          { method: ['byCondition', totalQuantity] },
          { method: ['byType', UserModel.RANK_ENUM.BASIC] },
        ]).findOne();
      }
    } else {
      rank = await RankModel.scope([
        { method: ['byCondition', totalQuantity] },
      ]).findOne();
    }
    if (!rank) {
      return rankDiscount;
    }
    rankDiscount = totalPrice * rank.conditions[0].discountValue / 100;
    return rankDiscount;
  }
}

export default new CartController();
