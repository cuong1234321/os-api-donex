import settings from '@configs/settings';
import SlugGeneration from '@libs/slugGeneration';
import AdminModel from '@models/admins';
import RoleModel from '@models/roles';
import _ from 'lodash';
import xlsx from 'node-xlsx';
import { getConsoleLogger } from '@libs/consoleLogger';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
import MailerService from './mailer';

const errorLogger = getConsoleLogger('errorLogging');
errorLogger.addContext('requestType', 'HttpLogging');

class AdminImporterService {
  public xlsxFile: any;

  constructor (file: any) {
    this.xlsxFile = xlsx.parse(file.buffer);
  }

  static readonly SKIPPED_ROWS = 4;

  static readonly ADMIN_COLUMN_INDEX = {
    INDEX: 0,
    FULLNAME: 1,
    DATE_OF_BIRTH: 2,
    PHONE_NUMBER: 3,
    USERNAME: 4,
    GENDER: 5,
    EMAIL: 6,
    ROLE: 7,
    NOTE: 8,
  }

  public async executeImport (email: string) {
    const failToImportIndex = {
      admin: new Array(0),
    };
    dayjs.extend(customParseFormat);
    let sheet = this.xlsxFile[0];
    const attributes: any = [];
    sheet = sheet.data;
    const rowsToProcess = _.range(AdminImporterService.SKIPPED_ROWS, sheet.length);
    for (const processingRow of rowsToProcess) {
      if (sheet[processingRow][AdminImporterService.ADMIN_COLUMN_INDEX.INDEX]) {
        const date = sheet[processingRow][AdminImporterService.ADMIN_COLUMN_INDEX.DATE_OF_BIRTH];
        attributes.push({
          fullName: sheet[processingRow][AdminImporterService.ADMIN_COLUMN_INDEX.FULLNAME],
          dateOfBirth: date ? dayjs(date, 'DD/MM/YYYY') : undefined,
          phoneNumber: sheet[processingRow][AdminImporterService.ADMIN_COLUMN_INDEX.PHONE_NUMBER],
          username: sheet[processingRow][AdminImporterService.ADMIN_COLUMN_INDEX.USERNAME],
          gender: this.mappingGender(sheet[processingRow][AdminImporterService.ADMIN_COLUMN_INDEX.GENDER]),
          email: sheet[processingRow][AdminImporterService.ADMIN_COLUMN_INDEX.EMAIL],
          roleId: await this.mappingRole(sheet[processingRow][AdminImporterService.ADMIN_COLUMN_INDEX.ROLE]),
          note: sheet[processingRow][AdminImporterService.ADMIN_COLUMN_INDEX.NOTE],
          password: settings.defaultUserPassword,
        });
      }
    }
    for (const [index, attribute] of attributes.entries()) {
      const admin = await this.createAdmin(attribute);
      if (!admin) failToImportIndex.admin.push(index + 1);
    }
    await MailerService.adminImporterReport(failToImportIndex, email);
  }

  private mappingGender (gender: string) {
    if (SlugGeneration.execute(gender) === SlugGeneration.execute(AdminModel.GENDER_VN_ENUM.MALE)) return AdminModel.GENDER_ENUM.MALE;
    if (SlugGeneration.execute(gender) === SlugGeneration.execute(AdminModel.GENDER_VN_ENUM.FEMALE)) return AdminModel.GENDER_ENUM.FEMALE;
    if (SlugGeneration.execute(gender) === SlugGeneration.execute(AdminModel.GENDER_VN_ENUM.OTHER)) return AdminModel.GENDER_ENUM.OTHER;
    return undefined;
  }

  private async mappingRole (roleName: string) {
    if (!roleName) return undefined;
    const role = await RoleModel.scope([
      { method: ['byTitle', roleName] },
    ]).findOne();
    const roleId = role ? role.id : undefined;
    return roleId;
  }

  private async createAdmin (attribute: any) {
    try {
      const admin = await AdminModel.create(attribute);
      return admin;
    } catch (error) {
      errorLogger.error(error);
      return undefined;
    }
  }
}
export default AdminImporterService;
