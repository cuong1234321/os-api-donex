import { importMasterData } from '../database/masters/masterImporter';

const execute = async () => {
  for (const tableName of ['m_colors', 'm_sizes']) {
    await importMasterData(tableName);
  }
  process.kill(process.pid);
};

execute();
