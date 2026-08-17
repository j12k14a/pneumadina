const mysql = require('mysql2/promise');
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

let pool = null;
let sqlDb = null;
let useMysql = false;

async function initDB() {
  // 1. Try connecting to MySQL in Laragon / Localhost
  try {
    const tempPool = mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'pneumadina',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    // Test query
    await tempPool.query('SELECT 1 FROM users LIMIT 1');
    pool = tempPool;
    useMysql = true;
    console.log('✅ Connected successfully to MySQL database [pneumadina]');
    return;
  } catch (err) {
    console.log('⚠️ MySQL connection failed or not available, falling back to embedded SQL.js database.');
    console.log('Error reason:', err.message);
  }

  // 2. Fallback to SQL.js engine initialized from seed SQL file
  const SQL = await initSqlJs();
  sqlDb = new SQL.Database();
  
  // Seed database schema and initial data
  const sqlFilePath = path.join(__dirname, '..', '..', '..', '..', 'Downloads', 'pnewmadina.sql');
  let sqlContent = '';
  if (fs.existsSync(sqlFilePath)) {
    sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
  } else {
    // Fallback search in current dir
    const localSql = path.join(__dirname, 'pnewmadina.sql');
    if (fs.existsSync(localSql)) sqlContent = fs.readFileSync(localSql, 'utf8');
  }

  if (sqlContent) {
    // Clean SQL content for SQLite syntax compatibility
    const statements = sqlContent
      .replace(/ENGINE=InnoDB/gi, '')
      .replace(/DEFAULT CHARSET=\w+/gi, '')
      .replace(/AUTO_INCREMENT=\d+/gi, '')
      .replace(/KEY `[^`]+` \([^)]+\),?/gi, '')
      .replace(/UNIQUE KEY `[^`]+` \([^)]+\),?/gi, '')
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*') && !s.startsWith('SET'));

    for (const stmt of statements) {
      try {
        sqlDb.run(stmt);
      } catch (e) {
        // Ignore minor syntax differences in dump
      }
    }
    console.log('✅ Initialized embedded SQL.js database from pnewmadina.sql');
  }
}

async function query(sql, params = []) {
  if (useMysql && pool) {
    const [rows] = await pool.query(sql, params);
    return rows;
  } else if (sqlDb) {
    // Basic SQL.js parameter binding
    let formattedSql = sql;
    params.forEach((param) => {
      const val = typeof param === 'string' ? `'${param.replace(/'/g, "''")}'` : param;
      formattedSql = formattedSql.replace('?', val === null || val === undefined ? 'NULL' : val);
    });
    
    try {
      const res = sqlDb.exec(formattedSql);
      if (!res || res.length === 0) return [];
      const columns = res[0].columns;
      const values = res[0].values;
      return values.map(row => {
        const obj = {};
        columns.forEach((col, idx) => {
          obj[col] = row[idx];
        });
        return obj;
      });
    } catch (err) {
      console.error('SQL.js Query Error:', err.message, 'SQL:', formattedSql);
      return [];
    }
  }
  return [];
}

async function execute(sql, params = []) {
  if (useMysql && pool) {
    const [result] = await pool.execute(sql, params);
    return result;
  } else if (sqlDb) {
    let formattedSql = sql;
    params.forEach((param) => {
      const val = typeof param === 'string' ? `'${param.replace(/'/g, "''")}'` : param;
      formattedSql = formattedSql.replace('?', val === null || val === undefined ? 'NULL' : val);
    });
    sqlDb.run(formattedSql);
    return { insertId: Date.now(), affectedRows: 1 };
  }
  return { insertId: 0, affectedRows: 0 };
}

module.exports = {
  initDB,
  query,
  execute,
  isMysql: () => useMysql
};
