import CoinWalletChangeModel from '@models/coinWalletChanges';
import UserModel from '@models/users';

class ResetCoinAction {
  public async latOrderOutOfDate () {
    const users = await UserModel.scope([
      'lastOrderOutOfDate', 'isNotBlackList',
      { method: ['byMoreThanCoinReward', 0] },
    ]).findAll();
    const coinWalletChangeParams = [];
    if (users.length === 0) { return; }
    for (const user of users) {
      coinWalletChangeParams.push({
        id: undefined,
        userId: user.id,
        type: CoinWalletChangeModel.TYPE_ENUM.SUBTRACT,
        mutableType: CoinWalletChangeModel.MUTABLE_TYPE.ORDER_OUT_OF_DATE,
        mutableId: null,
        amount: 0 - user.coinReward,
      });
    }
    await CoinWalletChangeModel.bulkCreate(coinWalletChangeParams);
  }
}

export default new ResetCoinAction();
