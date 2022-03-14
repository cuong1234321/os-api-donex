import { DataTypes } from 'sequelize';

const NewsEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notNull: { msg: 'Tiêu đề không được bỏ trống.' },
      notEmpty: { msg: 'Tiêu đề không được bỏ trống.' },
    },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: { msg: 'Nội dung không được bỏ trống.' },
      notEmpty: { msg: 'Nội dung không được bỏ trống.' },
    },
  },
  thumbnail: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  newsCategoryId: {
    type: DataTypes.NUMBER, allowNull: true,
  },
  publicAt: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.ENUM({ values: ['draft', 'active', 'inactive'] }),
    defaultValue: 'draft',
  },
  deletedAt: {
    type: DataTypes.DATE,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
};

export default NewsEntity;
