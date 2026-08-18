const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function fixCredentials() {
  try {
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'pneumadina'
    });

    console.log('Generating BCrypt password hashes...');
    const adminHash = bcrypt.hashSync('AdminPnewmadina2026!', 10);
    const diandraHash = bcrypt.hashSync('DiandraAuthor2026!', 10);
    const tsaqilahHash = bcrypt.hashSync('TsaqilahAuthor2026!', 10);
    const mariamHash = bcrypt.hashSync('MariamAuthor2026!', 10);
    const contohHash = bcrypt.hashSync('ContohMember2026!', 10);

    // Update Admin (role_id = 1)
    await conn.query(`
      UPDATE users SET 
        full_name = 'Admin Jawsyan Tampan',
        email = 'jawsyantampan.admin@pneumadina.com',
        username = 'admin',
        role_id = 1,
        password = ?
      WHERE id = 1 OR username = 'admin' OR email LIKE '%admin%';
    `, [adminHash]);

    // Update Diandra (Author, role_id = 2)
    await conn.query(`
      UPDATE users SET 
        full_name = 'Diandra Paramadina',
        email = 'diandra@pneumadina.com',
        username = 'diandra',
        role_id = 2,
        password = ?
      WHERE id = 2 OR username = 'diandra' OR email LIKE '%diandra%';
    `, [diandraHash]);

    // Update Tsaqilah (Author, role_id = 2)
    await conn.query(`
      UPDATE users SET 
        full_name = 'Tsaqilah Paramadina',
        email = 'tsaqilah@pneumadina.com',
        username = 'tsaqilah',
        role_id = 2,
        password = ?
      WHERE id = 3 OR username = 'qilah' OR username = 'tsaqilah' OR email LIKE '%qilah%';
    `, [tsaqilahHash]);

    // Update Mariam (Author, role_id = 2)
    await conn.query(`
      UPDATE users SET 
        full_name = 'Mariam Paramadina',
        email = 'mariam@pneumadina.com',
        username = 'mariam',
        role_id = 2,
        password = ?
      WHERE id = 4 OR username = 'siti' OR username = 'maryam' OR username = 'mariam' OR email LIKE '%maryam%' OR email LIKE '%mariam%';
    `, [mariamHash]);

    // Update Contoh (Member, role_id = 3)
    await conn.query(`
      UPDATE users SET 
        full_name = 'Contoh Member Paramadina',
        email = 'contoh@pneumadina.com',
        username = 'contoh',
        role_id = 3,
        password = ?
      WHERE id = 5 OR username = 'andi' OR username = 'contoh' OR email LIKE '%contoh%';
    `, [contohHash]);

    console.log('✅ All 5 user credentials updated with real BCrypt hashes in MySQL!');
    await conn.end();
  } catch (err) {
    console.error('Fix credentials error:', err.message);
  }
}

fixCredentials();
