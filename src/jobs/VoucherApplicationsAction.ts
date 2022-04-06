import VoucherInterface from '@interfaces/vouchers';
import CollaboratorModel from '@models/collaborators';
import UserModel from '@models/users';
import VoucherApplicationModel from '@models/voucherApplications';
import VoucherModel from '@models/vouchers';

class VoucherApplicationsAction {
  public async SendVoucher () {
    const voucherApplications = await VoucherApplicationModel.scope([
      'isReadyToStart',
    ]).findAll();
    for (const application of voucherApplications) {
      const userVouchers: VoucherInterface[] = [];
      let recipients: any;
      switch (application.beneficiaries) {
        case VoucherApplicationModel.BENEFICIARIES_ENUM.USER:
          recipients = await UserModel.findAll({ attributes: ['id'] });
          break;
        case VoucherApplicationModel.BENEFICIARIES_ENUM.COLLABORATOR:
          recipients = await CollaboratorModel.scope([
            { method: ['byType', VoucherApplicationModel.BENEFICIARIES_ENUM.COLLABORATOR] },
          ]).findAll({ attributes: ['id', 'type'] });
          break;
        case VoucherApplicationModel.BENEFICIARIES_ENUM.AGENCY:
          recipients = await CollaboratorModel.scope([
            { method: ['byType', VoucherApplicationModel.BENEFICIARIES_ENUM.AGENCY] },
          ]).findAll({ attributes: ['id', 'type'] });
          break;
        case VoucherApplicationModel.BENEFICIARIES_ENUM.DISTRIBUTOR:
          recipients = await CollaboratorModel.scope([
            { method: ['byType', VoucherApplicationModel.BENEFICIARIES_ENUM.DISTRIBUTOR] },
          ]).findAll({ attributes: ['id', 'type'] });
          break;
        default:
          break;
      }
      for (const recipient of recipients) {
        userVouchers.push({
          id: undefined,
          voucherApplicationId: application.id,
          recipientId: recipient.id,
          recipientType: recipient.type,
        });
      }
      await VoucherModel.bulkCreate(userVouchers);
      application.update({ isAlreadySent: true }, { validate: false });
    }
  }
}

export default new VoucherApplicationsAction();
