import { importMasterData } from '../database/masters/masterImporter';
import { importAdministrativeMaps } from '../database/masters/importAdministrativeMaps';

const execute = async () => {
  for (const tableName of ['m_colors', 'm_sizes', 'm_forms', 'm_user_types', 'm_bill_template_keys']) {
    await importMasterData(tableName);
  }
  await importAdministrativeMaps();
  process.kill(process.pid);
};

execute();
