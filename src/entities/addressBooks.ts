import { DataTypes } from 'sequelize';
const AddressBookEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  provinceId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  districtId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  wardId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  address: {
    type: DataTypes.STRING(255), allowNull: false,
  },
  fullName: {
    type: DataTypes.STRING(255), allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING(255), allowNull: false,
  },
  isDefault: {
    type: DataTypes.BOOLEAN, defaultValue: false,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default AddressBookEntity;
