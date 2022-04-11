import { DataTypes } from 'sequelize';

const WarehouseTransferEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  adminId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  code: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  fromWarehouseId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  toWarehouseId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  transferDate: {
    type: DataTypes.DATE, allowNull: true,
  },
  note: {
    type: DataTypes.TEXT, allowNull: true,
  },
  status: {
    type: DataTypes.ENUM({ values: ['pending', 'confirm'] }), defaultValue: 'pending',
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

export default WarehouseTransferEntity;
