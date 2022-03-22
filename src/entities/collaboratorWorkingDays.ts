import { DataTypes } from 'sequelize';

const CollaboratorWorkingDayEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  collaboratorId: {
    type: DataTypes.INTEGER, allowNull: false,
  },
  workingDay: {
    type: DataTypes.ENUM({ values: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] }),
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default CollaboratorWorkingDayEntity;
