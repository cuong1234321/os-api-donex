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
      name: '[ADMIN] ADMINS',
      description: 'Quản lý admin',
    },
    {
      name: '[ADMIN] ADMIN NOTIFICATIONS',
      description: 'Thông báo của tôi',
    },
    {
      name: '[ADMIN] BANNERS',
      description: 'Quản lý banners',
    },
    {
      name: '[ADMIN] BILL TEMPLATES',
      description: 'Quản lý mẫu hóa đơn',
    },
    {
      name: '[ADMIN] BANK ACCOUNT',
      description: 'Danh sách tài khoản ngân hàng',
    },
    {
      name: '[ADMIN] BANKS',
      description: 'Danh sách ngân hàng',
    },
    {
      name: '[ADMIN] COLLABORATORS',
      description: 'Quản lý CTV/DL/NPP',
    },
    {
      name: '[ADMIN] DASHBOARD',
      description: 'Quản lý dashboard',
    },
    {
      name: '[ADMIN] FEE',
      description: 'tinh gia van chuyen',
    },
    {
      name: '[ADMIN] FEEDBACKS',
      description: 'Quản lý yêu cầu phản hồi',
    },
    {
      name: '[ADMIN] FORMS',
      description: 'Quản lý form',
    },
    {
      name: '[ADMIN] HISTORY EARNED POINT',
      description: 'lịch sử điểm thưởng',
    },
    {
      name: '[ADMIN] NEWS',
      description: 'Quản lý tin tức',
    },
    {
      name: '[ADMIN] Notifications',
      description: 'Quản lý Thông báo',
    },
    {
      name: '[ADMIN] NEWS CATEGORIES',
      description: 'Quản lý Danh mục tin tức',
    },
    {
      name: '[ADMIN] LOOK BOOKS',
      description: 'Quản lý Look Book',
    },
    {
      name: '[ADMIN] MCOLORS',
      description: 'Quản lý màu sắc',
    },
    {
      name: '[ADMIN] MSIZES',
      description: 'Quản lý size',
    },
    {
      name: '[ADMIN] ORDERS',
      description: 'Quản lý đơn hàng',
    },
    {
      name: '[ADMIN] PRODUCT CATEGORY',
      description: 'Quản lý danh muc',
    },
    {
      name: '[ADMIN] PASSWORDS',
      description: 'Thông tin mật khẩu',
    },
    {
      name: '[ADMIN] PRODUCT',
      description: 'Quản lý sản phẩm',
    },
    {
      name: '[ADMIN] PRODUCT VARIANTS',
      description: 'Quản lý sản phẩm con',
    },
    {
      name: '[ADMIN] PRODUCT VERIFY CODE',
      description: 'Quản lý mã xác minh sản phẩm',
    },
    {
      name: '[ADMIN] POPUPS',
      description: 'Quản lý popup',
    },
    {
      name: '[ADMIN] PERMISSION GROUPS',
      description: 'Quản lý danh sách quyền',
    },
    {
      name: '[ADMIN] PICK SHIFT',
      description: 'Quản lý thời gian giao hàng của giao hàng nhanh',
    },
    {
      name: '[ADMIN] PRINT PARTNER ORDER',
      description: 'Xuất báo cáo hóa đơn',
    },
    {
      name: '[ADMIN] RANK',
      description: 'Quản lý rank',
    },
    {
      name: '[ADMIN] ROLES',
      description: 'Quản lý phân quyền',
    },
    {
      name: '[ADMIN] REPORTS',
      description: 'Quản lý bao cao',
    },
    {
      name: '[ADMIN] SELLER LEVELS',
      description: 'Quản lý cấp CTV/DL/NPP',
    },
    {
      name: '[ADMIN] SESSIONS',
      description: 'Phiên đăng nhập admin',
    },
    {
      name: '[ADMIN] SELECTION',
      description: 'Quản lý selection',
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
      name: '[ADMIN] SUB ORDERS',
      description: 'Quản lý đơn hàng con',
    },
    {
      name: '[ADMIN] SHIPPING PARTNERS',
      description: 'Don vi Van Chuyen',
    },
    {
      name: '[ADMIN] SIZE GUIDES',
      description: 'Quản lý sizes',
    },
    {
      name: '[ADMIN] USERS',
      description: 'Quản lý user',
    },
    {
      name: '[ADMIN] UPLOAD',
      description: 'Upload file',
    },
    {
      name: '[ADMIN] VOUCHER APPLICATION',
      description: 'Quản lý Chương trình khuyến mãi',
    },
    {
      name: '[ADMIN] WAREHOUSES',
      description: 'Quản lý kho hàng',
    },
    {
      name: '[ADMIN] WAREHOUSE RECEIPTS',
      description: 'Quản lý kho nhập',
    },
    {
      name: '[ADMIN] WAREHOUSE EXPORTS',
      description: 'Quản lý kho xuất',
    },
    {
      name: '[ADMIN] WAREHOUSE TRANSFERS',
      description: 'Quản lý chuyển kho',
    },
    {
      name: '[ADMIN] WAREHOUSE REPORT',
      description: 'Báo cáo tồn kho',
    },
    {
      name: '[ADMIN] WITHDRAWAL REQUESTS',
      description: 'Danh sách yêu cầu rút tiền',
    },
    {
      name: '[USER] ACCOUNTS',
      description: 'Quản lý tài khoản user',
    },
    {
      name: '[USER] ADDRESS BOOKS',
      description: 'Quản lý sổ địa chỉ',
    },
    {
      name: '[USER] AUTHENTICATION OTPS',
      description: 'Quản lý mã xác thực tài khoản',
    },
    {
      name: '[USER] BANK ACCOUNT',
      description: 'Danh sách tài khoản ngân hàng',
    },
    {
      name: '[USER] BANNERS',
      description: 'Danh sách banners',
    },
    {
      name: '[USER] COLLABORATORS',
      description: 'Danh sách cửa hàng',
    },
    {
      name: '[USER] COIN WALLET CHANGES',
      description: 'Lich xử xu',
    },
    {
      name: '[USER] CARTS',
      description: 'Giỏ hàng user',
    },
    {
      name: '[USER] FEE',
      description: 'Tính giá van chuyen',
    },
    {
      name: '[USER] FEEDBACKS',
      description: 'Quản lý yêu cầu phản hồi',
    },
    {
      name: '[USER] HOMEPAGE',
      description: 'Trang chủ',
    },
    {
      name: '[USER] HISTORY EARNED POINT',
      description: 'lịch sử điểm thưởng',
    },
    {
      name: '[USER] NEWS',
      description: 'Quản lý tin tức',
    },
    {
      name: '[USER] NEWS CATEGORIES',
      description: 'Danh mục tin tức',
    },
    {
      name: '[USER] LOOK BOOKS',
      description: 'Quản lý Look Book',
    },
    {
      name: '[USER] ORDER',
      description: 'Quản lý đơn hàng',
    },
    {
      name: '[USER] PASSWORDS',
      description: 'Quản lý mật khẩu',
    },
    {
      name: '[USER] POPUPS',
      description: 'Quản lý popup',
    },
    {
      name: '[USER] PRODUCT FAVORITE',
      description: 'Quản lý sản phẩm yêu thích',
    },
    {
      name: '[USER] PRODUCTS',
      description: 'Quản lý sản phẩm',
    },
    {
      name: '[USER] RATING',
      description: 'Đánh giá sản phẩm',
    },
    {
      name: '[USER] RANKS',
      description: 'cấp bậc user',
    },
    {
      name: '[USER] SUB ORDER',
      description: 'Quản lý đơn hàng nhỏ',
    },
    {
      name: '[USER] SYSTEM SETTING',
      description: 'Cài đặt hệ thống',
    },
    {
      name: '[USER] SESSIONS',
      description: 'Phiên đăng nhập user',
    },
    {
      name: '[USER] SHIPPING PARTNERS',
      description: 'Don vi Van Chuyen',
    },
    {
      name: '[USER] SIZE GUIDES',
      description: 'size',
    },
    {
      name: '[USER] USERS',
      description: 'Thông tin user',
    },
    {
      name: '[USER] UPLOAD',
      description: 'Upload file',
    },
    {
      name: '[USER] USER VOUCHERS',
      description: 'Voucher user',
    },
    {
      name: '[COLLABORATOR] COLLABORATORS',
      description: 'Quan ly ctv/dl',
    },
    {
      name: '[SELLER] FEE',
      description: 'tinh gia van chuyen',
    },
    {
      name: '[COLLABORATOR] SHIPPING PARTNERS',
      description: 'Don vi Van Chuyen',
    },
    {
      name: '[SELLER] ADDRESS BOOKS',
      description: 'Quản lý sổ địa chỉ',
    },
    {
      name: '[SELLER] BANK ACCOUNT',
      description: 'Danh sách tài khoản ngân hàng',
    },
    {
      name: '[SELLER] LOOK BOOKS',
      description: 'Quản lý Look Book',
    },
    {
      name: '[SELLER] SUB ORDERS',
      description: 'Quản lý đơn hàng con',
    },
    {
      name: '[SELLER] SESSIONS',
      description: 'Phiên đăng nhập CTV/DL/NPP',
    },
    {
      name: '[SELLER] SELLERS',
      description: 'Cập nhật CTV/DL/NPP',
    },
    {
      name: '[SELLER] PASSWORDS',
      description: 'Quản lý mật khẩu',
    },
    {
      name: '[SELLER] PRODUCT',
      description: 'Quản lý sản phẩm',
    },
    {
      name: '[SELLER] SELLER BANKS',
      description: 'Quản lý tài khoản ngân hàng của seller',
    },
    {
      name: '[SELLER] SELLER NOTIFICATIONS',
      description: 'Thông báo của tôi',
    },
    {
      name: '[SELLER] SIZE GUIDES',
      description: 'size',
    },
    {
      name: '[SELLER] WITHDRAWAL REQUESTS',
      description: 'Danh sách yêu cầu rút tiền',
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
