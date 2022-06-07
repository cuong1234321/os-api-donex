import { DataTypes } from 'sequelize';

const CoinWalletChangeEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  type: {
    type: DataTypes.ENUM({ values: ['subtract', 'add'] }), allowNull: false,
  },
  mutableType: {
    type: DataTypes.STRING(30), allowNull: false,
  },
  mutableId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  amount: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default CoinWalletChangeEntity;
