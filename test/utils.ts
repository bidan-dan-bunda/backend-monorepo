import Database from '../src/orm/database';
import jsf from 'json-schema-faker';
import faker from 'faker/locale/id_ID';

export async function truncate(table: string) {
  const sequelize = await Database.sequelize;
  const t = await sequelize?.transaction();
  sequelize
    ?.query('SET FOREIGN_KEY_CHECKS = 0')
    .then(() => {
      return sequelize.query(`TRUNCATE TABLE ${table}`);
    })
    .then(() => {
      return sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    })
    .then(() => {
      return t?.commit();
    });
}

jsf.extend('faker', () => faker);
export function generateDummyData(schema: any) {
  return jsf.generate(schema);
}
