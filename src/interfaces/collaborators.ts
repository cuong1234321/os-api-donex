interface CollaboratorInterface {
  id: number,
  parentId: number,
  type: string,
  status: string,
  paperProofFront: string;
  paperProofBack: string;
  rejectionReason: string;
  openTime: Date;
  closeTime: Date;
  lat: string,
  long: string,
  addressTitle: string,
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
  defaultRank: number,
  currentRank: number,
  forgotPasswordToken: string;
  forgotPasswordExpireAt: Date;
  avatar: string;
  rejectorId: number;
  rejectDate: Date;
  referralCode: string;
  accumulatedMoney: number;

  createdAt?: Date,
  updatedAt?: Date,
  deletedAt?: Date,
  linkAffiliate?: string,
};

export default CollaboratorInterface;
