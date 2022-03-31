import UserModel from '@models/users';

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
  title: string,
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
  forgotPasswordToken: string;
  forgotPasswordExpireAt: Date;
  avatar: string;

  createdAt?: Date,
  updatedAt?: Date,
  deletedAt: Date,

  user?: UserModel,
};

export default CollaboratorInterface;
