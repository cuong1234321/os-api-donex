import SubOrderModel from '@models/subOrders';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import XLSX from 'xlsx-js-style';
import settings from '@configs/settings';

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
    ];
    rows.unshift(headers);
    const wsColsOpts = [{ wch: 20 }, { wch: 20 }, { wch: 25 }, { wch: 25 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }];
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
