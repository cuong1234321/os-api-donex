import swaggerJsDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();

const swaggerDefinition = {
  info: {
    title: 'API DONEX-SPORT',
    version: '1.0.0',
    description: 'This is the REST API for project DONEX-SPORT',
  },
  host: process.env.API_HOST,
  basePath: '/api',
  tags: [
    {
      name: '[ADMIN] PRODUCT CATEGORY',
      description: 'Quản lý danh muc',
    },
    {
      name: '[ADMIN] Sessions',
      description: 'Phiên đăng nhập admin',
    },
    {
      name: '[ADMIN] Passwords',
      description: '',
    },
    {
      name: '[ADMIN] Collaborators',
      description: 'Quản lý CTV/DL/NPP',
    },
    {
      name: '[ADMIN] News',
      description: 'Quản lý tin tức',
    },
    {
      name: '[ADMIN] Notifications',
      description: 'Quản lý Thông báo',
    },
    {
      name: '[ADMIN] SELECTION',
      description: 'Quản lý selection',
    },
    {
      name: '[ADMIN] Users',
      description: 'Quản lý user',
    },
    {
      name: '[ADMIN] ADMINS',
      description: 'Quản lý admin',
    },
    {
      name: '[ADMIN] PRODUCT',
      description: 'Quản lý sản phẩm',
    },
    {
      name: '[ADMIN] SYSTEM SETTING',
      description: 'Quản lý cài đặt hệ thống',
    },
    {
      name: '[ADMIN] SALE CAMPAIGN',
      description: 'Quản lý chương trình giảm giá',
    },
    {
      name: '[ADMIN] News Categories',
      description: 'Quản lý Danh mục tin tức',
    },
    {
      name: '[ADMIN] PRODUCT VARIANTS',
      description: 'Quản lý sản phẩm con',
    },
    {
      name: '[USER] Sessions',
      description: 'Phiên đăng nhập user',
    },
    {
      name: '[USER] Accounts',
      description: 'Quản lý tài khoản user',
    },
    {
      name: '[USER] AddressBooks',
      description: 'Quản lý sổ địa chỉ',
    },
    {
      name: '[USER] Authentication Otps',
      description: 'Quản lý mã xác thực tài khoản',
    },
    {
      name: '[USER] Passwords',
      description: 'Quản lý mật khẩu',
    },
    {
      name: '[USER] PRODUCTS',
      description: 'Quản lý sản phẩm',
    },
    {
      name: '[USER] Homepage',
      description: 'Trang chủ',
    },
    {
      name: '[USER] Collaborators',
      description: 'Quan ly ctv/dl',
    },
    {
      name: '[USER] News',
      description: 'Quản lý tin tức',
    },
    {
      name: '[USER] SYSTEM SETTING',
      description: 'Cài đặt hệ thống',
    },
    {
      name: '[USER] News Categories',
      description: 'Danh mục tin tức',
    },
  ],
  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      schema: 'bearer',
      name: 'Authorization',
      in: 'header',
      prefix: 'Bearer ',
    },
  },
  definitions: {},
};

const options = {
  swaggerDefinition,
  explorer: true,
  apis: ['**/*.ts'],
};
export default swaggerJsDoc(options);
