import AdmZip from 'adm-zip';
import _ from 'lodash';
import xlsx from 'node-xlsx';
import { getConsoleLogger } from '@libs/consoleLogger';
import ProductMediaModel from '@models/productMedias';
import sequelize from '@initializers/sequelize';
import { Transaction, ValidationError } from 'sequelize';
import ProductModel from '@models/products';
import ProductOptionModel from '@models/productOptions';
import ProductVariantModel from '@models/productVariants';
import MSizeModel from '@models/mSizes';
import ProductCategoryRefModel from '@models/productCategoryRefs';
import VideoUploaderService from './videoUploader';
import ImageUploaderService from './imageUploader';

const errorLogger = getConsoleLogger('errorLogging');
errorLogger.addContext('requestType', 'HttpLogging');

class ProductImporterService {
  public zip: AdmZip
  public entries: AdmZip.IZipEntry[];
  public xlsxEntry: AdmZip.IZipEntry;
  public xlsxFile: any;

  static readonly BOOLEAN_ENUM = { TRUE: 'Có', FALSE: 'Không' }
  static readonly KEY_OPTION_ENUM = { COLOR: 'Màu sắc', SIZE: 'size' }
  static readonly SIZE_TYPE_ENUM: any = { 1: 'children', 2: 'clothes', 3: 'shoes' }
  static readonly SKIPPED_ROWS = 2;
  static readonly COLUMN_INDEX = {
    INDEX: 0,
    SKU: 1,
    CATEGORY: 2,
    COLLECTION: 3,
    GENDER: 4,
    PRODUCT_TYPE: 5,
    MEDIA: 6,
    UNIT: 7,
    NAME: 8,
    FORM: 9,
    SIZE_TYPE: 10,
    MAIN_COLOR: 11,
    SUPPORTING_COLOR: 12,
    OPTION_MEDIA: 13,
    SIZE: 14,
    SKU_VARIANT: 15,
    SKU_NAME: 16,
    BUY_PRICE: 17,
    SELL_PRICE: 18,
    DESCRIPTION: 19,
    SHORT_DESCRIPTION: 20,
    WEIGHT: 21,
    LENGTH: 22,
    WIDTH: 23,
    HEIGHT: 24,
  }

  constructor (path: string) {
    this.zip = new AdmZip(path);
  }

  public async extractZip () {
    this.entries = this.zip.getEntries();
    this.xlsxEntry = this.entries.find((entry) => (entry.entryName.split('.')[entry.entryName.split('.').length - 1] === 'xlsx'));
  }

  public async executeImport () {
    this.xlsxFile = xlsx.parse(this.xlsxEntry.getData());
    const failToImportIndex: {[key: number]: string} = {};
    const productAttributes = await this.readProducts();
    const importedProducts: ProductModel[] = [];
    for (const [index, attribute] of productAttributes.entries()) {
      try {
        await sequelize.transaction(async (transaction: Transaction) => {
          const product = await ProductModel.create(attribute, {
            include: [
              { model: ProductCategoryRefModel, as: 'categoryRefs' },
              { model: ProductOptionModel, as: 'options' },
              { model: ProductVariantModel, as: 'variants' },
              { model: ProductMediaModel, as: 'medias' },
            ],
            transaction,
          });
          await product.updateVariationOptions(transaction);
          importedProducts.push(product);
        });
      } catch (error) {
        const errorLogger = getConsoleLogger('errorLogging');
        errorLogger.addContext('requestType', 'ProductImporterLogging');
        errorLogger.error(error);
        if (error instanceof ValidationError) {
          failToImportIndex[index + 1] = error.errors.map((e) => e.message).join('; ');
        }
      }
    }
    return { totalRows: productAttributes.length, importedProducts, failToImportIndex };
  }

  private async readProducts () {
    const attributes: any = [];
    const sheetData = this.xlsxFile[0].data;
    const rowsToProcess = _.range(ProductImporterService.SKIPPED_ROWS, sheetData.length);
    const sizes = await MSizeModel.findAll();
    const commonCode = [];
    for (const processingRow of rowsToProcess) {
      if (sheetData[processingRow][ProductImporterService.COLUMN_INDEX.INDEX]) {
        if (commonCode.length === 0 || commonCode.reverse()[0] !== sheetData[processingRow][ProductImporterService.COLUMN_INDEX.SKU]) {
          commonCode.push(sheetData[processingRow][ProductImporterService.COLUMN_INDEX.SKU]);
          attributes.push({
            skuCode: sheetData[processingRow][ProductImporterService.COLUMN_INDEX.SKU],
            gender: sheetData[processingRow][ProductImporterService.COLUMN_INDEX.GENDER],
            typeProductId: sheetData[processingRow][ProductImporterService.COLUMN_INDEX.PRODUCT_TYPE],
            unit: sheetData[processingRow][ProductImporterService.COLUMN_INDEX.UNIT],
            name: sheetData[processingRow][ProductImporterService.COLUMN_INDEX.NAME],
            sizeType: ProductImporterService.SIZE_TYPE_ENUM[sheetData[processingRow][ProductImporterService.COLUMN_INDEX.SIZE_TYPE]],
            description: sheetData[processingRow][ProductImporterService.COLUMN_INDEX.DESCRIPTION],
            shortDescription: sheetData[processingRow][ProductImporterService.COLUMN_INDEX.SHORT_DESCRIPTION],
            weight: sheetData[processingRow][ProductImporterService.COLUMN_INDEX.WEIGHT],
            length: sheetData[processingRow][ProductImporterService.COLUMN_INDEX.LENGTH],
            width: sheetData[processingRow][ProductImporterService.COLUMN_INDEX.WIDTH],
            height: sheetData[processingRow][ProductImporterService.COLUMN_INDEX.HEIGHT],
            categoryRefs: new Array(0),
            options: new Array(0),
            variants: new Array(0),
            medias: await this.generateProductMedia(sheetData, processingRow, 'product'),
          });
          if (sheetData[processingRow][ProductImporterService.COLUMN_INDEX.COLLECTION]) {
            const collections: string[] = ((sheetData[processingRow][ProductImporterService.COLUMN_INDEX.COLLECTION]).toString().split(','));
            if (collections.length > 0) {
              const categoryRefs = collections.map((record) => {
                return {
                  productCategoryId: record,
                };
              });
              attributes[attributes.length - 1].categoryRefs = categoryRefs;
            }
          }
          if (sheetData[processingRow][ProductImporterService.COLUMN_INDEX.CATEGORY]) {
            attributes[attributes.length - 1].categoryRefs.push({
              productCategoryId: sheetData[processingRow][ProductImporterService.COLUMN_INDEX.CATEGORY],
            });
          }
          if (sheetData[processingRow][ProductImporterService.COLUMN_INDEX.FORM]) {
            attributes[attributes.length - 1].options.push({
              key: 'form',
              value: sheetData[processingRow][ProductImporterService.COLUMN_INDEX.FORM],
              optionMappingId: attributes[attributes.length - 1].options.length + 1,
            });
          }
        }
        let mainColorId: any = null;
        if (sheetData[processingRow][ProductImporterService.COLUMN_INDEX.MAIN_COLOR]) {
          const uniqueColor = attributes[attributes.length - 1].options.find((record: any) => record.key === ProductOptionModel.KEY_ENUM.COLOR && record.value === parseInt(sheetData[processingRow][ProductImporterService.COLUMN_INDEX.MAIN_COLOR]));
          mainColorId = uniqueColor ? uniqueColor.optionMappingId : attributes[attributes.length - 1].options.length + 1;
          if (!uniqueColor) {
            attributes[attributes.length - 1].options.push({
              key: ProductOptionModel.KEY_ENUM.COLOR,
              value: parseInt(sheetData[processingRow][ProductImporterService.COLUMN_INDEX.MAIN_COLOR]),
              thumbnail: await this.generateProductMedia(sheetData, processingRow, 'productOption'),
              optionMappingId: attributes[attributes.length - 1].options.length + 1,
            });
          }
        }
        let supportingColor: any = null;
        if (sheetData[processingRow][ProductImporterService.COLUMN_INDEX.SUPPORTING_COLOR]) {
          const uniqueColor = attributes[attributes.length - 1].options.find((record: any) => record.key === ProductOptionModel.KEY_ENUM.SUPPORTING_COLOR && record.value === parseInt(sheetData[processingRow][ProductImporterService.COLUMN_INDEX.SUPPORTING_COLOR]));
          supportingColor = uniqueColor ? uniqueColor.optionMappingId : attributes[attributes.length - 1].options.length + 1;
          if (!uniqueColor) {
            attributes[attributes.length - 1].options.push({
              key: ProductOptionModel.KEY_ENUM.SUPPORTING_COLOR,
              value: parseInt(sheetData[processingRow][ProductImporterService.COLUMN_INDEX.SUPPORTING_COLOR]),
              thumbnail: [],
              optionMappingId: attributes[attributes.length - 1].options.length + 1,
            });
          }
        }
        let sizeId = null;
        if (sheetData[processingRow][ProductImporterService.COLUMN_INDEX.SIZE]) {
          const sizeTitle: string = sheetData[processingRow][ProductImporterService.COLUMN_INDEX.SIZE];
          const size = sizes.find((record) => record.code === sizeTitle);
          const uniqueSize = attributes[attributes.length - 1].options.find((record: any) => record.key === ProductOptionModel.KEY_ENUM.SIZE && record.value === (size?.id || 100));
          sizeId = uniqueSize ? uniqueSize.optionMappingId : attributes[attributes.length - 1].options.length + 1;
          if (!uniqueSize) {
            attributes[attributes.length - 1].options.push({
              key: ProductOptionModel.KEY_ENUM.SIZE,
              value: size?.id || 100,
              thumbnail: [],
              optionMappingId: attributes[attributes.length - 1].options.length + 1,
            });
          }
        }
        if (sheetData[processingRow][ProductImporterService.COLUMN_INDEX.SKU_VARIANT]) {
          const optionMappingIds: any = [];
          let mainSku = sheetData[processingRow][ProductImporterService.COLUMN_INDEX.SKU];
          if (mainColorId) {
            optionMappingIds.push(mainColorId);
            mainSku += sheetData[processingRow][ProductImporterService.COLUMN_INDEX.MAIN_COLOR];
          }
          if (supportingColor) {
            optionMappingIds.push(supportingColor);
            mainSku += sheetData[processingRow][ProductImporterService.COLUMN_INDEX.SUPPORTING_COLOR];
          }
          if (sizeId) {
            optionMappingIds.push(sizeId);
          }
          attributes[attributes.length - 1].variants.push({
            optionMappingIds,
            skuCode: sheetData[processingRow][ProductImporterService.COLUMN_INDEX.SKU_VARIANT],
            mainSku,
            name: sheetData[processingRow][ProductImporterService.COLUMN_INDEX.SKU_NAME],
            buyPrice: sheetData[processingRow][ProductImporterService.COLUMN_INDEX.BUY_PRICE] || 0,
            sellPrice: sheetData[processingRow][ProductImporterService.COLUMN_INDEX.SELL_PRICE] || 0,
          });
        }
      }
    }
    return attributes;
  }

  private async generateProductMedia (sheetData: any, processingRow: number, mediaType: string) {
    let fileNames: string[] = [];
    const productMedias: any = [];
    fileNames = mediaType === 'product'
      ? [...fileNames, ...sheetData[processingRow][ProductImporterService.COLUMN_INDEX.MEDIA].split(',')]
      : [...fileNames, ...sheetData[processingRow][ProductImporterService.COLUMN_INDEX.OPTION_MEDIA].split(',')];
    fileNames = fileNames.map((name) => name.trim());
    for (const [index, name] of fileNames.entries()) {
      const file = this.entries.find((entry) => entry.entryName.split('/').reverse()[0] === name);
      if (name.match(/.(jpg|jpeg|png|gif)$/i)) {
        try {
          const source = await ImageUploaderService.singleUpload({ buffer: file.getData(), originalname: name });
          productMedias.push({
            source,
            type: ProductMediaModel.TYPE_ENUM.IMAGE,
            isThumbnail: index === 0,
          });
        } catch (error) {
          continue;
        }
      } else if (name.match(/.(mp4|mov|wmv|avi|mpeg-2)$/i)) {
        try {
          const source = await VideoUploaderService.singleUpload({ buffer: file.getData(), originalname: name });
          productMedias.push({
            source,
            type: ProductMediaModel.TYPE_ENUM.VIDEO,
            isThumbnail: index === 0,
          });
        } catch (error) {
          continue;
        }
      }
    }
    return productMedias;
  }

  private async uploadImage (fileName: string) {
    const file = this.entries.find((entry) => entry.entryName.split('/').reverse()[0] === fileName);
    if (!file) return;
    const source = await ImageUploaderService.singleUpload({
      buffer: file.getData(),
      originalname: fileName,
    });
    return source;
  }
}

export default ProductImporterService;
