import swaggerJsDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();

const swaggerDefinition = {
  info: {
    title: 'API DONEX-ESPORT',
    version: '1.0.0',
    description: 'This is the REST API for project DONEX-ESPORT',
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
