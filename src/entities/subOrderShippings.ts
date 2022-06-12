import { DataTypes } from 'sequelize';

const SubOrderShippingEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  subOrderId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  content: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  incurredAt: {
    type: DataTypes.DATE, allowNull: true,
  },
  status: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  ghnWarehouse: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default SubOrderShippingEntity;
