interface ProductVerifyCodesInterface {
  id: number;
  skuCode: string;
  verifyCode: string;
  appliedAt: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export default ProductVerifyCodesInterface;
