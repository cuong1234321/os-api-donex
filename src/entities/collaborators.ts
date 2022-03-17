import { DataTypes } from 'sequelize';

const collaboratorEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validator: {
      notNull: { msg: 'UserId không được bỏ trống.' },
    },
  },
  parentId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  type: {
    type: DataTypes.ENUM({ values: ['collaborator', 'agency', 'distributor'] }),
    defaultValue: 'collaborator',
  },
  status: {
    type: DataTypes.ENUM({ values: ['pending', 'active', 'inactive', 'rejected'] }),
    defaultValue: 'pending',
  },
  paperProofFront: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  paperProofBack: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true,
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

export default collaboratorEntity;
