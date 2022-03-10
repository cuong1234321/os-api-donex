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
      name: '[ADMIN] CATEGORY',
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
