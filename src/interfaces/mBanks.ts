interface MBankInterface {
  id: number;
  code: string;
  name: string;
  shortName: string;
  logo: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export default MBankInterface;
