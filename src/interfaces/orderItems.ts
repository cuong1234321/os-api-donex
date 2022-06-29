import ProductVariantInterface from './productVariants';

interface OrderItemInterface {
  id: number;
  subOrderId: number;
  productVariantId: number;
  quantity: number;
  sellingPrice: number;
  listedPrice: number;
  commission: number;
  saleCampaignDiscount: number;
  saleCampaignId: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  productVariantInfo?: {
    id: number,
    productId: number,
    name: string,
    slug: string,
    skuCode: string,
    barCode: string,
    colorTitle: string,
    sizeTitle: string,
    product: {
      avatar: string,
      name: string,
      slug: string,
      shortDescription: string,
      skuCode: string,
      barCode: string,
    }
  };
  variant? : ProductVariantInterface;
  totalQuantity?: number;
};

export default OrderItemInterface;
