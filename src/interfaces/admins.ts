
interface AdminInterface {
  id: number,
  fullName: string,
  phoneNumber: string,
  password: string,
  confirmPassword?: string,
  email: string,
  address: string,
  dateOfBirth: Date,
  gender: string,
  status: string,
  note: string,
  forgotPasswordToken: string;
  forgotPasswordExpireAt: Date;
  createdAt?: Date,
  updatedAt?: Date,
};

export default AdminInterface;
