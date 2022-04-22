interface BillTemplateInterface {
  id: number;
  title: string;
  content: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export default BillTemplateInterface;
