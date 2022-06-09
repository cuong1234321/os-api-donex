import settings from '@configs/settings';
import BillTemplateModel from '@models/billTemplates';
import CollaboratorModel from '@models/collaborators';
import OrderModel from '@models/orders';
import ProductVariantModel from '@models/productVariants';
import RankModel from '@models/ranks';
import SaleCampaignModel from '@models/saleCampaigns';
import SystemSettingModel from '@models/systemSetting';
import UserModel from '@models/users';
import VoucherConditionModel from '@models/voucherConditions';
import WarehouseModel from '@models/warehouses';
import Fee from '@repositories/models/fee';
import SaleCampaignProductDecorator from './saleCampaignProducts';

class OrderDecorator {
  public static async formatOrder (order: any, voucher: any, ward: any, currentUser: any) {
    const { subOrders, orderTotalFee, orderTotalBill, finalAmount, totalProduct, totalTax } = await this.getOrderAttributes(order.subOrders, ward);
    const systemSetting: any = (await SystemSettingModel.findOrCreate({
      where: { },
      defaults: { id: undefined },
    }))[0];
    order.subTotal = 0;
    const billTemplate = (await BillTemplateModel.findOrCreate({
      where: {
        status: BillTemplateModel.STATUS_ENUM.ACTIVE,
      },
      defaults: {
        id: undefined,
        title: 'Hóa đơn thanh toán',
        content: '',
        status: BillTemplateModel.STATUS_ENUM.ACTIVE,
      },
    }))[0];
    order = await this.formatOderInfo(finalAmount, orderTotalBill, totalTax, totalProduct, currentUser, systemSetting, orderTotalFee, subOrders, order, voucher, billTemplate);
    if (order.referralCode) {
      const seller = await CollaboratorModel.scope([
        { method: ['byReferral', order.referralCode] },
      ]).findOne();
      if (!seller) { return order; }
      let affiliateDiscountPercent = 0;
      switch (seller.type) {
        case CollaboratorModel.TYPE_ENUM.DISTRIBUTOR:
          affiliateDiscountPercent = systemSetting.distributorAffiliate;
          break;
        case CollaboratorModel.TYPE_ENUM.AGENCY:
          affiliateDiscountPercent = systemSetting.agencyAffiliate;
          break;
        case CollaboratorModel.TYPE_ENUM.COLLABORATOR:
          affiliateDiscountPercent = systemSetting.collaboratorAffiliate;
          break;
      }
      order.subOrders.forEach((subOrder: any) => {
        subOrder.affiliateDiscount = (subOrder.subTotal - subOrder.rankDiscount) * affiliateDiscountPercent / 100;
      });
    }
    return order;
  }

  private static async getOrderAttributes (subOrders: any, ward: any) {
    const warehouseIds = new Array(0);
    let orderTotalFee = 0;
    let orderTotalBill = 0;
    let totalProduct = 0;
    let finalAmount = 0;
    let totalTax = 0;
    let productVariantIds = new Array(0);
    const scopes: any = [
      'isAbleToUse',
      'withProductVariant',
      'isApplyToUser',
    ];
    const saleCampaigns = await SaleCampaignModel.scope(scopes).findAll();
    for (const subOrder of subOrders) {
      warehouseIds.push(subOrder.warehouseId);
      productVariantIds.push(subOrder.items.map((item: any) => item.productVariantId));
    }
    productVariantIds = [...new Set(productVariantIds.flat(Infinity))];
    const warehouses = await WarehouseModel.scope([
      { method: ['byId', warehouseIds.flat(Infinity)] },
      'withAddressInfo',
    ]).findAll();
    let productVariants = await ProductVariantModel.scope([
      { method: ['byId', productVariantIds] },
      'withOptions',
      'withProduct',
    ]).findAll();
    productVariants = await SaleCampaignProductDecorator.calculatorProductVariantPrice(productVariants, saleCampaigns);
    for (const subOrder of subOrders) {
      const orderItems = [];
      let weight = 0;
      let subOrderTotalBill = 0;
      let shippingFee = 0;
      let total = 0;
      let subOrderFinalAmount = 0;
      subOrder.deliveryType = 'platform';
      subOrder.warehouse = warehouses.find((record: any) => record.id === subOrder.warehouseId);
      subOrder.warehouseId = warehouses.find((record: any) => record.id === subOrder.warehouseId).id;
      for (const item of subOrder.items) {
        const variant = productVariants.find((productVariant : any) => productVariant.id === item.productVariantId);
        orderItems.push({
          productVariantId: variant.id,
          quantity: item.quantity,
          sellingPrice: (variant.getDataValue('saleCampaignPrice') || variant.sellPrice),
          listedPrice: variant.sellPrice,
          saleCampaignDiscount: variant.sellPrice - (variant.getDataValue('saleCampaignPrice') || 0),
          saleCampaignId: variant.getDataValue('saleCampaignId'),
        });
        weight = weight + (variant.product.getDataValue('weight') * parseInt(item.quantity));
        total = total + parseInt(item.quantity);
        subOrderTotalBill = subOrderTotalBill + ((variant.getDataValue('saleCampaignPrice') || variant.sellPrice) * parseInt(item.quantity));
        subOrderFinalAmount = subOrderFinalAmount + ((variant.getDataValue('saleCampaignPrice') || variant.sellPrice) * parseInt(item.quantity));
      }
      subOrder.items = orderItems;
      subOrder.weight = weight;
      subOrder.subOrderTotalBill = subOrderTotalBill;
      subOrder.total = total;
      subOrder.tax = subOrderTotalBill * (8 / 100);
      subOrder.subTotal = subOrderFinalAmount;
      const feeParams = {
        serviceTypeId: 2,
        fromDistrictId: parseInt(subOrder.warehouse.getDataValue('district').ghnDistrictId),
        toDistrictId: parseInt(ward.district.ghnDistrictId),
        height: 10,
        length: 20,
        weight: weight,
        width: 10,
        toWardCode: ward.ghnWardCode,
      };
      const fee = await Fee.calculate(feeParams);
      if (fee.code === 400) { shippingFee = 0; } else { shippingFee = fee.data.total; }
      subOrder.shippingFee = shippingFee;
      orderTotalFee = orderTotalFee + shippingFee;
      orderTotalBill = orderTotalBill + subOrderTotalBill;
      finalAmount = finalAmount + subOrderFinalAmount;
      totalProduct = totalProduct + total;
      totalTax = totalTax + subOrderTotalBill * (8 / 100);
    }
    return { subOrders, orderTotalFee, orderTotalBill, finalAmount, totalProduct, totalTax };
  }

  private static async formatOderInfo (finalAmount: any, orderTotalBill: any, totalTax: any, totalProduct: any, currentUser: any, systemSetting: any, orderTotalFee: any, subOrders: any, order: any, voucher: any, billTemplate: any) {
    order.isFreeShipping = false;
    const { rankDiscountValue, valueDiscount }: any = await this.applyRankDiscount(currentUser, totalProduct, (orderTotalBill + totalTax));
    if (((orderTotalBill + totalTax) > settings.normalShippingDiscount || (valueDiscount < 20 && (orderTotalBill + totalTax) > settings.rankShippingDiscount)) && order.paymentMethod !== OrderModel.PAYMENT_METHOD.COD) {
      order.isFreeShipping = true;
      orderTotalFee = 0;
    }
    let orderFinalAmount = finalAmount + orderTotalFee + totalTax;
    const applicationDiscount = await this.calculatorOrderDiscount(voucher, orderFinalAmount);
    let coinDiscount = order.coinUsed ? (systemSetting.coinConversionLevel * order.coinUsed) : 0;
    if (orderFinalAmount < coinDiscount) {
      coinDiscount = orderFinalAmount;
    }
    order.coinDiscount = coinDiscount;
    order.subTotal = 0;
    order.voucherDiscount = 0;
    order.totalDiscount = 0;
    order.rankDiscount = 0;
    for (const subOrder of subOrders) {
      subOrder.note = order.note;
      subOrder.billId = billTemplate.id;
      if ((subOrder.totalBill + subOrder.shippingFee + subOrder.totalTax) >= orderFinalAmount) {
        order.coinDiscount = coinDiscount;
        order.subTotal = 0;
        subOrder.coinDiscount = coinDiscount;
        subOrder.shippingDiscount = subOrder.shippingFee;
        subOrder.shippingFee = 0;
        subOrder.subTotal = 0;
        subOrder.coinUsed = Math.round((subOrder.coinDiscount / systemSetting.coinConversionLevel));
      } else {
        if (order.isFreeShipping) {
          subOrder.subTotal = subOrder.subTotal - subOrder.shippingFee;
          subOrder.shippingDiscount = subOrder.shippingFee;
          subOrder.shippingFee = 0;
        }
        const warehouseCoinDiscount = Math.round((subOrder.subTotal / orderFinalAmount) * coinDiscount);
        subOrder.subTotal = subOrder.subTotal - warehouseCoinDiscount;
        subOrder.coinDiscount = warehouseCoinDiscount;
        subOrder.totalDiscount = subOrder.totalDiscount + warehouseCoinDiscount;
        subOrder.coinUsed = Math.round((subOrder.coinDiscount / systemSetting.coinConversionLevel));
        order.subTotal = order.subTotal + subOrder.subTotal;
        order.totalDiscount = order.totalDiscount + subOrder.coinDiscount;
      }
    }
    orderFinalAmount = order.subTotal;
    order.subTotal = 0;
    for (const subOrder of subOrders) {
      const voucherDiscount = applicationDiscount ? Math.round((subOrder.subTotal / orderFinalAmount) * applicationDiscount) : 0;
      subOrder.voucherDiscount = voucherDiscount;
      subOrder.subTotal = subOrder.subTotal - voucherDiscount;
      subOrder.totalDiscount = subOrder.totalDiscount + voucherDiscount;
      order.subTotal = order.subTotal + subOrder.subTotal;
      order.voucherDiscount = order.voucherDiscount + subOrder.voucherDiscount;
      order.totalDiscount = order.totalDiscount + subOrder.voucherDiscount;
    }
    orderFinalAmount = order.subTotal;
    order.subTotal = 0;
    for (const subOrder of subOrders) {
      const rankDiscount = rankDiscountValue ? Math.round((subOrder.subTotal / orderFinalAmount) * rankDiscountValue) : 0;
      subOrder.rankDiscount = rankDiscount;
      subOrder.subTotal = subOrder.subTotal - rankDiscount;
      subOrder.totalDiscount = subOrder.totalDiscount + rankDiscount;
      order.subTotal = order.subTotal + subOrder.subTotal;
      order.rankDiscount = order.rankDiscount + subOrder.rankDiscount;
      order.totalDiscount = order.totalDiscount + subOrder.rankDiscount;
    }
    order.totalBill = orderTotalBill;
    order.totalFee = orderTotalFee;
    order.totalTax = totalTax;
    order.total = totalProduct;
    order.subOrders = subOrders;
    return order;
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

  private static async applyRankDiscount (user: any, totalQuantity: number, totalPrice: number) {
    let rankDiscountValue = 0;
    let rank: any;
    if (!user) { return rankDiscountValue; }
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
      return rankDiscountValue;
    }
    const valueDiscount = rank.conditions[0].discountValue;
    rankDiscountValue = totalPrice * (valueDiscount / 100);
    return { rankDiscountValue, valueDiscount };
  }
}

export default OrderDecorator;
