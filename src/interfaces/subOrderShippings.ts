interface SubOrderShippingInterface {
  id: number;
  subOrderId: number;
  content: string;
  incurredAt: Date;
  status: string;
  ghnWarehouse: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export default SubOrderShippingInterface;
