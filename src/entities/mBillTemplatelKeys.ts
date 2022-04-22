
import { DataTypes } from 'sequelize';

const MBillTemplateKeyEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  title: {
    type: DataTypes.STRING(255), allowNull: false,
  },
  key: {
    type: DataTypes.STRING(255), allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default MBillTemplateKeyEntity;
