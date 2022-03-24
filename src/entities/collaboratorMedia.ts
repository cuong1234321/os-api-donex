import settings from '@configs/settings';
import { DataTypes } from 'sequelize';

const CollaboratorMediaEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  collaboratorId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  source: {
    type: DataTypes.STRING(255),
    allowNull: true,
    get (): string {
      if (!this.getDataValue('source')) return;
      const source = `${settings.imageStorageHost}/${this.getDataValue('source')}`;
      return source;
    },
  },
  type: {
    type: DataTypes.ENUM({ values: ['inside', 'outside'] }), allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default CollaboratorMediaEntity;
