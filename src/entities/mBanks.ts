import { DataTypes } from 'sequelize';

const MBankEntity = {
  id: {
    type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true,
  },
  code: {
    type: DataTypes.STRING, allowNull: true,
  },
  name: {
    type: DataTypes.STRING, allowNull: true,
  },
  shortName: {
    type: DataTypes.STRING, allowNull: true,
  },
  logo: {
    type: DataTypes.STRING, allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default MBankEntity;
