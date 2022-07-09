import SubOrderModel from '@models/subOrders';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import XLSX from 'xlsx-js-style';
import settings from '@configs/settings';
import _ from 'lodash';
import OrderItemModel from '@models/orderItems';
import WarehouseReceiptVariantModel from '@models/warehouseReceiptVariants';

class XlsxService {
  static readonly DEFAULT_BORDER_OPTIONS = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
  public static async downloadListOrders (subOrders: SubOrderModel[]) {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    const PAYMENT_METHOD_STATUS_MAPPING: any = { pending: 'Chưa thanh toán', complete: 'Đã thanh toán' };
    const SHIPPING_STATUS_MAPPING: any = {
      draft: 'Lưu tạm',
      pending: 'Chờ duyệt',
      waitingToTransfer: 'Chờ lấy hàng',
      delivery: 'Đang giao hàng',
      waitingToPay: 'Chờ thanh toán',
      delivered: 'Đã giao hàng',
      fail: 'Giao hàng thất bại',
      cancel: 'Hủy đơn',
      reject: 'Từ chối',
      refund: 'Đơn hàng trả lại',
    };
    const SALE_CHANNEL_MAPPING: any = { facebook: 'Facebook', lazada: 'Lazada', shopee: 'Shopee', tiki: 'Tiki', wholesale: 'Bán sỉ', retail: 'Bán lẻ', other: 'Kênh khác' };
    const PAYMENT_METHOD_MAPPING: any = { banking: 'banking', COD: 'COD', vnPay: 'vnPay', wallet: 'Ví' };
    const rows = subOrders.map((subOrder, index: any) => {
      const order: any = subOrder.getDataValue('order');
      return [
        { v: subOrder.code, s: { alignment: { horizontal: 'left' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: PAYMENT_METHOD_STATUS_MAPPING[subOrder.paymentStatus], s: { alignment: { horizontal: 'left' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: SHIPPING_STATUS_MAPPING[subOrder.status], s: { alignment: { horizontal: 'left' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: SALE_CHANNEL_MAPPING[subOrder.getDataValue('order').saleChannel], s: { alignment: { horizontal: 'center' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: order.getDataValue('createAbleName') || '', s: { alignment: { horizontal: 'center' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: order.getDataValue('shippingFullName'), s: { alignment: { horizontal: 'center' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: subOrder.subTotal, s: { alignment: { horizontal: 'center' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: subOrder.subTotal + (subOrder.shippingFee || 0) - (subOrder.deposit || 0) - (subOrder.shippingDiscount || 0), s: { alignment: { horizontal: 'center' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: subOrder.pickUpAt ? dayjs(subOrder.pickUpAt).tz('Asia/Ho_Chi_Minh').format('DD-MM-YYYY') : '', s: { alignment: { horizontal: 'center' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: order.getDataValue('shippingPhoneNumber'), s: { alignment: { horizontal: 'center' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: dayjs(subOrder.createdAt).tz('Asia/Ho_Chi_Minh').format('DD-MM-YYYY'), s: { alignment: { horizontal: 'center' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: subOrder.shippingFee, s: { alignment: { horizontal: 'center' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: subOrder.shippingType, s: { alignment: { horizontal: 'center' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: subOrder.shippingCode || '', s: { alignment: { horizontal: 'center' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: subOrder.orderPartnerCode || '', s: { alignment: { horizontal: 'center' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: PAYMENT_METHOD_MAPPING[order.getDataValue('paymentMethod')], s: { alignment: { horizontal: 'center' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: subOrder.shippingFeeMisa || 0, s: { alignment: { horizontal: 'center' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: order.referralCode || '', s: { alignment: { horizontal: 'left' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      ];
    });
    const headers = [
      { v: 'Mã đơn', s: { alignment: { horizontal: 'center' }, font: { bold: true }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Trạng thái tt', s: { alignment: { horizontal: 'center' }, font: { bold: true }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Trạng thái vc', s: { alignment: { horizontal: 'center' }, font: { bold: true }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Kênh bán hàng', s: { alignment: { horizontal: 'center' }, font: { bold: true }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Nhân viên bán hàng', s: { alignment: { horizontal: 'center' }, font: { bold: true }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Người nhận', s: { alignment: { horizontal: 'center' }, font: { bold: true }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Tổng thanh toán', s: { alignment: { horizontal: 'center' }, font: { bold: true }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Còn phải thu', s: { alignment: { horizontal: 'center' }, font: { bold: true }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Ngày giao hàng', s: { alignment: { horizontal: 'center' }, font: { bold: true }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'SĐT người nhận', s: { alignment: { horizontal: 'center' }, font: { bold: true }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Ngày tạo đơn', s: { alignment: { horizontal: 'center' }, font: { bold: true }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Phí GH thu khách', s: { alignment: { horizontal: 'center' }, font: { bold: true }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Đơn vị vận chuyển', s: { alignment: { horizontal: 'center' }, font: { bold: true }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Mã vận đơn', s: { alignment: { horizontal: 'center' }, font: { bold: true }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Mã đơn đối tác', s: { alignment: { horizontal: 'center' }, font: { bold: true }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'PTTT', s: { alignment: { horizontal: 'center' }, font: { bold: true }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Phí giao hàng', s: { alignment: { horizontal: 'center' }, font: { bold: true }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Đơn affiliate', s: { alignment: { horizontal: 'center' }, font: { bold: true }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
    ];
    rows.unshift(headers);
    const wsColsOpts = [{ wch: 20 }, { wch: 20 }, { wch: 25 }, { wch: 25 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }];
    const workSheet = XlsxService.appendSingleSheet(rows, wsColsOpts);
    return await XlsxService.exportToExcel([{ sheetName: 'Báo cáo', sheetData: workSheet }]);
  }

  public static async downloadWarehouseReceipt (warehouseReceipt: any) {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    const VNnum2words = require('vn-num2words');
    warehouseReceipt = JSON.parse(JSON.stringify(warehouseReceipt));
    const companyName = [
      [{ v: 'Công ty TNHH DONEXPRO Việt Nam', s: { alignment: { horizontal: 'left' }, font: { bold: true, name: 'Times New Roman' } } }],
    ];
    const dateVN = dayjs(warehouseReceipt.importDate).tz('Asia/Ho_Chi_Minh');
    const information = [
      [{ v: 'PHIẾU NHẬP KHO', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '18' } } }],
      [{ v: `Ngày ${dateVN.format('DD')} tháng ${dateVN.format('MM')} năm ${dateVN.format('YYYY')}`, s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' } } }],
      [{ v: `Số: ${settings.warehouseReceiptCode}${String(warehouseReceipt.id).padStart(6, '0')}`, s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' } } }],
      [{ v: `Đối tượng: ${warehouseReceipt?.importAbleName || ''}`, s: { alignment: { horizontal: 'left' }, font: { bold: false, name: 'Times New Roman', sz: '12' } } }],
      [{ v: `Người giao: ${warehouseReceipt?.deliverer || ''}`, s: { alignment: { horizontal: 'left' }, font: { bold: false, name: 'Times New Roman', sz: '12' } } }],
      [{ v: `Diễn giải: ${warehouseReceipt?.note || ''}`, s: { alignment: { horizontal: 'left' }, font: { bold: false, name: 'Times New Roman', sz: '12' } } }],
    ];
    const rows = (warehouseReceipt.warehouseReceiptVariants).map((record: any, index: any) => {
      return [
        { v: index + 1, s: { alignment: { horizontal: 'center' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record.variant.skuCode, s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record.variant.name, s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record.variant.product.unit, s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: parseInt(record.quantity, 10).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: parseInt(record.price, 10).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: parseInt(record.totalPrice, 10).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      ];
    });
    rows.push([
      { v: '', s: { border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: '', s: { border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Tổng', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: '', s: { border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: parseInt(warehouseReceipt.totalQuantity, 10).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: '', s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: parseInt(warehouseReceipt.totalPrice, 10).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
    ],
    [
      { v: `Số tiền viết bằng chữ: ${VNnum2words(warehouseReceipt.totalPrice)} đồng`, s: { bold: true, alignment: { horizontal: 'left' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: '', s: { border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: '', s: { border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: '', s: { border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: '', s: { border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: '', s: { border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: '', s: { border: XlsxService.DEFAULT_BORDER_OPTIONS } },
    ]);
    const headers = [
      { v: 'STT', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Mã SKU', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Tên hàng hóa', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'ĐVT', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Số lượng', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Đơn giá', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Thành tiền', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
    ];
    rows.unshift(headers);
    const footers = [
      [
        {},
        {},
        {},
        {},
        {},
        {},
        { v: 'Ngày.......tháng.......năm............', s: { alignment: { horizontal: 'center' }, font: { italic: true, name: 'Times New Roman', sz: '12' } } },
      ],
      [
        {},
        { v: 'Người lập phiếu', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' } } },
        { v: 'Người nhận hàng', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' } } },
        { v: 'Thủ kho', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' } } },
        { v: 'Kế toán trưởng', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' } } },
        {},
        { v: 'Giám đốc/Thủ trưởng đơn vị', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' } } },
      ],
      [
        {},
        { v: '(Ký, họ tên)', s: { alignment: { horizontal: 'center' }, font: { italic: true, name: 'Times New Roman', sz: '12' } } },
        { v: '(Ký, họ tên)', s: { alignment: { horizontal: 'center' }, font: { italic: true, name: 'Times New Roman', sz: '12' } } },
        { v: '(Ký, họ tên)', s: { alignment: { horizontal: 'center' }, font: { italic: true, name: 'Times New Roman', sz: '12' } } },
        { v: '(Ký, họ tên)', s: { alignment: { horizontal: 'center' }, font: { italic: true, name: 'Times New Roman', sz: '12' } } },
        {},
        { v: '(Ký, họ tên)', s: { alignment: { horizontal: 'center' }, font: { italic: true, name: 'Times New Roman', sz: '12' } } },
      ],
    ];
    const workSheet = XLSX.utils.aoa_to_sheet(companyName);
    XLSX.utils.sheet_add_aoa(workSheet, information, { origin: 'A5' });
    XLSX.utils.sheet_add_aoa(workSheet, rows, { origin: 'A12' });
    XLSX.utils.sheet_add_aoa(workSheet, footers, { origin: `A${rows.length + 14}` });
    const merges = [
      { s: { r: 4, c: 0 }, e: { r: 4, c: 6 } },
      { s: { r: 5, c: 0 }, e: { r: 5, c: 6 } },
      { s: { r: 6, c: 0 }, e: { r: 6, c: 6 } },
      { s: { r: 7, c: 0 }, e: { r: 7, c: 6 } },
      { s: { r: 8, c: 0 }, e: { r: 8, c: 6 } },
      { s: { r: 9, c: 0 }, e: { r: 9, c: 6 } },
      { s: { r: 10 + rows.length, c: 0 }, e: { r: 10 + rows.length, c: 6 } },
      { s: { r: 14 + rows.length, c: 4 }, e: { r: 14 + rows.length, c: 5 } },
      { s: { r: 15 + rows.length, c: 4 }, e: { r: 15 + rows.length, c: 5 } },
    ];
    const wsColsOpts = [{ wch: 10 }, { wch: 20 }, { wch: 50 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 30 }];
    workSheet['!merges'] = merges;
    workSheet['!cols'] = wsColsOpts;
    workSheet['!rows'] = [{}, {}, {}, {}, { hpx: 30 }];
    return await XlsxService.exportToExcel([{ sheetName: 'Báo cáo nhập kho', sheetData: workSheet }]);
  }

  public static async downloadWarehouseExport (warehouseExport: any) {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    const VNnum2words = require('vn-num2words');
    warehouseExport = JSON.parse(JSON.stringify(warehouseExport));
    const companyName = [
      [{ v: 'Công ty TNHH DONEXPRO Việt Nam', s: { alignment: { horizontal: 'left' }, font: { bold: true, name: 'Times New Roman' } } }],
    ];
    const dateVN = dayjs(warehouseExport.importDate).tz('Asia/Ho_Chi_Minh');
    const information = [
      [{ v: 'PHIẾU XUẤT KHO', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '18' } } }],
      [{ v: `Ngày ${dateVN.format('DD')} tháng ${dateVN.format('MM')} năm ${dateVN.format('YYYY')}`, s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' } } }],
      [{ v: `Số: ${settings.warehouseExportCode}${String(warehouseExport.id).padStart(6, '0')}`, s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' } } }],
      [{ v: `Đối tượng: ${warehouseExport?.exportAbleName || ''}`, s: { alignment: { horizontal: 'left' }, font: { bold: false, name: 'Times New Roman', sz: '12' } } }],
      [{ v: `Người giao: ${warehouseExport?.deliverer || ''}`, s: { alignment: { horizontal: 'left' }, font: { bold: false, name: 'Times New Roman', sz: '12' } } }],
      [{ v: `Diễn giải: ${warehouseExport?.note || ''}`, s: { alignment: { horizontal: 'left' }, font: { bold: false, name: 'Times New Roman', sz: '12' } } }],
    ];
    const rows = (warehouseExport.warehouseExportVariants).map((record: any, index: any) => {
      return [
        { v: index + 1, s: { alignment: { horizontal: 'center' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record?.variant?.skuCode || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record?.variant?.name || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record?.variant?.product?.unit || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: parseInt(record.quantity, 10).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: parseInt(record.price, 10).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: parseInt(record.totalPrice, 10).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      ];
    });
    rows.push([
      { v: '', s: { border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: '', s: { border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Tổng', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: '', s: { border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: parseInt(warehouseExport.totalQuantity, 10).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: '', s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: parseInt(warehouseExport.totalPrice, 10).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
    ],
    [
      { v: `Số tiền viết bằng chữ: ${VNnum2words(warehouseExport.totalPrice)} đồng`, s: { bold: true, alignment: { horizontal: 'left' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: '', s: { border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: '', s: { border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: '', s: { border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: '', s: { border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: '', s: { border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: '', s: { border: XlsxService.DEFAULT_BORDER_OPTIONS } },
    ]);
    const headers = [
      { v: 'STT', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Mã SKU', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Tên hàng hóa', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'ĐVT', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Số lượng', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Đơn giá', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Thành tiền', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
    ];
    rows.unshift(headers);
    const footers = [
      [
        {},
        {},
        {},
        {},
        {},
        {},
        { v: 'Ngày.......tháng.......năm............', s: { alignment: { horizontal: 'center' }, font: { italic: true, name: 'Times New Roman', sz: '12' } } },
      ],
      [
        {},
        { v: 'Người lập phiếu', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' } } },
        { v: 'Người nhận hàng', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' } } },
        { v: 'Thủ kho', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' } } },
        { v: 'Kế toán trưởng', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' } } },
        {},
        { v: 'Giám đốc/Thủ trưởng đơn vị', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' } } },
      ],
      [
        {},
        { v: '(Ký, họ tên)', s: { alignment: { horizontal: 'center' }, font: { italic: true, name: 'Times New Roman', sz: '12' } } },
        { v: '(Ký, họ tên)', s: { alignment: { horizontal: 'center' }, font: { italic: true, name: 'Times New Roman', sz: '12' } } },
        { v: '(Ký, họ tên)', s: { alignment: { horizontal: 'center' }, font: { italic: true, name: 'Times New Roman', sz: '12' } } },
        { v: '(Ký, họ tên)', s: { alignment: { horizontal: 'center' }, font: { italic: true, name: 'Times New Roman', sz: '12' } } },
        {},
        { v: '(Ký, họ tên)', s: { alignment: { horizontal: 'center' }, font: { italic: true, name: 'Times New Roman', sz: '12' } } },
      ],
    ];
    const workSheet = XLSX.utils.aoa_to_sheet(companyName);
    XLSX.utils.sheet_add_aoa(workSheet, information, { origin: 'A5' });
    XLSX.utils.sheet_add_aoa(workSheet, rows, { origin: 'A12' });
    XLSX.utils.sheet_add_aoa(workSheet, footers, { origin: `A${rows.length + 14}` });
    const merges = [
      { s: { r: 4, c: 0 }, e: { r: 4, c: 6 } },
      { s: { r: 5, c: 0 }, e: { r: 5, c: 6 } },
      { s: { r: 6, c: 0 }, e: { r: 6, c: 6 } },
      { s: { r: 7, c: 0 }, e: { r: 7, c: 6 } },
      { s: { r: 8, c: 0 }, e: { r: 8, c: 6 } },
      { s: { r: 9, c: 0 }, e: { r: 9, c: 6 } },
      { s: { r: 10 + rows.length, c: 0 }, e: { r: 10 + rows.length, c: 6 } },
      { s: { r: 14 + rows.length, c: 4 }, e: { r: 14 + rows.length, c: 5 } },
      { s: { r: 15 + rows.length, c: 4 }, e: { r: 15 + rows.length, c: 5 } },
    ];
    const wsColsOpts = [{ wch: 10 }, { wch: 20 }, { wch: 50 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 30 }];
    workSheet['!merges'] = merges;
    workSheet['!cols'] = wsColsOpts;
    workSheet['!rows'] = [{}, {}, {}, {}, { hpx: 30 }];
    return await XlsxService.exportToExcel([{ sheetName: 'Báo cáo xuất kho', sheetData: workSheet }]);
  }

  public static async downloadWarehouseTransfer (warehouseTransfer: any) {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    warehouseTransfer = JSON.parse(JSON.stringify(warehouseTransfer));
    const companyName = [
      [{ v: 'Công ty TNHH DONEXPRO Việt Nam', s: { alignment: { horizontal: 'left' }, font: { bold: true, name: 'Times New Roman' } } }],
    ];
    const dateVN = dayjs(warehouseTransfer.transferDate).tz('Asia/Ho_Chi_Minh');
    const information = [
      [{ v: 'PHIẾU CHUYỂN KHO', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '18' } } }],
      [{ v: `Ngày ${dateVN.format('DD')} tháng ${dateVN.format('MM')} năm ${dateVN.format('YYYY')}`, s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' } } }],
      [{ v: `Số: ${settings.warehouseTransferCode}${String(warehouseTransfer.id).padStart(6, '0')}`, s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' } } }],
      [{ v: `Người vận chuyển: ${warehouseTransfer?.deliverer || ''}`, s: { alignment: { horizontal: 'left' }, font: { bold: false, name: 'Times New Roman', sz: '12' } } }],
      [{ v: `Diễn giải: ${warehouseTransfer?.note || ''}`, s: { alignment: { horizontal: 'left' }, font: { bold: false, name: 'Times New Roman', sz: '12' } } }],
    ];
    const rows = (warehouseTransfer.warehouseTransferVariants).map((record: any, index: any) => {
      return [
        { v: index + 1, s: { alignment: { horizontal: 'center' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record.variant.skuCode, s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record.variant.name, s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: warehouseTransfer.fromWarehouseName, s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: warehouseTransfer.toWarehouseName, s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record.variant.product.unit, s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: parseInt(record.quantity, 10).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: parseInt(record.price, 10).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: parseInt(record.totalPrice, 10).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      ];
    });
    rows.push([
      { v: '', s: { border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: '', s: { border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Tổng', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: '', s: { border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: '', s: { border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: '', s: { border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: parseInt(warehouseTransfer.totalQuantity, 10).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: '', s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: parseInt(warehouseTransfer.totalPrice, 10).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
    ]);
    const headers = [
      { v: 'STT', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Mã SKU', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Tên hàng hóa', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Kho xuất', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Kho nhập', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'ĐVT', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Số lượng', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Đơn giá', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Thành tiền', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
    ];
    rows.unshift(headers);
    const footers = [
      [
        {},
        {},
        {},
        {},
        {},
        {},
        { v: 'Ngày.......tháng.......năm............', s: { alignment: { horizontal: 'center' }, font: { italic: true, name: 'Times New Roman', sz: '12' } } },
      ],
      [
        {},
        { v: 'Người lập phiếu', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' } } },
        { v: 'Người Người yêu cầu', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' } } },
        { v: 'Thủ kho xuất', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' } } },
        { v: 'Người vận chuyển', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' } } },
        {},
        { v: 'Thủ kho nhập', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' } } },
      ],
      [
        {},
        { v: '(Ký, họ tên)', s: { alignment: { horizontal: 'center' }, font: { italic: true, name: 'Times New Roman', sz: '12' } } },
        { v: '(Ký, họ tên)', s: { alignment: { horizontal: 'center' }, font: { italic: true, name: 'Times New Roman', sz: '12' } } },
        { v: '(Ký, họ tên)', s: { alignment: { horizontal: 'center' }, font: { italic: true, name: 'Times New Roman', sz: '12' } } },
        { v: '(Ký, họ tên)', s: { alignment: { horizontal: 'center' }, font: { italic: true, name: 'Times New Roman', sz: '12' } } },
        {},
        { v: '(Ký, họ tên)', s: { alignment: { horizontal: 'center' }, font: { italic: true, name: 'Times New Roman', sz: '12' } } },
      ],
    ];
    const workSheet = XLSX.utils.aoa_to_sheet(companyName);
    XLSX.utils.sheet_add_aoa(workSheet, information, { origin: 'A5' });
    XLSX.utils.sheet_add_aoa(workSheet, rows, { origin: 'A12' });
    XLSX.utils.sheet_add_aoa(workSheet, footers, { origin: `A${rows.length + 14}` });
    const merges = [
      { s: { r: 4, c: 0 }, e: { r: 4, c: 8 } },
      { s: { r: 5, c: 0 }, e: { r: 5, c: 8 } },
      { s: { r: 6, c: 0 }, e: { r: 6, c: 8 } },
      { s: { r: 7, c: 0 }, e: { r: 7, c: 8 } },
      { s: { r: 8, c: 0 }, e: { r: 8, c: 8 } },
      { s: { r: 9, c: 0 }, e: { r: 9, c: 8 } },
      { s: { r: rows.length + 13, c: 6 }, e: { r: rows.length + 13, c: 7 } },
      { s: { r: rows.length + 14, c: 6 }, e: { r: rows.length + 14, c: 7 } },
      { s: { r: rows.length + 14, c: 4 }, e: { r: rows.length + 14, c: 5 } },
      { s: { r: rows.length + 15, c: 4 }, e: { r: rows.length + 15, c: 5 } },
      { s: { r: rows.length + 15, c: 6 }, e: { r: rows.length + 15, c: 7 } },
    ];
    const wsColsOpts = [{ wch: 10 }, { wch: 20 }, { wch: 50 }, { wch: 25 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 20 }];
    workSheet['!merges'] = merges;
    workSheet['!cols'] = wsColsOpts;
    workSheet['!rows'] = [{}, {}, {}, {}, { hpx: 30 }];
    return await XlsxService.exportToExcel([{ sheetName: 'Báo cáo nhập kho', sheetData: workSheet }]);
  }

  public static async downloadAdmins (admins: any) {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    const GENDER_MAPPING: any = { male: 'nam', female: 'nữ', other: 'khác' };
    admins = JSON.parse(JSON.stringify(admins));
    const title = [
      [{ v: 'DANH SÁCH NHÂN VIÊN', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '18' } } }],
    ];
    const rows = admins.map((record: any, index: any) => {
      return [
        { v: index + 1, s: { alignment: { horizontal: 'center' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record.fullName || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record.dateOfBirth ? dayjs(record.dateOfBirth).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY') : '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record.phoneNumber, s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record.username || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: GENDER_MAPPING[record.gender], s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record.email, s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record?.role?.title || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record.note || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      ];
    });
    const headers = [
      { v: 'STT', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Họ và tên', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Ngày sinh', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Số điện thoại', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Tài khoản', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Giới tính', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Email', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Vai trò', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Ghi chú', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
    ];
    rows.unshift(headers);
    const workSheet = XLSX.utils.aoa_to_sheet([[]]);
    XLSX.utils.sheet_add_aoa(workSheet, title, { origin: 'D2' });
    XLSX.utils.sheet_add_aoa(workSheet, rows, { origin: 'A5' });
    const wsColsOpts = [{ wch: 5 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 10 }, { wch: 25 }, { wch: 20 }, { wch: 30 }];
    const merges = [
      { s: { r: 1, c: 3 }, e: { r: 1, c: 6 } },
    ];
    workSheet['!cols'] = wsColsOpts;
    workSheet['!rows'] = [{}, { hpx: 30 }];
    workSheet['!merges'] = merges;
    return await XlsxService.exportToExcel([{ sheetName: 'Danh sách nhân viên', sheetData: workSheet }]);
  }

  public static async downloadListWarehouseExports (warehouseExports: any) {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    const STATUS_MAPPING: any = { pending: 'Chờ xử lý', waitingToTransfer: 'Chờ giao hàng', complete: 'Thành công', cancel: 'Hủy' };
    const TYPE_MAPPING: any = { sell: 'Phiếu xuất kho bán hàng', others: 'Phiếu xuất kho khác' };
    warehouseExports = JSON.parse(JSON.stringify(warehouseExports));
    const title = [
      [{ v: 'DANH SÁCH PHIẾU XUẤT KHO', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '18' } } }],
    ];
    const rows = warehouseExports.map((record: any, index: any) => {
      return [
        { v: record.exportDate ? dayjs(record.exportDate).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY') : '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: settings.warehouseExportCode + _.padStart(record.id.toString(), 6, '0'), s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record?.exportAbleName || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record?.totalPrice || '', s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record?.note || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: STATUS_MAPPING[record.status] || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: TYPE_MAPPING[record.type] || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record?.adminName || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      ];
    });
    const headers = [
      { v: 'Ngày', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Mã phiếu', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Khách hàng', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Tổng tiền', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Ghi chú', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Trạng thái', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Loại phiếu xuất', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Người tạo', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
    ];
    rows.unshift(headers);
    const workSheet = XLSX.utils.aoa_to_sheet([[]]);
    XLSX.utils.sheet_add_aoa(workSheet, title, { origin: 'E2' });
    XLSX.utils.sheet_add_aoa(workSheet, rows, { origin: 'A5' });
    const wsColsOpts = [{ wch: 15 }, { wch: 20 }, { wch: 25 }, { wch: 20 }, { wch: 30 }, { wch: 15 }, { wch: 25 }, { wch: 20 }];
    workSheet['!cols'] = wsColsOpts;
    workSheet['!rows'] = [{}, { hpx: 30 }];
    return await XlsxService.exportToExcel([{ sheetName: 'Danh sách phiếu xuất kho', sheetData: workSheet }]);
  }

  public static async downloadListWarehouseReceipts (warehouseReceipts: any) {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    const TYPE_MAPPING: any = { orderRefund: 'Phiếu nhập kho đơn hàng trả lại', newGoods: 'Phiếu nhập hàng mới', others: 'Phiếu nhập kho khác' };
    warehouseReceipts = JSON.parse(JSON.stringify(warehouseReceipts));
    const title = [
      [{ v: 'DANH SÁCH PHIẾU NHẬP KHO', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '18' } } }],
    ];
    const rows = warehouseReceipts.map((record: any, index: any) => {
      return [
        { v: record.importDate ? dayjs(record.importDate).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY') : '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: settings.warehouseReceiptCode + _.padStart(record.id.toString(), 6, '0'), s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record?.importAbleName || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record?.totalPrice || '', s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record?.note || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: TYPE_MAPPING[record.type] || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record?.adminName || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      ];
    });
    const headers = [
      { v: 'Ngày', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Mã phiếu', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Khách hàng', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Tổng tiền', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Ghi chú', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Loại phiếu nhập', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Người tạo', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
    ];
    rows.unshift(headers);
    const workSheet = XLSX.utils.aoa_to_sheet([[]]);
    XLSX.utils.sheet_add_aoa(workSheet, title, { origin: 'D2' });
    XLSX.utils.sheet_add_aoa(workSheet, rows, { origin: 'A5' });
    const wsColsOpts = [{ wch: 15 }, { wch: 20 }, { wch: 25 }, { wch: 20 }, { wch: 30 }, { wch: 25 }, { wch: 25 }];
    workSheet['!cols'] = wsColsOpts;
    workSheet['!rows'] = [{}, { hpx: 30 }];
    return await XlsxService.exportToExcel([{ sheetName: 'Danh sách phiếu nhập kho', sheetData: workSheet }]);
  }

  public static async downloadUsers (users: any) {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    const GENDER_MAPPING: any = { male: 'nam', female: 'nữ', other: 'khác' };
    const STATUS_MAPPING: any = { active: 'Đang hoạt động', inactive: 'tạm khoá' };
    users = JSON.parse(JSON.stringify(users));
    const title = [
      [{ v: 'DANH SÁCH NGƯỜI DÙNG', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '18' } } }],
    ];
    const rows = users.map((record: any, index: any) => {
      return [
        { v: index + 1, s: { alignment: { horizontal: 'center' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record.fullName || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record.phoneNumber, s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record.gender ? GENDER_MAPPING[record.gender] : '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record.email || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: STATUS_MAPPING[record.status] || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      ];
    });
    const headers = [
      { v: 'STT', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Khách hàng', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Số điện thoại', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Giới tính', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Email', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Trạng thái', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
    ];
    rows.unshift(headers);
    const workSheet = XLSX.utils.aoa_to_sheet([[]]);
    XLSX.utils.sheet_add_aoa(workSheet, title, { origin: 'D2' });
    XLSX.utils.sheet_add_aoa(workSheet, rows, { origin: 'A5' });
    const wsColsOpts = [{ wch: 5 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 30 }, { wch: 20 }];
    workSheet['!cols'] = wsColsOpts;
    workSheet['!rows'] = [{}, { hpx: 30 }];
    return await XlsxService.exportToExcel([{ sheetName: 'Danh sách người dùng', sheetData: workSheet }]);
  }

  public static async downloadSellers (sellers: any) {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    const STATUS_MAPPING: any = { pending: 'Chờ duyệt', active: 'Đang hoạt động', inactive: 'tạm khoá', rejected: 'Từ chối' };
    const TYPE_MAPPING: any = { collaborator: 'Cộng tác viên', agency: 'Đại lý', distributor: 'Nhà phân phối' };
    sellers = JSON.parse(JSON.stringify(sellers));
    const title = [
      [{ v: 'DANH SÁCH CTV/DL/NPP', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '18' } } }],
    ];
    const rows = sellers.map((record: any, index: any) => {
      return [
        { v: index + 1, s: { alignment: { horizontal: 'center' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record.fullName || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: TYPE_MAPPING[record.type], s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record.phoneNumber, s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record.email || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: !record.parentId ? 'Có' : 'Không', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: STATUS_MAPPING[record.status] || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      ];
    });
    const headers = [
      { v: 'STT', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'ĐL/CTV/NPP', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Vai trò', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Số điện thoại', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Email', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Thuộc Donex', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Trạng thái', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
    ];
    rows.unshift(headers);
    const workSheet = XLSX.utils.aoa_to_sheet([[]]);
    XLSX.utils.sheet_add_aoa(workSheet, title, { origin: 'D2' });
    XLSX.utils.sheet_add_aoa(workSheet, rows, { origin: 'A5' });
    const wsColsOpts = [{ wch: 5 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 30 }, { wch: 15 }, { wch: 20 }];
    workSheet['!cols'] = wsColsOpts;
    workSheet['!rows'] = [{}, { hpx: 30 }];
    return await XlsxService.exportToExcel([{ sheetName: 'Danh sách người dùng', sheetData: workSheet }]);
  }

  public static async downloadAdminIncomes (admins: any) {
    admins = JSON.parse(JSON.stringify(admins));
    const title = [
      [{ v: 'BÁO CÁO DOANH THU NHÂN VIÊN', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '18' } } }],
    ];
    const rows = admins.map((record: any, index: any) => {
      return [
        { v: index + 1, s: { alignment: { horizontal: 'center' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record.fullName || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record.phoneNumber, s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: parseInt(record.orderQuantity || 0).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: parseInt(record.productQuantity || 0).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: parseInt(record.totalDiscount || 0, 10).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: parseInt(record.totalListedPrice || 0, 10).toLocaleString('de-DE') || 0, s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      ];
    });
    const headers = [
      { v: 'STT', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Nhân viên', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Số điện thoại', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Số đơn', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Số sản phẩm', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Chiết khấu', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Doanh thu', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
    ];
    rows.unshift(headers);
    const workSheet = XLSX.utils.aoa_to_sheet([[]]);
    XLSX.utils.sheet_add_aoa(workSheet, title, { origin: 'A2' });
    XLSX.utils.sheet_add_aoa(workSheet, rows, { origin: 'A5' });
    const wsColsOpts = [{ wch: 5 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 20 }];
    const merges = [
      { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } },
    ];
    workSheet['!cols'] = wsColsOpts;
    workSheet['!rows'] = [{}, { hpx: 30 }];
    workSheet['!merges'] = merges;
    return await XlsxService.exportToExcel([{ sheetName: 'Báo cáo', sheetData: workSheet }]);
  }

  public static async downloadSellerIncomes (sellers: any) {
    sellers = JSON.parse(JSON.stringify(sellers));
    const title = [
      [{ v: 'BÁO CÁO DOANH THU CTV/DL/NPP', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '18' } } }],
    ];
    const rows = sellers.map((record: any, index: any) => {
      return [
        { v: index + 1, s: { alignment: { horizontal: 'center' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record.fullName || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record.phoneNumber, s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: parseInt(record.totalDiscount || 0, 10).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: parseInt(record.totalListedPrice || 0, 10).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: parseInt(record.accumulatedMoney || 0, 10).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      ];
    });
    const headers = [
      { v: 'STT', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Khách hàng', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Số điện thoại', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Chiết khấu', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Doanh thu', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Quỹ', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
    ];
    rows.unshift(headers);
    const workSheet = XLSX.utils.aoa_to_sheet([[]]);
    XLSX.utils.sheet_add_aoa(workSheet, title, { origin: 'A2' });
    XLSX.utils.sheet_add_aoa(workSheet, rows, { origin: 'A5' });
    const wsColsOpts = [{ wch: 5 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 20 }];
    const merges = [
      { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } },
    ];
    workSheet['!cols'] = wsColsOpts;
    workSheet['!rows'] = [{}, { hpx: 30 }];
    workSheet['!merges'] = merges;
    return await XlsxService.exportToExcel([{ sheetName: 'Báo cáo', sheetData: workSheet }]);
  }

  public static async downloadWarehouseIncomes (sellers: any) {
    sellers = JSON.parse(JSON.stringify(sellers));
    const title = [
      [{ v: 'BÁO CÁO DOANH THU KHO HÀNG', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '18' } } }],
    ];
    const rows = sellers.map((record: any, index: any) => {
      return [
        { v: index + 1, s: { alignment: { horizontal: 'center' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record.name || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: parseInt(record.orderQuantity || 0, 10).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: parseInt(record.totalDiscount || 0, 10).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: parseInt(record.totalListedPrice || 0, 10).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      ];
    });
    const headers = [
      { v: 'STT', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Kho hàng', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Số lượng khách', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Chiết khấu', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Doanh thu', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
    ];
    rows.unshift(headers);
    const workSheet = XLSX.utils.aoa_to_sheet([[]]);
    XLSX.utils.sheet_add_aoa(workSheet, title, { origin: 'A2' });
    XLSX.utils.sheet_add_aoa(workSheet, rows, { origin: 'A5' });
    const wsColsOpts = [{ wch: 5 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 20 }];
    const merges = [
      { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
    ];
    workSheet['!cols'] = wsColsOpts;
    workSheet['!rows'] = [{}, { hpx: 30 }];
    workSheet['!merges'] = merges;
    return await XlsxService.exportToExcel([{ sheetName: 'Báo cáo', sheetData: workSheet }]);
  }

  public static async downloadWarehouseReports (warehouseReports: any) {
    warehouseReports = JSON.parse(JSON.stringify(warehouseReports));
    const title = [
      [{ v: 'BÁO CÁO TỒN KHO', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '18' } } }],
    ];
    const rows = warehouseReports.map((record: any, index: any) => {
      return [
        { v: index + 1, s: { alignment: { horizontal: 'center' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record?.warehouse?.name || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record?.variants?.skuCode || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record?.variants?.name || '', s: { alignment: { horizontal: 'left', wrapText: true }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record?.variants?.unit || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record?.variants?.productCategoryName || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: ((record?.totalQuantityImport || 0) + (record?.quantityTransferImport || 0) - (record?.totalQuantityExport || 0) - (record?.quantityTransferExport || 0) - (record?.quantityMovingTransfer || 0)).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: ((record?.totalQuantityImport || 0) + (record?.quantityTransferImport || 0)).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: ((record?.totalQuantityExport || 0) + (record?.quantityTransferExport || 0) + (record?.quantityMovingTransfer || 0)).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: ((record?.quantityMovingTransfer || 0)).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: ((record?.quantityComingTransfer || 0)).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      ];
    });
    const headers = [
      { v: 'STT', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Kho hàng', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Mã SKU', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Tên sản phẩm', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Đơn vị', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Danh mục', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Số lượng tồn', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Số lượng nhập', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Số lượng xuất', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Đang chuyển đi', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Sắp nhận về', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
    ];
    rows.unshift(headers);
    const workSheet = XLSX.utils.aoa_to_sheet([[]]);
    XLSX.utils.sheet_add_aoa(workSheet, title, { origin: 'A2' });
    XLSX.utils.sheet_add_aoa(workSheet, rows, { origin: 'A5' });
    const wsColsOpts = [{ wch: 5 }, { wch: 15 }, { wch: 15 }, { wch: 30 }, { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
    const merges = [
      { s: { r: 1, c: 0 }, e: { r: 1, c: 10 } },
    ];
    workSheet['!cols'] = wsColsOpts;
    workSheet['!rows'] = [{}, { hpx: 30 }];
    workSheet['!merges'] = merges;
    return await XlsxService.exportToExcel([{ sheetName: 'Báo cáo', sheetData: workSheet }]);
  }

  public static async downloadListOrderItems (orderItems: OrderItemModel[]) {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    const title = [
      [{ v: 'DANH SÁCH SẢN PHẨM', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '18' } } }],
    ];
    const rows = orderItems.map((record: OrderItemModel, index: number) => {
      return [
        { v: index + 1, s: { alignment: { horizontal: 'center' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record.variant.skuCode || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record.variant.name || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record.variant.getDataValue('unit') || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: (record.getDataValue('totalQuantity') || 0).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: (record.sellingPrice || 0).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: (record.getDataValue('totalQuantity') * record.sellingPrice || 0).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      ];
    });
    const headers = [
      { v: 'STT', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Mã SKU', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Tên hàng hóa', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Đơn vị tính', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Số lượng', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Đơn giá', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Tiền hàng', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
    ];
    rows.unshift(headers);
    const workSheet = XLSX.utils.aoa_to_sheet([[]]);
    XLSX.utils.sheet_add_aoa(workSheet, title, { origin: 'D2' });
    XLSX.utils.sheet_add_aoa(workSheet, rows, { origin: 'A5' });
    const wsColsOpts = [{ wch: 5 }, { wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 20 }];
    workSheet['!cols'] = wsColsOpts;
    workSheet['!rows'] = [{}, { hpx: 30 }];
    return await XlsxService.exportToExcel([{ sheetName: 'Danh sách sản phẩm', sheetData: workSheet }]);
  }

  public static async downloadReturnOrderReports (warehouseReceiptVariants: WarehouseReceiptVariantModel[]) {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    const title = [
      [{ v: 'BÁO CÁO PHIẾU TRẢ HÀNG', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '18' } } }],
    ];
    const rows = warehouseReceiptVariants.map((record: WarehouseReceiptVariantModel, index: number) => {
      return [
        { v: index + 1, s: { alignment: { horizontal: 'center' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record?.warehouseReceipt?.subOrder?.code || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record?.warehouseReceipt?.subOrder?.createdAt ? dayjs(record?.warehouseReceipt?.subOrder?.createdAt).tz('Asia/Ho_Chi_Minh').format('HH:mm DD/MM/YYYY') : '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record?.warehouseReceipt?.subOrder?.getDataValue('shippingFullName') || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record?.getDataValue('skuCode') || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record?.getDataValue('name') || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: record?.getDataValue('unit') || '', s: { alignment: { horizontal: 'left' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: (record.quantity || 0).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: (record.price || 0).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
        { v: (record.totalPrice || 0).toLocaleString('de-DE'), s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      ];
    });
    const headers = [
      { v: 'STT', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Mã ĐH trả lại', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Ngày bán', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Khách hàng', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Mã SKU', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Tên sản phẩm', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Đơn vị', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Số lượng', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Giá bán', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Doanh thu', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
    ];
    rows.unshift(headers);
    const workSheet = XLSX.utils.aoa_to_sheet([[]]);
    XLSX.utils.sheet_add_aoa(workSheet, title, { origin: 'A2' });
    XLSX.utils.sheet_add_aoa(workSheet, rows, { origin: 'A5' });
    const wsColsOpts = [{ wch: 5 }, { wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
    const merges = [
      { s: { r: 1, c: 0 }, e: { r: 1, c: 9 } },
    ];
    workSheet['!cols'] = wsColsOpts;
    workSheet['!rows'] = [{}, { hpx: 30 }];
    workSheet['!merges'] = merges;
    return await XlsxService.exportToExcel([{ sheetName: 'Danh sách sản phẩm', sheetData: workSheet }]);
  }

  private static appendSingleSheet (data: any, wsColsOpts: XLSX.ColInfo[] = undefined) {
    const workSheetData = [
      ...data,
    ];
    const workSheet = XLSX.utils.aoa_to_sheet(workSheetData);
    workSheet['!cols'] = wsColsOpts;
    return workSheet;
  }

  private static async exportToExcel (workSheets: {sheetName: string, sheetData: XLSX.WorkSheet}[]) {
    const workBook = XLSX.utils.book_new();
    const writeOpts: XLSX.WritingOptions = {
      type: 'buffer',
      cellDates: true,
      bookSST: false,
      bookType: 'xlsx',
      compression: false,
    };
    for (const sheet of workSheets) {
      XLSX.utils.book_append_sheet(workBook, sheet.sheetData, sheet.sheetName);
    }
    const buffer = XLSX.write(workBook, writeOpts);
    return buffer;
  }
}

export default XlsxService;
