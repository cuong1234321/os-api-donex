import { Model, ModelScopeOptions, Op, Sequelize, Transaction } from 'sequelize';
import CollaboratorWorkingDayEntity from '@entities/collaboratorWorkingDays';
import CollaboratorWorkingDayInterface from '@interfaces/collaboratorWorkingDays';

class CollaboratorWorkingDayModel extends Model<CollaboratorWorkingDayInterface> implements CollaboratorWorkingDayInterface {
  public id: number;
  public collaboratorId: number;
  public workingDay: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  static readonly WORKING_DAY_ENUM = { MONDAY: 'monday', TUESDAY: 'tuesday', WEDNESDAY: 'wednesday', THURSDAY: 'thursday', FRIDAY: 'friday', SATURDAY: 'saturday', SUNDAY: 'sunday' }
  static readonly UPDATABLE_ON_DUPLICATE_PARAMETERS = ['id', 'collaboratorId', 'workingDay']

  static readonly scopes: ModelScopeOptions = { }

  public static initialize (sequelize: Sequelize) {
    this.init(CollaboratorWorkingDayEntity, {
      tableName: 'collaborator_working_days',
      scopes: CollaboratorWorkingDayModel.scopes,
      sequelize,
    });
  }

  public static async updateListCollaboratorWorkingDay (collaboratorWorkingDays: any[], transaction?: Transaction) {
    const listCollaboratorWorkingDay = await CollaboratorWorkingDayModel.bulkCreate(collaboratorWorkingDays, {
      updateOnDuplicate: CollaboratorWorkingDayModel.UPDATABLE_ON_DUPLICATE_PARAMETERS as (keyof CollaboratorWorkingDayInterface)[],
      individualHooks: true,
      transaction,
    });
    const collaboratorWorkingDayIds = listCollaboratorWorkingDay.map((index: any) => index.id);
    await CollaboratorWorkingDayModel.destroy({ where: { id: { [Op.notIn]: collaboratorWorkingDayIds } }, transaction });
  }

  public static associate () {
  }
}

export default CollaboratorWorkingDayModel;
