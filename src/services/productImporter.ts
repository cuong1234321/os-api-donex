import AdmZip from 'adm-zip';
import _ from 'lodash';
import xlsx from 'node-xlsx';
import { getConsoleLogger } from '@libs/consoleLogger';
import ProductMediaModel from '@models/productMedias';
import ProductCategoryModel from '@models/productCategories';
import sequelize from '@initializers/sequelize';
import { Transaction, ValidationError } from 'sequelize';
import ProductModel from '@models/products';
import ProductOptionModel from '@models/productOptions';
import ProductVariantModel from '@models/productVariants';
import MColorModel from '@models/mColors';
import MSizeModel from '@models/mSizes';
import ProductCategoryRefModel from '@models/productCategoryRefs';
import MFormModel from '@models/mForms';
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
  static readonly SIZE_TYPE_ENUM = { CHILDREN: 'Size trẻ em', CLOTHES: 'Size quần áo', SHOES: 'Size giày' }
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
    PRODUCT_OPTION_COLOR: 11,
    PRODUCT_OPTION_COLOR_VALUE: 12,
    PRODUCT_OPTION_COLOR_IMAGE: 13,
    PRODUCT_OPTION_SIZE: 14,
    PRODUCT_OPTION_SIZE_VALUE: 15,
    PRODUCT_OPTION_SIZE_IMAGE: 16,
    SKU_VARIANT: 17,
    SKU_NAME: 18,
    SKU_OPTION_COLOR: 19,
    SKU_OPTION_SIZE: 20,
    BUY_PRICE: 21,
    SELL_PRICE: 22,
    DESCRIPTION: 23,
    SHORT_DESCRIPTION: 24,
    WEIGHT: 25,
    LENGTH: 26,
    WIDTH: 27,
    HEIGHT: 28,
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
    const categories = await ProductCategoryModel.findAll();
    const colors = await MColorModel.findAll();
    const sizes = await MSizeModel.findAll();
    for (const processingRow of rowsToProcess) {
      if (sheetData[processingRow][ProductImporterService.COLUMN_INDEX.INDEX]) {
        attributes.push({
          skuCode: sheetData[processingRow][ProductImporterService.COLUMN_INDEX.SKU],
          gender: categories.find((category: any) => sheetData[processingRow][ProductImporterService.COLUMN_INDEX.GENDER].trim() === category.name && category.type === ProductCategoryModel.TYPE_ENUM.GENDER)?.id,
          typeProductId: categories.find((category: any) => sheetData[processingRow][ProductImporterService.COLUMN_INDEX.PRODUCT_TYPE].trim() === category.name && category.type === ProductCategoryModel.TYPE_ENUM.PRODUCT_TYPE)?.id,
          unit: sheetData[processingRow][ProductImporterService.COLUMN_INDEX.UNIT],
          name: sheetData[processingRow][ProductImporterService.COLUMN_INDEX.NAME],
          sizeType: this.mappingSizeType(sheetData[processingRow][ProductImporterService.COLUMN_INDEX.SIZE_TYPE]),
          description: sheetData[processingRow][ProductImporterService.COLUMN_INDEX.DESCRIPTION],
          shortDescription: sheetData[processingRow][ProductImporterService.COLUMN_INDEX.SHORT_DESCRIPTION],
          weight: sheetData[processingRow][ProductImporterService.COLUMN_INDEX.WEIGHT],
          length: sheetData[processingRow][ProductImporterService.COLUMN_INDEX.LENGTH],
          width: sheetData[processingRow][ProductImporterService.COLUMN_INDEX.WIDTH],
          height: sheetData[processingRow][ProductImporterService.COLUMN_INDEX.HEIGHT],
          categoryRefs: new Array(0),
          options: new Array(0),
          variants: new Array(0),
          medias: await this.generateProductMedia(sheetData, processingRow),
        });
      }
      if (sheetData[processingRow][ProductImporterService.COLUMN_INDEX.COLLECTION]) {
        const collections = (sheetData[processingRow][ProductImporterService.COLUMN_INDEX.COLLECTION].trim().split(','));
        const categoryCollections = categories.filter((category: any) => collections.includes(category.name) && category.type === ProductCategoryModel.TYPE_ENUM.COLLECTION);
        if (categoryCollections.length > 0) {
          const categoryRefs = categoryCollections.map((record) => {
            return {
              productCategoryId: record.id,
            };
          });
          attributes[attributes.length - 1].categoryRefs = categoryRefs;
        }
      }
      if (sheetData[processingRow][ProductImporterService.COLUMN_INDEX.CATEGORY]) {
        const category = categories.find((record: any) => sheetData[processingRow][ProductImporterService.COLUMN_INDEX.CATEGORY].trim() === record.name && record.type === ProductCategoryModel.TYPE_ENUM.NONE);
        if (category) {
          attributes[attributes.length - 1].categoryRefs.push({
            productCategoryId: category.id,
          });
        }
      }
      if (sheetData[processingRow][ProductImporterService.COLUMN_INDEX.PRODUCT_OPTION_COLOR_VALUE]) {
        const value = sheetData[processingRow][ProductImporterService.COLUMN_INDEX.PRODUCT_OPTION_COLOR_VALUE].trim();
        const valueId = colors.find((record: any) => record.title === value)?.id;
        if (valueId) {
          attributes[attributes.length - 1].options.push({
            key: 'color',
            value: valueId,
            thumbnail: await this.uploadImage(sheetData[processingRow][ProductImporterService.COLUMN_INDEX.PRODUCT_OPTION_COLOR_IMAGE]),
            optionMappingId: valueId * ProductImporterService.COLUMN_INDEX.PRODUCT_OPTION_COLOR_VALUE,
          });
        }
      }
      if (sheetData[processingRow][ProductImporterService.COLUMN_INDEX.PRODUCT_OPTION_SIZE_VALUE]) {
        const value = sheetData[processingRow][ProductImporterService.COLUMN_INDEX.PRODUCT_OPTION_SIZE_VALUE].trim();
        const valueId = sizes.find((record: any) => record.code === value)?.id;
        if (valueId) {
          attributes[attributes.length - 1].options.push({
            key: 'size',
            value: valueId,
            thumbnail: await this.uploadImage(sheetData[processingRow][ProductImporterService.COLUMN_INDEX.PRODUCT_OPTION_SIZE_IMAGE]),
            optionMappingId: valueId * ProductImporterService.COLUMN_INDEX.PRODUCT_OPTION_SIZE_VALUE,
          });
        }
      }
      if (sheetData[processingRow][ProductImporterService.COLUMN_INDEX.FORM]) {
        const value = sheetData[processingRow][ProductImporterService.COLUMN_INDEX.FORM].trim();
        const valueId = (await MFormModel.findOne({ where: { title: value } }))?.id;
        if (valueId) {
          attributes[attributes.length - 1].options.push({
            key: 'form',
            value: valueId,
            optionMappingId: valueId * ProductImporterService.COLUMN_INDEX.FORM,
          });
        }
      }
      if (sheetData[processingRow][ProductImporterService.COLUMN_INDEX.SKU_VARIANT]) {
        const colorValue = sheetData[processingRow][ProductImporterService.COLUMN_INDEX.SKU_OPTION_COLOR]?.trim();
        const sizeValue = sheetData[processingRow][ProductImporterService.COLUMN_INDEX.SKU_OPTION_SIZE]?.trim();
        const colorValueId = colors.find((record: any) => record.title === colorValue)?.id || null;
        const sizeValueId = sizes.find((record: any) => record.code === sizeValue)?.id || null;

        attributes[attributes.length - 1].variants.push({
          skuCode: sheetData[processingRow][ProductImporterService.COLUMN_INDEX.SKU_VARIANT],
          name: sheetData[processingRow][ProductImporterService.COLUMN_INDEX.SKU_NAME],
          buyPrice: sheetData[processingRow][ProductImporterService.COLUMN_INDEX.BUY_PRICE] || 0,
          sellPrice: sheetData[processingRow][ProductImporterService.COLUMN_INDEX.SELL_PRICE] || 0,
          optionMappingIds: [colorValueId * ProductImporterService.COLUMN_INDEX.PRODUCT_OPTION_COLOR_VALUE, sizeValueId * ProductImporterService.COLUMN_INDEX.PRODUCT_OPTION_SIZE_VALUE],
        });
      }
    }
    return attributes;
  }

  private mappingSizeType (sizeType: string) {
    if (!sizeType) return undefined;
    if (sizeType === ProductImporterService.SIZE_TYPE_ENUM.CLOTHES) return ProductModel.SIZE_TYPE_ENUM.CLOTHES;
    if (sizeType === ProductImporterService.SIZE_TYPE_ENUM.CHILDREN) return ProductModel.SIZE_TYPE_ENUM.CHILDREN;
    if (sizeType === ProductImporterService.SIZE_TYPE_ENUM.SHOES) return ProductModel.SIZE_TYPE_ENUM.SHOES;
  }

  private async generateProductMedia (sheetData: any, processingRow: number) {
    let fileNames: string[] = [];
    const productMedias: any = [];
    fileNames = [...fileNames, ...sheetData[processingRow][ProductImporterService.COLUMN_INDEX.MEDIA].split(',')];
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
