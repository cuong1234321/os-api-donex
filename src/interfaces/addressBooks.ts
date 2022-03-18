
interface AddressBookInterface {
  id: number,
  userId: number;
  fullName: string,
  phoneNumber: string,
  isDefault: boolean,
  provinceId: number,
  districtId: number,
  wardId: number,
  address: string,
  createdAt?: Date,
  updatedAt?: Date,
};

export default AddressBookInterface;
