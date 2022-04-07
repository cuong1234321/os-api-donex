import CollaboratorModel from '@models/collaborators';
import SaleCampaignModel from '@models/saleCampaigns';

class saleCampaignVariantService {
  public static async currentActiveSaleCampaign (userType: string, products: any) {
    const scopes: any = [
      'isAbleToUse',
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
      const productVariantIds = saleCampaign.productVariants.map((record: any) => record.id);
      for (const product of products) {
        for (const variant of product.variants) {
          if (productVariantIds.includes(variant.id)) {
            if (saleCampaign.calculatePriceType === SaleCampaignModel.CALCULATE_PRICE_TYPE.REDUCE_BY_AMOUNT) {
              variant.sellPrice = variant.sellPrice - saleCampaign.value;
            }
            if (saleCampaign.calculatePriceType === SaleCampaignModel.CALCULATE_PRICE_TYPE.INCREASE_BY_AMOUNT) {
              variant.sellPrice = variant.sellPrice + saleCampaign.value;
            }
            if (saleCampaign.calculatePriceType === SaleCampaignModel.CALCULATE_PRICE_TYPE.REDUCE_BY_PERCENT) {
              variant.sellPrice = variant.sellPrice - (variant.sellPrice * saleCampaign.value);
            }
            if (saleCampaign.calculatePriceType === SaleCampaignModel.CALCULATE_PRICE_TYPE.INCREASE_BY_PERCENT) {
              variant.sellPrice = variant.sellPrice + (variant.sellPrice * saleCampaign.value);
            }
          }
        }
      }
    }
    return products;
  }
}

export default saleCampaignVariantService;
