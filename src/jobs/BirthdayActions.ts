import CoinWalletChangeModel from '@models/coinWalletChanges';
import SystemSettingModel from '@models/systemSetting';
import UserModel from '@models/users';
import dayjs from 'dayjs';

class BirthDayAction {
  public async userBirthDay () {
    const systemSetting: any = (await SystemSettingModel.findOrCreate({
      where: { },
      defaults: { id: undefined },
    }))[0];
    const userCoinBonus = systemSetting.bonusCoinUserBirthday || 50;
    const users = await UserModel.scope([
      { method: ['byStatus', UserModel.STATUS_ENUM.ACTIVE] },
      'byBirthDay',
    ]).findAll();
    const userCoinChange: any = users.map((user: any) => {
      return {
        id: undefined,
        userId: user.id,
        type: CoinWalletChangeModel.TYPE_ENUM.ADD,
        mutableType: CoinWalletChangeModel.MUTABLE_TYPE.USER_BIRTH_DAY,
        mutableId: systemSetting.id,
        amount: userCoinBonus,
      };
    });
    await CoinWalletChangeModel.bulkCreate(userCoinChange);
  }

  public async donexBirthDay () {
    const systemSetting: any = (await SystemSettingModel.findOrCreate({
      where: { },
      defaults: { id: undefined },
    }))[0];
    const donexCoinBonus = systemSetting.donexBirthDay ? (systemSetting.bonusCoinDonexBirthday || 50) : 0;
    if (dayjs(systemSetting.donexBirthDay).format('DD/MM') !== dayjs().format('DD/MM')) { return; }
    const users = await UserModel.scope([
      { method: ['byStatus', UserModel.STATUS_ENUM.ACTIVE] },
      'withAlreadyFinishOrder',
    ]).findAll();
    const userCoinChange: any = users.map((user: any) => {
      return {
        id: undefined,
        userId: user.id,
        type: CoinWalletChangeModel.TYPE_ENUM.ADD,
        mutableType: CoinWalletChangeModel.MUTABLE_TYPE.DONEX_BIRTH_DAY,
        mutableId: systemSetting.id,
        amount: donexCoinBonus,
      };
    });
    await CoinWalletChangeModel.bulkCreate(userCoinChange);
  }
}

export default new BirthDayAction();
