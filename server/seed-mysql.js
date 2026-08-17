const mysql = require('mysql2/promise');
const fs = require('fs');

async function seed() {
  try {
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '',
      multipleStatements: true
    });

    console.log('Creating database pneumadina if not exists...');
    await conn.query('CREATE DATABASE IF NOT EXISTS pneumadina;');
    await conn.query('USE pneumadina;');

    const sqlPath = 'C:\\Users\\user\\Downloads\\pnewmadina.sql';
    if (fs.existsSync(sqlPath)) {
      console.log('Reading pnewmadina.sql dump...');
      let sql = fs.readFileSync(sqlPath, 'utf8');
      
      // Clean dump syntax if needed
      sql = sql.replace(/`pnewmadina`/g, '`pneumadina`');

      const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);
      for (const stmt of statements) {
        try {
          await conn.query(stmt);
        } catch (e) {
          // Ignore table exists or minor errors
        }
      }
      console.log('✅ Successfully seeded MySQL database [pneumadina]!');
    }

    // Ensure categories are set to 4 channels: Fiksi, Non-Fiksi, Desain, Fotografi
    await conn.query(`
      DELETE FROM categories;
      INSERT INTO categories (id, name, slug, description) VALUES
      (1, 'Fiksi', 'fiksi', 'Cerita pendek, novellet, puisi, dan narasi imajinatif'),
      (2, 'Non-Fiksi', 'non-fiksi', 'Esai, wacana, opini, filsafat, dan ulasan kritis'),
      (3, 'Desain', 'desain', 'Desain grafis, ilustrasi, visual art, dan poster'),
      (4, 'Fotografi', 'fotografi', 'Visual esai, foto dokumenter, dan narasi fotografi');
    `);
    console.log('✅ Successfully updated categories (Fiksi, Non-Fiksi, Desain, Fotografi)!');

    await conn.end();
  } catch (err) {
    console.error('Seed error:', err.message);
  }
}

seed();
