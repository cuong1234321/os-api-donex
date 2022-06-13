import settings from '@configs/settings';
import { DataTypes } from 'sequelize';
const LookBookMediaEntity = {
  id: {
    type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true,
  },
  lookBookId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  source: {
    type: DataTypes.STRING(255),
    allowNull: true,
    get (): string {
      const source = this.getDataValue('source') !== null
        ? `${settings.imageStorageHost}/${this.getDataValue('source')}`
        : null;
      return source;
    },
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default LookBookMediaEntity;
