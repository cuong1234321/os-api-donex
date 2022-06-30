import ProductVariantModel from '@models/productVariants';
import SaleCampaignModel from '@models/saleCampaigns';

class ApplySaleCampaignVariantDecorator {
  public static async calculatorVariantPrice (items: any, saleCampaignId?: any) {
    let totalPrice = 0;
    let totalQuantity = 0;
    let totalWeight = 0;
    const variants = await ProductVariantModel.scope(['withProduct']).findAll();
    if (!saleCampaignId) {
      items.forEach((item: any) => {
        const variant = variants.find((record: any) => record.id === item.productVariantId);
        item.sellingPrice = variant.sellPrice;
        item.listedPrice = variant.sellPrice;
        totalPrice += item.sellingPrice * item.quantity;
        totalQuantity += item.quantity;
        item.saleCampaignDiscount = 0;
        totalWeight += item.quantity * ((JSON.parse(JSON.stringify(variant))).product.weight);
      });
    } else {
      const scopes: any = [
        'isAbleToUse',
        'withProductVariant',
        { method: ['byId', saleCampaignId] },
      ];
      const saleCampaign = await SaleCampaignModel.scope(scopes).findOne();
      items.forEach((item: any) => {
        const variant = variants.find((record: any) => record.id === item.productVariantId);
        item.listedPrice = variant.sellPrice;
        const saleCampaignProduct = saleCampaign.productVariants.find((record: any) => record.productVariantId === item.productVariantId);
        if (saleCampaignProduct) {
          item.saleCampaignId = saleCampaignId;
          item.sellingPrice = saleCampaignProduct.price;
        } else {
          item.sellingPrice = variant.sellPrice;
        }
        item.saleCampaignDiscount = variant.sellPrice - item.sellingPrice;
        totalPrice += item.sellingPrice * item.quantity;
        totalQuantity += item.quantity;
        totalWeight += item.quantity * ((JSON.parse(JSON.stringify(variant))).product.weight);
      });
    }
    return { items, totalPrice, totalQuantity, totalWeight };
  }
}

export default ApplySaleCampaignVariantDecorator;
