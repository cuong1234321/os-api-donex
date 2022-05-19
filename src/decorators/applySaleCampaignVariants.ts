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
        if (saleCampaign.productVariants.find((record: any) => record.productVariantId === item.productVariantId)) {
          item.saleCampaignId = saleCampaignId;
          if (saleCampaign.calculatePriceType === SaleCampaignModel.CALCULATE_PRICE_TYPE.REDUCE_BY_AMOUNT) {
            item.sellingPrice = variant.sellPrice - saleCampaign.value;
          }
          if (saleCampaign.calculatePriceType === SaleCampaignModel.CALCULATE_PRICE_TYPE.INCREASE_BY_AMOUNT) {
            item.sellingPrice = variant.sellPrice + saleCampaign.value;
          }
          if (saleCampaign.calculatePriceType === SaleCampaignModel.CALCULATE_PRICE_TYPE.REDUCE_BY_PERCENT) {
            item.sellingPrice = variant.sellPrice - (variant.sellPrice * saleCampaign.value / 100);
          }
          if (saleCampaign.calculatePriceType === SaleCampaignModel.CALCULATE_PRICE_TYPE.INCREASE_BY_PERCENT) {
            item.sellingPrice = variant.sellPrice + (variant.sellPrice * saleCampaign.value / 100);
          }
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
