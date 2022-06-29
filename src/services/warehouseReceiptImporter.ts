import _ from 'lodash';
import xlsx from 'node-xlsx';
import WarehouseModel from '@models/warehouses';
import ProductVariantModel from '@models/productVariants';

class WarehouseReceiptImporterService {
  public xlsxFile: any;

  constructor (file: any) {
    this.xlsxFile = xlsx.parse(file.buffer);
  }

  static readonly SKIPPED_ROWS = 7;

  static readonly COLUMN_INDEX = {
    INDEX: 0,
    SKU_CODE: 1,
    NAME: 2,
    UNIT: 3,
    WAREHOUSE: 4,
    QUANTITY: 5,
    PRICE: 6,
    TOTAL_PRICE: 7,
  }

  public async executeImport () {
    let sheet = this.xlsxFile[0];
    const warehouses = await WarehouseModel.findAll();
    const variants = await ProductVariantModel.scope('withUnit').findAll();
    const attributes: any = [];
    sheet = sheet.data;
    const rowsToProcess = _.range(WarehouseReceiptImporterService.SKIPPED_ROWS, sheet.length);
    const columnIndex = WarehouseReceiptImporterService.COLUMN_INDEX;
    for (const processingRow of rowsToProcess) {
      const sheetRow = sheet[processingRow];
      if (sheetRow[WarehouseReceiptImporterService.COLUMN_INDEX.INDEX]) {
        const warehouse = warehouses.find((record) => (record.code).trim().toLowerCase() === (sheetRow[columnIndex.WAREHOUSE]).trim().toLowerCase());
        const variant = variants.find((record) => (record.skuCode).trim().toLowerCase() === (sheetRow[columnIndex.SKU_CODE]).trim().toLowerCase());
        if (variant && warehouse) {
          attributes.push({
            skuCode: sheetRow[columnIndex.SKU_CODE],
            name: sheetRow[columnIndex.NAME],
            unit: sheetRow[columnIndex.UNIT],
            warehouseCode: sheetRow[columnIndex.WAREHOUSE],
            quantity: sheetRow[columnIndex.QUANTITY],
            price: sheetRow[columnIndex.PRICE],
            totalPrice: sheetRow[columnIndex.TOTAL_PRICE],
            warehouse: warehouse,
            variant: variant,
          });
        }
      }
    }
    return attributes;
  }
}
export default WarehouseReceiptImporterService;
