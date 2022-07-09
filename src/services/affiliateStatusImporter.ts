import _ from 'lodash';
import xlsx from 'node-xlsx';
import { getConsoleLogger } from '@libs/consoleLogger';
import SubOrderModel from '@models/subOrders';
import { Transaction, ValidationError } from 'sequelize';
import CollaboratorModel from '@models/collaborators';
import MoneyWalletChangeModel from '@models/moneyWalletChanges';
import sequelize from '@initializers/sequelize';

const errorLogger = getConsoleLogger('errorLogging');
errorLogger.addContext('requestType', 'HttpLogging');

class AffiliateStatusImporterService {
  public xlsxFile: any;

  constructor (file: any) {
    this.xlsxFile = xlsx.parse(file.buffer);
  }

  static readonly SKIPPED_ROWS = 1;

  static readonly COLUMN_INDEX = {
    SUB_ORDER_CODE: 0,
    AFFILIATE: 17,
  }

  public async executeImport () {
    let sheet = this.xlsxFile[0];
    const attributes: any = [];
    const importeds: any = [];
    const failToImportIndex: {[key: number]: string} = {};
    sheet = sheet.data;
    const rowsToProcess = _.range(AffiliateStatusImporterService.SKIPPED_ROWS, sheet.length);
    for (const processingRow of rowsToProcess) {
      if (sheet[processingRow][AffiliateStatusImporterService.COLUMN_INDEX.AFFILIATE]) {
        attributes.push({
          subOrderCode: sheet[processingRow][AffiliateStatusImporterService.COLUMN_INDEX.SUB_ORDER_CODE],
          referenCode: sheet[processingRow][AffiliateStatusImporterService.COLUMN_INDEX.AFFILIATE],
          index: processingRow + 1,
        });
      }
    }
    const subOrders = await SubOrderModel.scope([
      { method: ['byCode', attributes.map((record: any) => record.subOrderCode)] },
    ]).findAll();
    const sellers = await CollaboratorModel.scope([
      { method: ['byReferral', attributes.map((record: any) => record.referenCode)] },
    ]).findAll();
    const moneyWalletChangeParams = attributes.map((record: any) => {
      const subOrder = subOrders.find((subOrder) => subOrder.code === record.subOrderCode);
      const seller = sellers.find((seller) => seller.referralCode === record.referenCode);
      return {
        ownerId: seller.id,
        type: MoneyWalletChangeModel.TYPE_ENUM.ADD,
        mutableType: MoneyWalletChangeModel.MUTABLE_TYPE.ORDER,
        mutableId: subOrder.id,
        amount: subOrder.affiliateDiscount,
        seller: seller,
        index: record.index,
        subOrder: subOrder,
      };
    });
    for (const moneyWalletChangeParam of moneyWalletChangeParams) {
      try {
        if (moneyWalletChangeParam.subOrder && moneyWalletChangeParam.subOrder.getDataValue('affiliateStatus') === SubOrderModel.AFFILIATE_STATUS.PENDING) {
          const subOrder = await sequelize.transaction(async (transaction: Transaction) => {
            await moneyWalletChangeParam.subOrder.update({ affiliateStatus: SubOrderModel.AFFILIATE_STATUS.CONFIRM }, { validate: true, hooks: false, transaction });
            await MoneyWalletChangeModel.create(moneyWalletChangeParam, { transaction });
          });
          importeds.push(subOrder);
        } else {
          failToImportIndex[moneyWalletChangeParam.index] = `Đơn hàng ${moneyWalletChangeParam.subOrder.getDataValue('code')} đã được đối soát`;
        }
      } catch (error) {
        const errorLogger = getConsoleLogger('errorLogging');
        errorLogger.addContext('requestType', 'ProductImporterLogging');
        errorLogger.error(error);
        if (error instanceof ValidationError) {
          failToImportIndex[moneyWalletChangeParam.index] = error.errors.map((e) => e.message).join('; ');
        }
      }
    }
    return { totalRows: attributes.length, importeds, failToImportIndex };
  }
}
export default AffiliateStatusImporterService;
