interface UserInterface {
  id: number,
  adminId: number,
  provinceId: number,
  districtId: number,
  wardId: number,
  address: string,
  fullName: string,
  phoneNumber: string,
  username: string,
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
  avatar: string;
  rank: string;
  coinReward: number;
  createdAt?: Date,
  updatedAt?: Date,
  deletedAt?: Date,
};

export default UserInterface;
