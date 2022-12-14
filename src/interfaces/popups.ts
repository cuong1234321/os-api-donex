interface PopupInterface {
  id: number;
  image: string;
  title: string;
  link: string;
  frequency: number;
  applyAt: Date;
  applyTo: Date;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;

  statusRef?: string;
};

export default PopupInterface;
