import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { Sequelize } from 'sequelize';

const env: any = process.env.NODE_ENV || 'development';
// eslint-disable-next-line node/no-path-concat
const config = require(`${__dirname}/../../configs/database`)[env];
const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config);

const queryInterface = sequelize.getQueryInterface();

const csvFilePath = (tableName: string) => path.join(__dirname, `${tableName}.csv`);

const importAdministrativeMaps = async () => {
  try {
    const rows: any = [];
    const result: any = await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath('vs20'))
        .pipe(csv())
        .on('data', (row) => rows.push(row))
        .on('error', reject)
        .on('end', async () => {
          await queryInterface.bulkDelete('m_wards', null);
          await queryInterface.bulkDelete('m_districts', null);
          await queryInterface.bulkDelete('m_provinces', null);
          const provinceAttributes: any = [];
          const districtAttributes: any = [];
          const wardAttributes: any = [];
          let provinceIndex = 0;
          let districtIndex = 0;
          let wardIndex = 0;
          rows.forEach((row: any) => {
            if (provinceAttributes[provinceAttributes.length - 1]?.code !== row.province_code) {
              provinceIndex += 1;
              provinceAttributes.push({
                id: provinceIndex,
                code: row.province_code,
                title: row.province,
                misaCode: row.province_misa_code,
                ghnProvinceId: row.ghn_provinceId,
              });
            }
            if (districtAttributes[districtAttributes.length - 1]?.code !== row.district_code) {
              districtIndex += 1;
              districtAttributes.push({
                id: districtIndex,
                provinceId: provinceIndex,
                code: row.district_code,
                title: row.district,
                misaCode: row.district_misa_code,
                ghnDistrictId: row.ghn_districtId,
              });
            }
            if (wardAttributes[wardAttributes.length - 1]?.code !== row.ward_code) {
              wardIndex += 1;
              wardAttributes.push({
                id: wardIndex,
                districtId: districtIndex,
                code: row.ward_code,
                title: row.ward,
                misaCode: row.ward_misa_code,
                ghnWardCode: row.ghn_ward_code,
              });
            }
          });
          await queryInterface.bulkInsert('m_provinces', provinceAttributes);
          await queryInterface.bulkInsert('m_districts', districtAttributes);
          await queryInterface.bulkInsert('m_wards', wardAttributes);
          resolve(true);
        });
    });
    return result;
  } catch (error) {
    console.log(error);
  }
};

export {
  importAdministrativeMaps,
};
