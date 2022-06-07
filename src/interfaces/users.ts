import RankModel from '@models/ranks';

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
  defaultRank: string,
  currentRank: number,
  forgotPasswordToken: string;
  forgotPasswordExpireAt: Date;
  avatar: string;
  rank: string;
  coinReward: number;
  alreadyFinishOrder: boolean;
  isBlackList: boolean;
  lastOrderFinishedAt: Date;
  createdAt?: Date,
  updatedAt?: Date,
  deletedAt?: Date,

  defaultRankInfo?: RankModel,
  currentRankInfo?: RankModel,
};

export default UserInterface;
