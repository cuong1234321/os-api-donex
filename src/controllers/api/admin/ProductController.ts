import { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import ProductModel from '@models/products';
import sequelize from '@initializers/sequelize';
import { Transaction } from 'sequelize/types';
import ProductOptionModel from '@models/productOptions';
import ProductCategoryRefModel from '@models/productCategoryRefs';

class ProductController {
  public async create (req: Request, res: Response) {
    try {
      const params = req.parameters.permit(ProductModel.CREATABLE_PARAMETERS).value();
      const result = await sequelize.transaction(async (transaction: Transaction) => {
        const product = await ProductModel.create(params, {
          include: [
            { model: ProductCategoryRefModel, as: 'categoryRefs' },
            { model: ProductOptionModel, as: 'options' },
          ],
          transaction,
        });
        return product;
      });
      sendSuccess(res, { product: result });
    } catch (error) {
      sendError(res, 500, error.message, error);
    }
  }
}

export default new ProductController();
