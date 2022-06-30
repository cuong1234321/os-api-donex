import ProductVariantModel from '@models/productVariants';
import SaleCampaignProductModel from '@models/saleCampaignProducts';
import SaleCampaignModel from '@models/saleCampaigns';
import _ from 'lodash';

class SaleCampaignProductDecorator {
  public static async calculatorVariantPrice (products: any, saleCampaigns: SaleCampaignModel[]) {
    if (saleCampaigns.length === 0) return products;
    const saleCampaignIds = saleCampaigns.map(record => record.id);
    const listSaleCampaignProducts = await SaleCampaignProductModel.scope([
      { method: ['bySaleCampaignId', saleCampaignIds] },
    ]).findAll();
    for (const product of products) {
      const sellPrices = [];
      const variants = product.getDataValue('variants');
      for (const variant of variants) {
        variant.setDataValue('saleCampaignPrice', variant.sellPrice);
        const saleCampaignProducts = listSaleCampaignProducts.filter((record) => record.productVariantId === variant.id);
        if (saleCampaignProducts.length > 0) {
          const minSaleCampaignProduct = _.minBy(saleCampaignProducts, (record) => record.price);
          variant.setDataValue('saleCampaignPrice', minSaleCampaignProduct.price);
        }
        if (variant.getDataValue('saleCampaignPrice') < 0) variant.setDataValue('saleCampaignPrice', 0);
        sellPrices.push(variant.getDataValue('saleCampaignPrice'));
      }
      product.setDataValue('minPrice', Math.min(...sellPrices));
      product.setDataValue('maxPrice', Math.max(...sellPrices));
    }
    return products;
  }

  public static async calculatorProductVariantPrice (variants: ProductVariantModel[], saleCampaigns: SaleCampaignModel[]) {
    if (saleCampaigns.length === 0) return variants;
    const saleCampaignIds = saleCampaigns.map(record => record.id);
    const listSaleCampaignProducts = await SaleCampaignProductModel.scope([
      { method: ['bySaleCampaignId', saleCampaignIds] },
    ]).findAll();
    for (const variant of variants) {
      variant.setDataValue('saleCampaignPrice', variant.sellPrice);
      const saleCampaignProducts = listSaleCampaignProducts.filter((record) => record.productVariantId === variant.id);
      if (saleCampaignProducts.length > 0) {
        const minSaleCampaignProduct = _.minBy(saleCampaignProducts, (record) => record.price);
        variant.setDataValue('saleCampaignPrice', minSaleCampaignProduct.price);
        variant.setDataValue('saleCampaignId', minSaleCampaignProduct.saleCampaignId);
      }
      if (variant.getDataValue('saleCampaignPrice') < 0) variant.setDataValue('saleCampaignPrice', 0);
    }
    return variants;
  }
}

export default SaleCampaignProductDecorator;
