import SaleCampaignModel from '@models/saleCampaigns';

class SaleCampaignProductDecorator {
  public static async calculatorVariantPrice (products: any, saleCampaigns: any) {
    for (const saleCampaign of saleCampaigns) {
      for (const product of products) {
        const sellPrices = [];
        const variants = Array.isArray(product.getDataValue('variants')) ? product.getDataValue('variants') : [product.getDataValue('variants')];
        for (const variant of variants) {
          variant.setDataValue('saleCampaignPrice', variant.sellPrice);
          if (saleCampaign.productVariants.find((record: any) => record.productVariantId === variant.id)) {
            if (saleCampaign.calculatePriceType === SaleCampaignModel.CALCULATE_PRICE_TYPE.REDUCE_BY_AMOUNT) {
              variant.setDataValue('saleCampaignPrice', variant.sellPrice - saleCampaign.value);
            }
            if (saleCampaign.calculatePriceType === SaleCampaignModel.CALCULATE_PRICE_TYPE.INCREASE_BY_AMOUNT) {
              variant.setDataValue('saleCampaignPrice', variant.sellPrice + saleCampaign.value);
            }
            if (saleCampaign.calculatePriceType === SaleCampaignModel.CALCULATE_PRICE_TYPE.REDUCE_BY_PERCENT) {
              variant.setDataValue('saleCampaignPrice', variant.sellPrice - (variant.sellPrice * saleCampaign.value / 100));
            }
            if (saleCampaign.calculatePriceType === SaleCampaignModel.CALCULATE_PRICE_TYPE.INCREASE_BY_PERCENT) {
              variant.setDataValue('saleCampaignPrice', variant.sellPrice + (variant.sellPrice * saleCampaign.value / 100));
            }
          }
          if (variant.getDataValue('saleCampaignPrice') < 0) variant.setDataValue('saleCampaignPrice', 0);
          sellPrices.push(variant.getDataValue('saleCampaignPrice'));
        }
        if (Array.isArray(product.getDataValue('variants'))) {
          product.setDataValue('minPrice', Math.min(...sellPrices));
          product.setDataValue('maxPrice', Math.max(...sellPrices));
        }
      }
    }
    return products;
  }

  public static async calculatorProductVariantPrice (variants: any, saleCampaigns: any) {
    for (const saleCampaign of saleCampaigns) {
      const sellPrices = [];
      for (const variant of variants) {
        variant.setDataValue('saleCampaignPrice', variant.sellPrice);
        if (saleCampaign.productVariants.find((record: any) => record.productVariantId === variant.id)) {
          if (saleCampaign.calculatePriceType === SaleCampaignModel.CALCULATE_PRICE_TYPE.REDUCE_BY_AMOUNT) {
            variant.setDataValue('saleCampaignPrice', variant.sellPrice - saleCampaign.value);
          }
          if (saleCampaign.calculatePriceType === SaleCampaignModel.CALCULATE_PRICE_TYPE.INCREASE_BY_AMOUNT) {
            variant.setDataValue('saleCampaignPrice', variant.sellPrice + saleCampaign.value);
          }
          if (saleCampaign.calculatePriceType === SaleCampaignModel.CALCULATE_PRICE_TYPE.REDUCE_BY_PERCENT) {
            variant.setDataValue('saleCampaignPrice', variant.sellPrice - (variant.sellPrice * saleCampaign.value / 100));
          }
          if (saleCampaign.calculatePriceType === SaleCampaignModel.CALCULATE_PRICE_TYPE.INCREASE_BY_PERCENT) {
            variant.setDataValue('saleCampaignPrice', variant.sellPrice + (variant.sellPrice * saleCampaign.value / 100));
          }
        }
        if (variant.getDataValue('saleCampaignPrice') < 0) variant.setDataValue('saleCampaignPrice', 0);
        variant.setDataValue('saleCampaignId', saleCampaign.id);
        sellPrices.push(variant.getDataValue('saleCampaignPrice'));
      }
    }
    return variants;
  }
}

export default SaleCampaignProductDecorator;
