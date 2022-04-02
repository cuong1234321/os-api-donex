import settings from '@configs/settings';
import { DataTypes } from 'sequelize';

const UserEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  adminId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  provinceId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  districtId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  wardId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  address: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  fullName: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  phoneNumber: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  username: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  password: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  confirmPassword: {
    type: DataTypes.VIRTUAL,
  },
  email: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  dateOfBirth: {
    type: DataTypes.DATE, allowNull: true,
  },
  gender: {
    type: DataTypes.ENUM({ values: ['male', 'female', 'other'] }),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM({ values: ['active', 'inactive'] }),
    defaultValue: 'active',
  },
  note: {
    type: DataTypes.TEXT, allowNull: true,
  },
  defaultRank: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  currentRank: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  forgotPasswordToken: {
    type: DataTypes.STRING(100), allowNull: true,
  },
  forgotPasswordExpireAt: {
    type: DataTypes.DATE, allowNull: true,
  },
  avatar: {
    type: DataTypes.STRING(255),
    allowNull: true,
    get (): string {
      const avatar = this.getDataValue('avatar') !== null
        ? `${settings.imageStorageHost}/${this.getDataValue('avatar')}`
        : null;
      return avatar;
    },
  },
  rank: {
    type: DataTypes.ENUM({ values: ['Basic', 'Vip'] }),
    defaultValue: 'Basic',
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
  deletedAt: {
    type: DataTypes.DATE,
  },
};

export default UserEntity;
