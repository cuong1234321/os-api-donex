import settings from '@configs/settings';
import { DataTypes } from 'sequelize';

const VoucherApplicationEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  thumbnail: {
    type: DataTypes.STRING(255),
    allowNull: true,
    get (): string {
      const thumbnail = this.getDataValue('thumbnail')
        ? `${settings.imageStorageHost}/${this.getDataValue('thumbnail')}`
        : null;
      return thumbnail;
    },
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notNull: { msg: 'Tiêu đề không được bỏ trống.' },
      notEmpty: { msg: 'Tiêu đề không được bỏ trống.' },
    },
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  appliedAt: {
    type: DataTypes.DATE, allowNull: false,
  },
  status: {
    type: DataTypes.ENUM({ values: ['active', 'inactive'] }),
    defaultValue: 'active',
  },
  code: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  beneficiaries: {
    type: DataTypes.ENUM({ values: ['user', 'collaborator', 'agency', 'distributor', 'all'] }),
    defaultValue: 'user',
  },
  paymentMethod: {
    type: DataTypes.STRING(255),
    allowNull: false,
    set (value: any[]) {
      if (value.length) {
        const paymentMethods = JSON.stringify(value);
        this.setDataValue('paymentMethod', paymentMethods);
      }
    },
    get (): (string)[] {
      if (!this.getDataValue('paymentMethod')) return;
      return JSON.parse(this.getDataValue('paymentMethod'));
    },
  },
  recipientLevel: {
    type: DataTypes.ENUM({ values: ['all', 'tier1', 'tier2', 'base', 'vip'] }),
    defaultValue: 'all',
  },
  isAlreadySent: {
    type: DataTypes.BOOLEAN, defaultValue: false,
  },
  expiredAt: {
    type: DataTypes.DATE, allowNull: false,
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

export default VoucherApplicationEntity;
