const prisma = require('./prisma');
const neonSql = require('./neonSql');
const config = require('../../config/config.json');

const env = process.env.NODE_ENV || config.current_env || 'local';
const currentConfig = config.environments[env];
const strategy = currentConfig.db_strategy || 'prisma';

/**
 * Executes a query using the active strategy (Prisma or SQL API)
 */
const execute = async (prismaAction, rawSql) => {
  if (strategy === 'sql_api') {
    console.log('Using Neon SQL API strategy...');
    return await neonSql.query(rawSql);
  } else {
    console.log('Using Prisma strategy...');
    return await prismaAction();
  }
};

module.exports = { execute, prisma, neonSql };
