import settings from '@configs/settings';
import BillTemplateModel from '@models/billTemplates';
import CollaboratorModel from '@models/collaborators';
import OrderModel from '@models/orders';
import ProductVariantModel from '@models/productVariants';
import RankModel from '@models/ranks';
import SaleCampaignModel from '@models/saleCampaigns';
import SubOrderModel from '@models/subOrders';
import SystemSettingModel from '@models/systemSetting';
import UserModel from '@models/users';
import VoucherConditionModel from '@models/voucherConditions';
import WarehouseModel from '@models/warehouses';
import dayjs from 'dayjs';
import SaleCampaignProductDecorator from './saleCampaignProducts';

class OrderDecorator {
  public static async formatOrder (order: any, promoApplication: any) {
    const { warehouses, productVariants } = await this.getOrderAttributes(order.subOrders);
    const systemSetting: any = (await SystemSettingModel.findOrCreate({
      where: { },
      defaults: { id: undefined },
    }))[0];
    let OrderSubTotal = 0;
    order.subTotal = 0;
    let total = 0;
    let coinDiscount = 0;
    if (order.coinUsed) {
      coinDiscount = order.coinUsed ? (systemSetting.coinConversionLevel * order.coinUsed) : 0;
    }
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
    for (const subOrder of order.subOrders) {
      const warehouse = warehouses.find((warehouse: any) => warehouse.id === subOrder.warehouseId);
      let totalWeight = 0;
      let subTotal = 0;
      subOrder.total = 0;
      subOrder.shippingCode = 0;
      subOrder.status = order.paymentMethod === OrderModel.PAYMENT_METHOD.COD ? SubOrderModel.STATUS_ENUM.DRAFT : SubOrderModel.STATUS_ENUM.PENDING;
      subOrder.length = 0;
      subOrder.width = 0;
      subOrder.height = 0;
      subOrder.warehouseId = warehouse.id;
      subOrder.warehouse = warehouse;
      subOrder.note = order.note;
      subOrder.billId = billTemplate.id;
      for (const item of subOrder.items) {
        const productVariant = productVariants.find((productVariant: any) => productVariant.id === item.productVariantId);
        const productVariantInfo = {
          id: productVariant.id,
          productId: productVariant.productId,
          name: productVariant.name,
          slug: productVariant.slug,
          skuCode: productVariant.skuCode,
          barCode: productVariant.barCode,
          colorTitle: productVariant.getDataValue('colorTitle'),
          sizeTitle: productVariant.getDataValue('sizeTitle'),
          product: {
            avatar: productVariant.product.avatar,
            name: productVariant.product.name,
            slug: productVariant.product.slug,
            shortDescription: productVariant.product.shortDescription,
            skuCode: productVariant.product.skuCode,
            barCode: productVariant.product.barCode,
          },
        };
        item.listedPrice = productVariant.sellPrice;
        item.sellingPrice = (productVariant.getDataValue('saleCampaignPrice') >= 0 ? productVariant.getDataValue('saleCampaignPrice') : productVariant.sellPrice);
        item.productVariantInfo = productVariantInfo;
        item.saleCampaignId = productVariant.getDataValue('saleCampaignId');
        item.saleCampaignDiscount = productVariant.sellPrice - (productVariant.getDataValue('saleCampaignPrice') || 0);
        item.commission = productVariant.sellPrice - (productVariant.getDataValue('saleCampaignPrice') || 0);
        totalWeight = totalWeight + (productVariant.product.weight * parseInt(item.quantity));
        subTotal = subTotal + (item.sellingPrice * item.quantity);
        subOrder.total = subOrder.total + item.quantity;
      }
      subOrder.weight = totalWeight;
      subOrder.subTotal = subTotal;
      subOrder.tax = settings.defaultTax * subTotal / 100;
      subOrder.voucherDiscount = 0;
      OrderSubTotal = OrderSubTotal + subOrder.subTotal;
      total = total + subOrder.total;
    }
    order = await this.applyRankDiscount(order, total, OrderSubTotal);
    const applicationDiscount: number = await this.calculatorOrderDiscount(promoApplication, OrderSubTotal);
    order.applicationDiscount = applicationDiscount;
    for (const subOrder of order.subOrders) {
      if ((subOrder.subTotal / OrderSubTotal) >= 1 || (!subOrder.subTotal && !OrderSubTotal)) {
        if (subOrder.subTotal < coinDiscount) {
          order.coinUsed = Math.round(subOrder.subTotal / systemSetting.coinConversionLevel);
          subOrder.subTotal = 0;
          subOrder.coinUsed = order.coinUsed || 0;
          subOrder.coinDiscount = OrderSubTotal;
        } else {
          subOrder.subTotal = subOrder.subTotal ? subOrder.subTotal - coinDiscount : 0;
          subOrder.coinUsed = order.coinUsed;
          subOrder.coinDiscount = coinDiscount;
        }
      } else {
        if (OrderSubTotal < coinDiscount) {
          order.coinUsed = Math.round(OrderSubTotal / systemSetting.coinConversionLevel);
          coinDiscount = OrderSubTotal;
        }
        subOrder.subTotal = coinDiscount ? subOrder.subTotal - Math.round(((subOrder.subTotal / OrderSubTotal) * coinDiscount)) : subOrder.subTotal;
        subOrder.coinDiscount = coinDiscount ? Math.round(((subOrder.subTotal / OrderSubTotal) * coinDiscount)) : 0;
        subOrder.coinUsed = Math.round(subOrder.coinDiscount / systemSetting.coinConversionLevel);
      }
      subOrder.voucherDiscount = applicationDiscount ? ((subOrder.subTotal / OrderSubTotal) * applicationDiscount) : 0;
      subOrder.subTotal = subOrder.subTotal - subOrder.voucherDiscount;
      order.subTotal = order.subTotal + subOrder.subTotal;
    }
    order.total = total;
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
    return { order };
  }

  private static async getOrderAttributes (subOrders: any) {
    const warehouseIds = new Array(0);
    let productVariantIds = new Array(0);
    const scopes: any = [
      'isAbleToUse',
      'withProductVariant',
      'isApplyToUser',
    ];
    for (const subOrder of subOrders) {
      warehouseIds.push(subOrder.warehouseId);
      productVariantIds.push(subOrder.items.map((item: any) => item.productVariantId));
    }
    productVariantIds = [...new Set(productVariantIds.flat(Infinity))];
    const warehouses = await WarehouseModel.scope([
      { method: ['byId', warehouseIds.flat(Infinity)] },
      'withAddress',
    ]).findAll();
    let productVariants = await ProductVariantModel.scope([
      { method: ['byId', productVariantIds] },
      'withOptions',
      'withProduct',
    ]).findAll();
    const saleCampaigns = await SaleCampaignModel.scope(scopes).findAll();
    productVariants = await SaleCampaignProductDecorator.calculatorProductVariantPrice(productVariants, saleCampaigns);
    return { warehouses, productVariants };
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

  private static async applyRankDiscount (order: any, totalQuantity: number, totalPrice: number) {
    order.rankDiscount = 0;
    const user = await UserModel.findByPk(order.orderableId, { paranoid: false });
    if (!user) return order;
    const basicRank = (await RankModel.findOrCreate({
      where: {
        type: RankModel.TYPE_ENUM.BASIC,
      },
      defaults: { id: undefined, type: RankModel.TYPE_ENUM.BASIC },
    }))[0];
    const basicConditions = await basicRank.getConditions();
    if (user.getDataValue('rank') === UserModel.RANK_ENUM.BASIC) {
      order = this.applyBasicRankUser(order, totalQuantity, totalPrice, basicConditions);
    } else if (user.getDataValue('rank') === UserModel.RANK_ENUM.VIP) {
      order = await this.applyVipRankUser(order, totalQuantity, totalPrice, basicConditions);
    }
    return order;
  }

  private static applyBasicRankUser (order: any, totalQuantity: number, totalPrice: number, basicConditions: any) {
    if (basicConditions.length === 0) return order;
    const basicRankCondition = basicConditions.find((record: any) => record.orderAmountFrom < totalQuantity && (record.orderAmountTo || 999999999) > totalQuantity);
    if (!basicRankCondition) return order;
    const rankDiscount = totalPrice * basicRankCondition.discountValue / 100;
    order.rankDiscount = rankDiscount;
    if (order.subOrders) {
      order.subOrders.forEach((subOrder: any) => {
        subOrder.rankDiscount = subOrder.subTotal / totalPrice * rankDiscount;
      });
    }
    return order;
  }

  private static async applyVipRankUser (order: any, totalQuantity: number, totalPrice: number, basicConditions: any) {
    const vipRank = (await RankModel.findOrCreate({
      where: {
        type: RankModel.TYPE_ENUM.VIP,
      },
      defaults: { id: undefined, type: RankModel.TYPE_ENUM.VIP },
    }))[0];
    if (vipRank.dateEarnDiscount.includes(dayjs().format('DD'))) {
      const vipConditions = await vipRank.getConditions();
      if (vipConditions.length === 0) return order;
      const vipRankCondition = vipConditions.find((record: any) => record.orderAmountFrom < totalQuantity && (record.orderAmountTo || 9999999) > totalQuantity);
      if (!vipRankCondition) return order;
      const rankDiscount = totalPrice * vipRankCondition.discountValue / 100;
      order.rankDiscount = rankDiscount;
      if (order.subOrders) {
        order.subOrders.forEach((subOrder: any) => {
          subOrder.rankDiscount = subOrder.subTotal / totalPrice * rankDiscount;
        });
      }
    } else {
      order = this.applyBasicRankUser(order, totalQuantity, totalPrice, basicConditions);
    }
    return order;
  }
}

export default OrderDecorator;
