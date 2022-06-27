import _ from 'lodash';
import xlsx from 'node-xlsx';
import { getConsoleLogger } from '@libs/consoleLogger';
import ProductVerifyCodeModel from '@models/productVerifyCodes';
import { ValidationError } from 'sequelize';

const errorLogger = getConsoleLogger('errorLogging');
errorLogger.addContext('requestType', 'HttpLogging');

class ProductVerifyImporterService {
  public xlsxFile: any;

  constructor (file: any) {
    this.xlsxFile = xlsx.parse(file.buffer);
  }

  static readonly SKIPPED_ROWS = 1;

  static readonly COLUMN_INDEX = {
    INDEX: 0,
    SKU_CODE: 1,
    VERIFY_CODE: 2,
  }

  public async executeImport () {
    let sheet = this.xlsxFile[0];
    const attributes: any = [];
    const importedCodes: ProductVerifyCodeModel[] = [];
    const failToImportIndex: {[key: number]: string} = {};
    sheet = sheet.data;
    const rowsToProcess = _.range(ProductVerifyImporterService.SKIPPED_ROWS, sheet.length);
    for (const processingRow of rowsToProcess) {
      if (sheet[processingRow][ProductVerifyImporterService.COLUMN_INDEX.INDEX]) {
        attributes.push({
          skuCode: sheet[processingRow][ProductVerifyImporterService.COLUMN_INDEX.SKU_CODE],
          verifyCode: sheet[processingRow][ProductVerifyImporterService.COLUMN_INDEX.VERIFY_CODE],
        });
      }
    }
    for (const [index, attribute] of attributes.entries()) {
      try {
        const productVerifyCodes = await ProductVerifyCodeModel.create(attribute);
        importedCodes.push(productVerifyCodes);
      } catch (error) {
        const errorLogger = getConsoleLogger('errorLogging');
        errorLogger.addContext('requestType', 'ProductImporterLogging');
        errorLogger.error(error);
        if (error instanceof ValidationError) {
          failToImportIndex[index + 1] = error.errors.map((e) => e.message).join('; ');
        }
      }
    }
    return { totalRows: attributes.length, importedCodes, failToImportIndex };
  }
}
export default ProductVerifyImporterService;
