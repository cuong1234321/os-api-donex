import settings from '@configs/settings';
import { DataTypes } from 'sequelize';

const BankAccountEntity = {
  id: {
    type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true,
  },
  bankId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  bankAccount: {
    type: DataTypes.STRING(255), allowNull: false,
  },
  bankOwner: {
    type: DataTypes.STRING(255), allowNull: false,
  },
  qrCode: {
    type: DataTypes.STRING(255),
    allowNull: true,
    get (): string {
      const qrCode = this.getDataValue('qrCode') !== null
        ? `${settings.imageStorageHost}/${this.getDataValue('qrCode')}`
        : null;
      return qrCode;
    },
  },
  status: {
    type: DataTypes.ENUM({ values: ['active', 'inactive'] }), defaultValue: 'active',
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

export default BankAccountEntity;
