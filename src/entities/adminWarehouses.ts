import { DataTypes } from 'sequelize';

const AdminWarehouseEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  adminId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  warehouseId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default AdminWarehouseEntity;
