interface SaleCampaignInterface {
  id: number;
  title: string;
  description: string;
  applicationTarget: string;
  calculatePriceType: string;
  value: number;
  isActive: boolean;
  isApplyToDistributor: boolean;
  isApplyToAgency: boolean;
  isApplyToCollaborator: boolean;
  isApplyToUser: boolean;
  productCategoryId: number;
  appliedAt: Date;
  appliedTo: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export default SaleCampaignInterface;
