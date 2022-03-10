
interface ProductMediaInterface {
  id: number;
  type: string;
  source: string;
  uploadableType: string;
  uploadableId: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export default ProductMediaInterface;
