import settings from '@configs/settings';
import { DataTypes } from 'sequelize';

const collaboratorEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  parentId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  type: {
    type: DataTypes.ENUM({ values: ['collaborator', 'agency', 'distributor'] }),
    defaultValue: 'collaborator',
  },
  status: {
    type: DataTypes.ENUM({ values: ['pending', 'active', 'inactive', 'rejected'] }),
    defaultValue: 'pending',
  },
  paperProofFront: {
    type: DataTypes.STRING(255),
    allowNull: true,
    get (): string {
      const paperProofFront = this.getDataValue('paperProofFront') !== null
        ? `${settings.imageStorageHost}/${this.getDataValue('paperProofFront')}`
        : null;
      return paperProofFront;
    },
  },
  paperProofBack: {
    type: DataTypes.STRING(255),
    allowNull: true,
    get (): string {
      const paperProofBack = this.getDataValue('paperProofBack') !== null
        ? `${settings.imageStorageHost}/${this.getDataValue('paperProofBack')}`
        : null;
      return paperProofBack;
    },
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  openTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  closeTime: {
    type: DataTypes.TIME,
    allowNull: true,
  },
  lat: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  long: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  addressTitle: {
    type: DataTypes.STRING(255),
    allowNull: true,
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
    type: DataTypes.STRING(255),
    allowNull: false,
    validator: {
      notNull: { msg: 'Tên không được bỏ trống.' },
    },
  },
  phoneNumber: {
    type: DataTypes.STRING(15),
    allowNull: false,
    validator: {
      notNull: { msg: 'SĐT không được bỏ trống.' },
    },
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
    type: DataTypes.STRING(255),
    allowNull: false,
    validator: {
      notNull: { msg: 'Email không được bỏ trống.' },
    },
  },
  dateOfBirth: {
    type: DataTypes.DATE, allowNull: true,
  },
  defaultRank: {
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
  rejectorId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  rejectDate: {
    type: DataTypes.DATE,
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

export default collaboratorEntity;
