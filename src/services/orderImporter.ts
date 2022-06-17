import _ from 'lodash';
import xlsx from 'node-xlsx';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
import MColorModel from '@models/mColors';
import MSizeModel from '@models/mSizes';
import WarehouseModel from '@models/warehouses';
import ProductModel from '@models/products';

class OrderImporterService {
  public xlsxFile: any;

  constructor (file: any) {
    this.xlsxFile = xlsx.parse(file.buffer);
  }

  static readonly SKIPPED_ROWS = 2;

  static readonly ORDER_COLUMN_INDEX = {
    INDEX: 0,
    WAREHOUSE_CODE: 1,
    PRODUCT_CODE: 2,
  }

  public async executeImport () {
    dayjs.extend(customParseFormat);
    let sheet = this.xlsxFile[0];
    const colors = await MColorModel.findAll();
    const sizes = await MSizeModel.findAll();
    const warehouses = await WarehouseModel.findAll();
    const listProducts = await ProductModel.findAll();
    const attributes: any = [];
    const attributeStyles: any = [];
    sheet = sheet.data;
    sheet[1].forEach((record: any, index: number) => {
      if (index > OrderImporterService.ORDER_COLUMN_INDEX.PRODUCT_CODE) {
        const productAttribute = (record.trim().toLowerCase()).split('-');
        if (productAttribute.length === 2) {
          const color = colors.find((color: any) => (color.title).toLowerCase() === (productAttribute[0].trim()));
          if (!color) { return false; }
          const size = sizes.find((size: any) => (size.code).toLowerCase() === (productAttribute[1].trim()));
          if (!size) { return false; }
          const code = color.code + '-' + size.code;
          attributeStyles.push([parseInt(`${index}`), code]);
        } else if (productAttribute.length === 1) {
          const size = sizes.find((size: any) => (size.code).toLowerCase() === (productAttribute[0].trim()));
          if (!size) { return false; }
          attributeStyles.push([parseInt(`${index}`), size.code]);
        }
      }
    });
    const rowsToProcess = _.range(OrderImporterService.SKIPPED_ROWS, sheet.length);
    const productCodes = [];
    for (const processingRow of rowsToProcess) {
      if (sheet[processingRow][OrderImporterService.ORDER_COLUMN_INDEX.INDEX]) {
        const warehouse = warehouses.find((record) => record.code === (sheet[processingRow][OrderImporterService.ORDER_COLUMN_INDEX.WAREHOUSE_CODE]).trim());
        if (!warehouse) { return false; }
        attributes.push({
          warehouseId: warehouse?.id || sheet[processingRow][OrderImporterService.ORDER_COLUMN_INDEX.WAREHOUSE_CODE],
          products: new Array(0),
        });
      }
      if (sheet[processingRow][OrderImporterService.ORDER_COLUMN_INDEX.PRODUCT_CODE]) {
        const productSkuCode = sheet[processingRow][OrderImporterService.ORDER_COLUMN_INDEX.PRODUCT_CODE];
        const product = listProducts.find((record) => record.skuCode === productSkuCode);
        if (!product) { return false; }
        productCodes.push(productSkuCode);
        const products = {
          productCode: productSkuCode,
          variants: new Array(0),
        };
        for (const [key, value] of attributeStyles) {
          if (sheet[processingRow][key]) {
            products.variants.push({
              variantCode: productSkuCode + '-' + value,
              quantity: sheet[processingRow][key],
            });
          }
        }
        attributes[attributes.length - 1].products.push(products);
      }
    }
    const subOrders = await this.mappingSubOrder(productCodes, attributes);
    return subOrders;
  }

  private async mappingSubOrder (productCodes: any, attributes: any) {
    const products = await ProductModel.scope([
      'withThumbnail',
      'withVariantDetails',
      'withPriceRange',
      { method: ['bySkuCode', productCodes] },
    ]).findAll();
    const subOrders = (attributes).map((attribute: any) => {
      const items = (attribute.products).map((record: any) => {
        const product = products.find((product) => product.getDataValue('skuCode') === (record.productCode));
        const variants = product.variants.map((variant) => {
          const variantAttribute = record.variants.find((variantAttribute: any) => variantAttribute.variantCode === variant.skuCode);
          variant.setDataValue('quantity', variantAttribute?.quantity || 0);
          return {
            ...JSON.parse(JSON.stringify(variant)),
          };
        });
        return {
          ...JSON.parse(JSON.stringify(product)),
          quantity: _.sumBy(variants, (variant) => variant.quantity),
          variants: variants,
        };
      });
      return {
        warehouseId: attribute.warehouseId,
        weight: _.sumBy(items, (item: any) => item.weight * item.quantity),
        items: items,
      };
    });
    return subOrders;
  }
}
export default OrderImporterService;
