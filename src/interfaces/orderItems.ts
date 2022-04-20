
interface OrderItemInterface {
  id: number;
  subOrderId: number;
  productVariantId: number;
  quantity: number;
  sellingPrice: number;
  commission?: number;
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
};

export default OrderItemInterface;
