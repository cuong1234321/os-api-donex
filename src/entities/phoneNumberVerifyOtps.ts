import { DataTypes } from 'sequelize';

const PhoneNumberVerifyOtpEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  otp: {
    type: DataTypes.STRING(10), allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING(20), allowNull: false,
  },
  otpExpiresAt: {
    type: DataTypes.DATE, allowNull: false,
  },
  verifyToken: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default PhoneNumberVerifyOtpEntity;
