const db = require('../utils/db');

/**
 * @desc Get all user tables in the current database
 */
const getTables = async (req, res) => {
  const { dbName } = req.query; // If we want to target a specific DB via SQL
  try {
    // We target common schemas for PostgreSQL (public)
    // If dbName is provided, we could try to switch context if using raw PG, 
    // but for now we list tables in the current connection's DB.
    const sql = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    
    const result = await db.execute(
      () => db.prisma.$queryRawUnsafe(sql),
      sql
    );
    
    const rows = result.rows ? result.rows : result;
    const tables = rows.map(row => row.table_name);
    
    res.json({
      database: dbName || 'current',
      tables
    });
  } catch (error) {
    console.error('[DynamicAPI] Error fetching tables:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Get all columns for a specific table
 */
const getColumns = async (req, res) => {
  const { tableName } = req.params;
  
  try {
    const sql = `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = '${tableName}'
      AND table_schema = 'public'
      ORDER BY ordinal_position;
    `;
    
    const result = await db.execute(
      () => db.prisma.$queryRawUnsafe(sql),
      sql
    );
    
    const rows = result.rows ? result.rows : result;
    const columns = rows.map(row => ({
      name: row.column_name,
      type: row.data_type
    }));
    
    res.json({
      table: tableName,
      columns
    });
  } catch (error) {
    console.error(`[DynamicAPI] Error fetching columns for ${tableName}:`, error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Get data from a specific table with limit
 */
const getData = async (req, res) => {
  const { tableName } = req.params;
  const limit = parseInt(req.query.limit) || 10;
  
  try {
    const sql = `SELECT * FROM "${tableName}" LIMIT ${limit}`;
    
    const result = await db.execute(
      () => db.prisma.$queryRawUnsafe(sql),
      sql
    );
    
    const rows = result.rows ? result.rows : result;
    res.json({
      table: tableName,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error(`[DynamicAPI] Error fetching data for ${tableName}:`, error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Get random rows from a specific table (Generic Product Logic)
 */
const getRandomRows = async (req, res) => {
    const { tableName } = req.params;
    const limit = parseInt(req.query.limit) || 1;

    try {
        // PostgreSQL RANDOM() ordering
        const sql = `SELECT * FROM "${tableName}" ORDER BY RANDOM() LIMIT ${limit}`;

        const result = await db.execute(
            () => db.prisma.$queryRawUnsafe(sql),
            sql
        );

        const rows = result.rows ? result.rows : result;
        
        // If single row requested, return as object to mimic product logic if needed, 
        // but here we keep it consistent as an array or specific format.
        res.json(limit === 1 ? (rows[0] || {}) : rows);
    } catch (error) {
        console.error(`[DynamicAPI] Error fetching random data from ${tableName}:`, error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * @desc Get a single row from a specific table by column value (e.g., id)
 */
const getRowByColumn = async (req, res) => {
    const { tableName, columnName, value } = req.params;

    try {
        // Basic sanitization for value (simple quote wrapping for SQL)
        // Note: For production, use parameterized queries.
        const formattedValue = isNaN(value) ? `'${value}'` : value;
        const sql = `SELECT * FROM "${tableName}" WHERE "${columnName}" = ${formattedValue} LIMIT 1`;

        const result = await db.execute(
            () => db.prisma.$queryRawUnsafe(sql),
            sql
        );

        const rows = result.rows ? result.rows : result;
        
        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: `No record found in ${tableName} where ${columnName} = ${value}` });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error(`[DynamicAPI] Error fetching data from ${tableName} by ${columnName}:`, error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
  getTables,
  getColumns,
  getData,
  getRandomRows,
  getRowByColumn
};
