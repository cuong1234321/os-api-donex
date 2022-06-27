import ProductVerifyCodesEntity from '@entities/productVerifyCodes';
import ProductVerifyCodesInterface from '@interfaces/productVerifyCodes';
import { Model, ModelScopeOptions, ModelValidateOptions, Sequelize, ValidationErrorItem } from 'sequelize';
import { ModelHooks } from 'sequelize/types/lib/hooks';

class ProductVerifyCodeModel extends Model<ProductVerifyCodesInterface> implements ProductVerifyCodesInterface {
  public id: number;
  public skuCode: string;
  public verifyCode: string;
  public appliedAt: Date;

  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly hooks: Partial<ModelHooks<ProductVerifyCodeModel>> = { }

  static readonly validations: ModelValidateOptions = {
    async uniqueVerifyCode () {
      if (this.verifyCode) {
        const existedRecord = await ProductVerifyCodeModel.scope([{ method: ['byVerifyCode', this.verifyCode] }]).findOne();
        if (existedRecord && existedRecord.id !== this.id) {
          throw new ValidationErrorItem('Mã xác minh đã tồn tại.', 'uniqueVerifyCode', 'verifyCode', this.verifyCode);
        }
      }
    },
  }

  static readonly scopes: ModelScopeOptions = {
    byVerifyCode (verifyCode) {
      return {
        where: {
          verifyCode,
        },
      };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(ProductVerifyCodesEntity, {
      hooks: ProductVerifyCodeModel.hooks,
      scopes: ProductVerifyCodeModel.scopes,
      validate: ProductVerifyCodeModel.validations,
      tableName: 'product_verify_codes',
      sequelize,
    });
  }

  public static associate () {}
}

export default ProductVerifyCodeModel;
