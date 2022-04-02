import { DataTypes } from 'sequelize';

const RankEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  title: {
    type: DataTypes.STRING(255), allowNull: false, defaultValue: 'VIP',
  },
  orderValueFrom: {
    type: DataTypes.INTEGER, allowNull: true, defaultValue: 0,
  },
  dateEarnDiscount: {
    type: DataTypes.STRING(255),
    allowNull: true,
    set (value: any[]) {
      if (value.length) {
        const dateEarnDiscounts = JSON.stringify(value);
        this.setDataValue('dateEarnDiscount', dateEarnDiscounts);
      }
    },
    get (): (string)[] {
      if (!this.getDataValue('dateEarnDiscount')) return;
      return JSON.parse(this.getDataValue('dateEarnDiscount'));
    },
  },
  description: {
    type: DataTypes.TEXT, allowNull: true,
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

export default RankEntity;
