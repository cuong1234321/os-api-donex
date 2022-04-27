import CollaboratorModel from '@models/collaborators';
import ProductVariantModel from '@models/productVariants';
import SaleCampaignModel from '@models/saleCampaigns';

class ApplySaleCampaignVariantDecorator {
  public static async calculatorVariantPrice (items: any, userType: any) {
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
    let totalPrice = 0;
    let totalQuantity = 0;
    const saleCampaigns = await SaleCampaignModel.scope(scopes).findAll();
    const variants = await ProductVariantModel.findAll();
    saleCampaigns.forEach((saleCampaign: any) => {
      items.forEach((item: any) => {
        const variant = variants.find((record: any) => record.id === item.productVariantId);
        if (saleCampaign.productVariants.find((record: any) => record.productVariantId === item.productVariantId)) {
          item.saleCampaignId = saleCampaign.id;
          if (saleCampaign.calculatePriceType === SaleCampaignModel.CALCULATE_PRICE_TYPE.REDUCE_BY_AMOUNT) {
            item.sellingPrice = variant.sellPrice - saleCampaign.value;
          }
          if (saleCampaign.calculatePriceType === SaleCampaignModel.CALCULATE_PRICE_TYPE.INCREASE_BY_AMOUNT) {
            item.sellingPrice = variant.sellPrice + saleCampaign.value;
          }
          if (saleCampaign.calculatePriceType === SaleCampaignModel.CALCULATE_PRICE_TYPE.REDUCE_BY_PERCENT) {
            item.sellingPrice = variant.sellPrice - (variant.sellPrice * saleCampaign.value);
          }
          if (saleCampaign.calculatePriceType === SaleCampaignModel.CALCULATE_PRICE_TYPE.INCREASE_BY_PERCENT) {
            item.sellingPrice = variant.sellPrice + (variant.sellPrice * saleCampaign.value);
          }
        } else {
          item.sellingPrice = variant.sellPrice;
        }
        totalPrice += item.sellingPrice * item.quantity;
        totalQuantity += item.quantity;
      });
    });
    return { items, totalPrice, totalQuantity };
  }
}

export default ApplySaleCampaignVariantDecorator;
