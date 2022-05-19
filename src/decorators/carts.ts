import SystemSettingModel from '@models/systemSetting';
import VoucherConditionModel from '@models/voucherConditions';

class CartDecorator {
  public static async formatCart (warehouses: any, promoApplication: any, coins: number) {
    const systemSetting: any = (await SystemSettingModel.findOrCreate({
      where: { },
      defaults: { id: undefined },
    }))[0];
    let cartSubTotal = 0;
    let subTotal = 0;
    let total = 0;
    let coinDiscount = 0;
    if (coins) {
      coinDiscount = coins ? (systemSetting.coinConversionLevel * coins) : 0;
    }
    for (const warehouse of warehouses) {
      for (const cartItem of warehouse.getDataValue('cartItems')) {
        cartItem.setDataValue('length', 0);
        cartItem.setDataValue('width', 0);
        cartItem.setDataValue('height', 0);
        cartItem.setDataValue('weight', cartItem.getDataValue('variants').getDataValue('productWeight') * cartItem.getDataValue('quantity'));
        cartItem.setDataValue('saleCampaignPrice', cartItem.getDataValue('variants').getDataValue('saleCampaignPrice') || 0);
        cartItem.setDataValue('subTotal', cartItem.getDataValue('variants').getDataValue('saleCampaignPrice') * cartItem.getDataValue('quantity'));
        cartItem.setDataValue('voucherDiscount', 0);
        cartSubTotal = cartSubTotal + cartItem.getDataValue('subTotal');
        total = total + cartItem.get('quantity');
      }
    }
    const applicationDiscount: number = await this.calculatorOrderDiscount(promoApplication, cartSubTotal);
    for (const warehouse of warehouses) {
      for (const cartItem of warehouse.getDataValue('cartItems')) {
        if ((cartItem.getDataValue('subTotal') / cartSubTotal) >= 1 || (!cartItem.getDataValue('subTotal') && !cartSubTotal)) {
          if (cartItem.getDataValue('subTotal') < coinDiscount) {
            coins = Math.round(cartItem.getDataValue('subTotal') / systemSetting.coinConversionLevel);
            cartItem.setDataValue('subTotal', 0);
          } else {
            cartItem.setDataValue('subTotal', cartItem.getDataValue('subTotal') ? cartItem.getDataValue('subTotal') - coinDiscount : 0);
          }
        } else {
          cartItem.setDataValue('subTotal', cartItem.getDataValue('subTotal') - Math.round(coinDiscount ? ((cartItem.getDataValue('subTotal') / cartSubTotal) * coinDiscount) : cartItem.getDataValue('subTotal')));
        }
        cartItem.voucherDiscount = applicationDiscount ? ((cartItem.getDataValue('subTotal') / cartSubTotal) * applicationDiscount) : 0;
        cartItem.setDataValue('subTotal', Math.round(cartItem.getDataValue('subTotal') - cartItem.voucherDiscount));
        subTotal = subTotal + cartItem.getDataValue('subTotal');
      }
    }
    const cart = {
      warehouses,
      applicationDiscount,
      subTotal,
      total,
      cartSubTotal,
      coinDiscount: systemSetting.coinConversionLevel * coins,
    };
    return cart;
  }

  private static async calculatorOrderDiscount (promoApplication: any, subtotal: number) {
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
}

export default CartDecorator;
