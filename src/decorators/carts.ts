import RankModel from '@models/ranks';
import SystemSettingModel from '@models/systemSetting';
import UserModel from '@models/users';
import VoucherConditionModel from '@models/voucherConditions';
import dayjs from 'dayjs';

class CartDecorator {
  public static async formatCart (userId: any, warehouses: any, promoApplication: any, coins: number) {
    const systemSetting: any = (await SystemSettingModel.findOrCreate({
      where: { },
      defaults: { id: undefined },
    }))[0];
    let cartSubTotal = 0;
    let subTotal = 0;
    let total = 0;
    let coinDiscount = 0;
    let totalPrice = 0;
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
        totalPrice = totalPrice + cartItem.getDataValue('subTotal');
        total = total + cartItem.get('quantity');
      }
    }
    const rankDiscount = await this.applyRankDiscount(userId, total, totalPrice);
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
      rankDiscount,
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

  private static async applyRankDiscount (cartableId: any, totalQuantity: number, totalPrice: number) {
    let rankDiscount = 0;
    const user = await UserModel.findByPk(cartableId);
    if (!user) return rankDiscount;
    const basicRank = (await RankModel.findOrCreate({
      where: {
        type: RankModel.TYPE_ENUM.BASIC,
      },
      defaults: { id: undefined, type: RankModel.TYPE_ENUM.BASIC },
    }))[0];
    const basicConditions = await basicRank.getConditions();
    if (user.getDataValue('rank') === UserModel.RANK_ENUM.BASIC) {
      rankDiscount = this.applyBasicRankUser(totalQuantity, totalPrice, basicConditions);
    } else if (user.getDataValue('rank') === UserModel.RANK_ENUM.VIP) {
      rankDiscount = await this.applyVipRankUser(totalQuantity, totalPrice, basicConditions);
    }
    return rankDiscount;
  }

  private static applyBasicRankUser (totalQuantity: number, totalPrice: number, basicConditions: any) {
    let rankDiscount = 0;
    if (basicConditions.length === 0) return rankDiscount;
    const basicRankCondition = basicConditions.find((record: any) => record.orderAmountFrom <= totalQuantity && (record.orderAmountTo || 999999999) >= totalQuantity);
    if (!basicRankCondition) return rankDiscount;
    rankDiscount = totalPrice * basicRankCondition.discountValue / 100;
    return rankDiscount;
  }

  private static async applyVipRankUser (totalQuantity: number, totalPrice: number, basicConditions: any) {
    let rankDiscount = 0;
    const vipRank = (await RankModel.findOrCreate({
      where: {
        type: RankModel.TYPE_ENUM.VIP,
      },
      defaults: { id: undefined, type: RankModel.TYPE_ENUM.VIP },
    }))[0];
    if (vipRank.dateEarnDiscount.includes(dayjs().format('DD'))) {
      const vipConditions = await vipRank.getConditions();
      if (vipConditions.length === 0) return rankDiscount;
      const vipRankCondition = vipConditions.find((record: any) => record.orderAmountFrom <= totalQuantity && (record.orderAmountTo || 9999999) >= totalQuantity);
      if (!vipRankCondition) return rankDiscount;
      rankDiscount = totalPrice * vipRankCondition.discountValue / 100;
    } else {
      rankDiscount = this.applyBasicRankUser(totalQuantity, totalPrice, basicConditions);
    }
    return rankDiscount;
  }
}

export default CartDecorator;
