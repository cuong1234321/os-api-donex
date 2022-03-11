import { importMasterData } from '../database/masters/masterImporter';
import { importAdministrativeMaps } from '../database/masters/importAdministrativeMaps';

const execute = async () => {
  for (const tableName of ['m_colors', 'm_sizes', 'm_forms']) {
    await importMasterData(tableName);
  }
  await importAdministrativeMaps();
  process.kill(process.pid);
};

execute();
