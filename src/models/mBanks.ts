import { Model, ModelScopeOptions, Op, Sequelize } from 'sequelize';
import MBankEntity from '@entities/mBanks';
import MBankInterface from '@interfaces/mBanks';
import BankAccountModel from './bankAccounts';

class MBankModel extends Model<MBankInterface> implements MBankInterface {
  public id: number;
  public code: string;
  public name: string;
  public shortName: string;
  public logo: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly scopes: ModelScopeOptions = {
    byKeyword (keyword) {
      const whereCondition = keyword
        ? {
            [Op.or]: [
              { name: { [Op.like]: `%${keyword || ''}%` } },
              { shortName: { [Op.like]: `%${keyword || ''}%` } },
            ],
          }
        : {};
      return { where: whereCondition };
    },
  }

  public static initialize (sequelize: Sequelize) {
    this.init(MBankEntity, {
      scopes: MBankModel.scopes,
      tableName: 'm_banks',
      sequelize,
    });
  }

  public static associate () {
    this.hasMany(BankAccountModel, { as: 'bankAccounts', foreignKey: 'bankId' });
  }
}

export default MBankModel;
