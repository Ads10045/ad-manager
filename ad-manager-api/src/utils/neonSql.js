const axios = require('axios');
const config = require('../../config/config.json');

/**
 * Executes a SQL query via the Neon SQL HTTP API.
 * @param {string} sql - The raw SQL query to execute.
 */
const query = async (sql) => {
  const env = config.current_env || 'prod';
  const databaseUrl = config.database.targets[config.active_db_target || env];
  const endpoint = config.database.neon_sql_endpoint;
  
  try {
    const response = await axios.post(endpoint, { query: sql }, {
      headers: {
        'Content-Type': 'application/json',
        'Neon-Connection-String': databaseUrl
      }
    });
    
    // Neon SQL API returns an object with 'rows', 'fields', etc.
    return response.data;
  } catch (error) {
    console.error('Neon SQL API Error:', error.response?.data || error.message);
    throw new Error('Database query failed via SQL API');
  }
};

module.exports = { query };
