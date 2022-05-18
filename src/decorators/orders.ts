import ProductVariantModel from '@models/productVariants';
import SaleCampaignModel from '@models/saleCampaigns';
import SubOrderModel from '@models/subOrders';
import WarehouseModel from '@models/warehouses';
import SaleCampaignProductDecorator from './saleCampaignProducts';

class OrderDecorator {
  public static async formatOrder (order: any, promoApplication: any) {
    const { warehouses, productVariants } = await this.getOrderAttributes(order.subOrders);
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
        item.sellingPrice = (productVariant.saleCampaignPrice || 0) * item.quantity;
        item.productVariantInfo = productVariantInfo;
        item.saleCampaignId = productVariant.getDataValue('saleCampaignId');
        item.saleCampaignDiscount = productVariant.sellPrice - (productVariant.saleCampaignPrice || 0);
        item.commission = productVariant.sellPrice - (productVariant.saleCampaignPrice || 0);
        totalWeight = totalWeight + (productVariant.product.weight * parseInt(item.quantity));
        subTotal = subTotal + item.sellingPrice;
      }
      subOrder.weight = totalWeight;
      subOrder.subTotal = subTotal;
      subOrder.voucherDiscount = 0;
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
}

export default OrderDecorator;
