import { importMasterData } from '../database/masters/masterImporter';

const execute = async () => {
  for (const tableName of ['']) {
    await importMasterData(tableName);
  }
  process.kill(process.pid);
};

execute();
