
interface AdminInterface {
  id: number,
  fullName: string,
  phoneNumber: string,
  password: string,
  email: string,
  address: string,
  dateOfBirth: Date,
  gender: string,
  status: string,
  note: string,
  createdAt?: Date,
  updatedAt?: Date,
};

export default AdminInterface;
