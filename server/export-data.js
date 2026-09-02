const mysql = require('mysql2/promise');
const fs = require('fs');

(async () => {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'pneumadina'
  });

  const [posts] = await conn.query('SELECT p.*, u.full_name as author_name, u.avatar as author_avatar, c.name as category_name FROM posts p LEFT JOIN users u ON p.user_id = u.id LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.id DESC');

  for (let p of posts) {
    const [tags] = await conn.query('SELECT t.name FROM tags t JOIN post_tags pt ON t.id = pt.tag_id WHERE pt.post_id = ?', [p.id]);
    p.tags = tags.map(t => t.name);

    const [comments] = await conn.query('SELECT c.*, u.full_name as user_name, u.avatar as user_avatar FROM comments c LEFT JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.id ASC', [p.id]);
    p.comments = comments;
  }

  const [categories] = await conn.query('SELECT c.*, COUNT(p.id) as posts_count FROM categories c LEFT JOIN posts p ON c.id = p.category_id GROUP BY c.id');
  const [tags] = await conn.query('SELECT * FROM tags');
  const [users] = await conn.query('SELECT u.id, u.role_id, r.name as role_name, u.username, u.email, u.full_name, u.avatar, u.bio FROM users u JOIN roles r ON u.role_id = r.id');
  const [team] = await conn.query('SELECT * FROM team_members ORDER BY order_index ASC');

  fs.mkdirSync('../client/src/data', { recursive: true });
  const seed = { posts, categories, tags, users, team };
  fs.writeFileSync('../client/src/data/seedData.js', 'export const SEED_DATA = ' + JSON.stringify(seed, null, 2) + ';\n');
  console.log('SUCCESS: Exported ' + posts.length + ' posts, ' + team.length + ' team members to seedData.js');
  await conn.end();
})();
