import ProductVariantModel from '@models/productVariants';
import SaleCampaignModel from '@models/saleCampaigns';
import SubOrderModel from '@models/subOrders';
import SystemSettingModel from '@models/systemSetting';
import VoucherConditionModel from '@models/voucherConditions';
import WarehouseModel from '@models/warehouses';
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
    let coinDiscount = 0;
    if (order.coinUsed) {
      coinDiscount = order.coinUsed ? (systemSetting.coinConversionLevel * order.coinUsed) : 0;
    }
    for (const subOrder of order.subOrders) {
      const warehouse = warehouses.find((warehouse: any) => warehouse.id === subOrder.warehouseId);
      let totalWeight = 0;
      let subTotal = 0;
      subOrder.total = 0;
      subOrder.shippingCode = 0;
      subOrder.status = SubOrderModel.STATUS_ENUM.DRAFT;
      subOrder.length = 0;
      subOrder.width = 0;
      subOrder.height = 0;
      subOrder.warehouseId = warehouse.id;
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
        item.sellingPrice = (productVariant.getDataValue('saleCampaignPrice') >= 0 ? productVariant.getDataValue('saleCampaignPrice') : productVariant.sellPrice) * item.quantity;
        item.productVariantInfo = productVariantInfo;
        item.saleCampaignId = productVariant.getDataValue('saleCampaignId');
        item.saleCampaignDiscount = productVariant.sellPrice - (productVariant.getDataValue('saleCampaignPrice') || 0);
        item.commission = productVariant.sellPrice - (productVariant.getDataValue('saleCampaignPrice') || 0);
        totalWeight = totalWeight + (productVariant.product.weight * parseInt(item.quantity));
        subTotal = subTotal + item.sellingPrice;
      }
      subOrder.weight = totalWeight;
      subOrder.subTotal = subTotal;
      subOrder.voucherDiscount = 0;
      OrderSubTotal = OrderSubTotal + subOrder.subTotal;
      const applicationDiscount: number = await this.calculatorOrderDiscount(promoApplication, OrderSubTotal);
      order.applicationDiscount = applicationDiscount;
      for (const subOrder of order.subOrders) {
        if ((subOrder.subTotal / OrderSubTotal) >= 1) {
          if (subOrder.subTotal < coinDiscount) {
            order.coinUsed = Math.round(subOrder.subTotal / systemSetting.coinConversionLevel);
            subOrder.subTotal = 0;
          }
        } else {
          subOrder.subTotal = coinDiscount ? ((subOrder.subTotal / OrderSubTotal) * coinDiscount) : 0;
        }
        subOrder.voucherDiscount = applicationDiscount ? ((subOrder.subTotal / OrderSubTotal) * applicationDiscount) : 0;
        subOrder.subTotal = subOrder.subTotal - subOrder.voucherDiscount;
        order.subTotal = order.subTotal + subOrder.subTotal;
      }
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

  private static async calculatorCoinDiscount (coinUsed: number) {
    const systemSetting: any = (await SystemSettingModel.findOrCreate({
      where: { },
      defaults: { id: undefined },
    }))[0];
    const countDiscount = coinUsed ? (systemSetting.coinConversionLevel * coinUsed) : 0;
    return countDiscount;
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

export default OrderDecorator;
