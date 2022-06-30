import _ from 'lodash';
import xlsx from 'node-xlsx';
import ProductVariantModel from '@models/productVariants';

class SaleCampaignImporterService {
  public xlsxFile: any;

  constructor (file: any) {
    this.xlsxFile = xlsx.parse(file.buffer);
  }

  static readonly SKIPPED_ROWS = 4;

  static readonly COLUMN_INDEX = {
    SKU_CODE: 0,
    NAME: 1,
    CATEGORY: 2,
    UNIT: 3,
    BUY_PRICE: 4,
    SELL_PRICE: 5,
    NEW_PRICE: 6,
  }

  public async executeImport () {
    let sheet = this.xlsxFile[0];
    const variants = await ProductVariantModel.scope('withUnit').findAll();
    const attributes: any = [];
    sheet = sheet.data;
    const rowsToProcess = _.range(SaleCampaignImporterService.SKIPPED_ROWS, sheet.length);
    const columnIndex = SaleCampaignImporterService.COLUMN_INDEX;
    for (const processingRow of rowsToProcess) {
      const sheetRow = sheet[processingRow];
      if (sheetRow[SaleCampaignImporterService.COLUMN_INDEX.SKU_CODE]) {
        const variant = variants.find((record) => (record.skuCode).trim().toLowerCase() === (sheetRow[columnIndex.SKU_CODE]).toString().trim().toLowerCase());
        if (variant) {
          variant.setDataValue('newPrice', sheetRow[columnIndex.NEW_PRICE] || 0);
          attributes.push(variant);
        }
      }
    }
    return attributes;
  }
}
export default SaleCampaignImporterService;
