const { query } = require('./src/utils/neonSql');
const config = require('./config/config.json');

async function test() {
  console.log("Testing SQL API with manual queries...");
  
  const tables = ['User', 'Product', 'Banner', 'Order', 'Setting'];
  
  for (const table of tables) {
    try {
      console.log(`\n--- Testing table: ${table} ---`);
      const result = await query(`SELECT * FROM "${table}" LIMIT 1`);
      console.log(`Success for ${table}:`, JSON.stringify(result, null, 2));
    } catch (e) {
      console.error(`Failed for ${table}:`, e.message);
    }
  }
}

test();
