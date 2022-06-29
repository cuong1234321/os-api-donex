import ProductOptionModel from '@models/productOptions';

interface ProductVariantInterface {
  id: number;
  productId: number;
  name: string;
  slug: string;
  skuCode: string;
  mainSku: string;
  barCode: string;
  buyPrice: number;
  sellPrice: number;
  stock: number;
  optionMappingIds?: number[]
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  options?: ProductOptionModel[];
  saleCampaignPrice?: number;
  colorTitle?: string;
  supportingColorTitle?: string;
  sizeTitle?: string;
  saleCampaignId?: number;
  quantity?: number;
  detailReport?: ProductVariantInterface[];
  unit?: string;
};

export default ProductVariantInterface;
