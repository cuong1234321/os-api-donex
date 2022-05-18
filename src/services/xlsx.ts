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
    const SHIPPING_STATUS_MAPPING: any = { draft: 'Lưu tạm', pending: 'Chờ duyệt' };
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
      { v: warehouseReceipt.totalQuantity, s: { alignment: { horizontal: 'right' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: '', s: { alignment: { horizontal: 'right' }, font: { name: 'Times New Roman' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
      { v: warehouseReceipt.totalPrice, s: { alignment: { horizontal: 'right' }, font: { bold: true, name: 'Times New Roman', sz: '12' }, border: XlsxService.DEFAULT_BORDER_OPTIONS } },
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
        { v: 'Ngày.......tháng.......năm............', s: { alignment: { horizontal: 'center' }, font: { italic: true, name: 'Times New Roman', sz: '12' } } },
      ],
      [
        {},
        { v: 'Người lập phiếu', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' } } },
        { v: 'Người nhận hàng', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' } } },
        { v: 'Thủ kho', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' } } },
        { v: 'Kế toán trưởng', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' } } },
        { v: 'Giám đốc/Thủ trưởng đơn vị', s: { alignment: { horizontal: 'center' }, font: { bold: true, name: 'Times New Roman', sz: '12' } } },
      ],
      [
        {},
        { v: '(Ký, họ tên)', s: { alignment: { horizontal: 'center' }, font: { italic: true, name: 'Times New Roman', sz: '12' } } },
        { v: '(Ký, họ tên)', s: { alignment: { horizontal: 'center' }, font: { italic: true, name: 'Times New Roman', sz: '12' } } },
        { v: '(Ký, họ tên)', s: { alignment: { horizontal: 'center' }, font: { italic: true, name: 'Times New Roman', sz: '12' } } },
        { v: '(Ký, họ tên)', s: { alignment: { horizontal: 'center' }, font: { italic: true, name: 'Times New Roman', sz: '12' } } },
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
    ];
    const wsColsOpts = [{ wch: 10 }, { wch: 20 }, { wch: 50 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 30 }];
    workSheet['!merges'] = merges;
    workSheet['!cols'] = wsColsOpts;
    workSheet['!rows'] = [{}, {}, {}, {}, { hpx: 30 }];
    return await XlsxService.exportToExcel([{ sheetName: 'Báo cáo nhập kho', sheetData: workSheet }]);
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
