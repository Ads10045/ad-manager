const { PrismaClient } = require('@prisma/client');
const config = require('../../config/config.json');

const target = config.active_db_target || 'local';
const databaseUrl = config.database.targets[target];

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

module.exports = prisma;
