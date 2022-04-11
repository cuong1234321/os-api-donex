import CollaboratorModel from '@models/collaborators';
import SaleCampaignModel from '@models/saleCampaigns';

class SaleCampaignProductDecorator {
  public static async currentActiveSaleCampaign (userType: string, products: any) {
    const scopes: any = [
      'isAbleToUse',
      'withProductVariant',
    ];
    switch (userType) {
      case CollaboratorModel.TYPE_ENUM.DISTRIBUTOR:
        scopes.push('isApplyToDistributor');
        break;
      case CollaboratorModel.TYPE_ENUM.AGENCY:
        scopes.push('isApplyToAgency');
        break;
      case CollaboratorModel.TYPE_ENUM.COLLABORATOR:
        scopes.push('isApplyToCollaborator');
        break;
      case 'USER':
        scopes.push('isApplyToUser');
        break;
      default:
        break;
    }
    const saleCampaigns = await SaleCampaignModel.scope(scopes).findAll();
    for (const saleCampaign of saleCampaigns) {
      for (const product of products) {
        const sellPrices = [];
        for (const variant of product.getDataValue('variants')) {
          variant.setDataValue('saleCampaignPrice', variant.sellPrice);
          if (saleCampaign.productVariants.find((record: any) => record.productVariantId === variant.id)) {
            if (saleCampaign.calculatePriceType === SaleCampaignModel.CALCULATE_PRICE_TYPE.REDUCE_BY_AMOUNT) {
              variant.setDataValue('saleCampaignPrice', variant.sellPrice - saleCampaign.value);
            }
            if (saleCampaign.calculatePriceType === SaleCampaignModel.CALCULATE_PRICE_TYPE.INCREASE_BY_AMOUNT) {
              variant.setDataValue('saleCampaignPrice', variant.sellPrice + saleCampaign.value);
            }
            if (saleCampaign.calculatePriceType === SaleCampaignModel.CALCULATE_PRICE_TYPE.REDUCE_BY_PERCENT) {
              variant.setDataValue('saleCampaignPrice', variant.sellPrice - (variant.sellPrice * saleCampaign.value));
            }
            if (saleCampaign.calculatePriceType === SaleCampaignModel.CALCULATE_PRICE_TYPE.INCREASE_BY_PERCENT) {
              variant.setDataValue('saleCampaignPrice', variant.sellPrice + (variant.sellPrice * saleCampaign.value));
            }
          }
          sellPrices.push(variant.getDataValue('saleCampaignPrice'));
        }
        product.setDataValue('minPrice', Math.min(...sellPrices));
        product.setDataValue('maxPrice', Math.max(...sellPrices));
      }
    }
    return products;
  }
}

export default SaleCampaignProductDecorator;
