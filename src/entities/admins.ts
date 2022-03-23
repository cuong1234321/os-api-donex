import { DataTypes } from 'sequelize';

const AdminEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  fullName: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  avatar: {
    type: DataTypes.TEXT, allowNull: true,
  },
  username: {
    type: DataTypes.STRING(255), allowNull: false,
  },
  phoneNumber: {
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
  address: {
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
  forgotPasswordToken: {
    type: DataTypes.STRING(10), allowNull: true,
  },
  forgotPasswordExpireAt: {
    type: DataTypes.DATE, allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default AdminEntity;
