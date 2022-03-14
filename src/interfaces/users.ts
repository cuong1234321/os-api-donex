interface UserInterface {
  id: number,
  adminId: number,
  provinceId: number,
  districtId: number,
  wardId: number,
  address: string,
  fullName: string,
  phoneNumber: string,
  password: string,
  confirmPassword?: string,
  email: string,
  dateOfBirth: Date,
  gender: string,
  status: string,
  note: string,
  defaultRank: number,
  currentRank: number,
  forgotPasswordToken: string;
  forgotPasswordExpireAt: Date;
  createdAt?: Date,
  updatedAt?: Date,
};

export default UserInterface;
