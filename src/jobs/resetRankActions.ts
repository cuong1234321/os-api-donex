import UserModel from '@models/users';
import { Op } from 'sequelize/types';

class ResetRankAction {
  public async resetRankUser () {
    const users = await UserModel.scope([
      'withUpgradeRankOutOfDate',
    ]).findAll();
    const userIds = users.map((user: any) => user.id);
    await UserModel.update({ rank: UserModel.RANK_ENUM.BASIC, upgradeRankAt: null }, { where: { id: { [Op.in]: userIds } } });
  }
}

export default new ResetRankAction();
