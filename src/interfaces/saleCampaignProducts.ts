
interface SaleCampaignProductInterface {
  id: number,
  saleCampaignId: number,
  productVariantId: number,
  createdAt?: Date,
  updatedAt?: Date,
  deletedAt?: Date,
};

export default SaleCampaignProductInterface;
