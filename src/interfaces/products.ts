import ProductMediaModel from '@models/productMedias';
import ProductOptionModel from '@models/productOptions';
import ProductVariantModel from '@models/productVariants';

interface ProductInterface {
  id: number;
  name: string;
  slug: string;
  avatar: string;
  description: string;
  shortDescription: string;
  sizeGuide: string;
  gender: number;
  typeProductId: number;
  status: string;
  isHighlight: boolean;
  isNew: boolean;
  inFlashSale: boolean;
  weight: number;
  length: number;
  width: number;
  height: number;
  unit: string;
  minStock: number,
  maxStock: number,
  skuCode: string,
  barCode: string,
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  options?: ProductOptionModel[];
  medias?: ProductMediaModel[];
  variants?: ProductVariantModel[];
};

export default ProductInterface;
