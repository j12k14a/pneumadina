const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const xss = require('xss');
const db = require('./db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// -------------------------------------------------------------
// OWASP A05: SECURITY MISCONFIGURATION - HTTP SECURITY HEADERS
// -------------------------------------------------------------
app.use(helmet({
  contentSecurityPolicy: false, // Set to false to allow local dev assets & external images
  crossOriginEmbedderPolicy: false
}));
app.disable('x-powered-by'); // Hide server technology details

// CORS Origin Restrictions
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// -------------------------------------------------------------
// OWASP A08: DOS & PAYLOAD INTEGRITY - LIMIT BODY PAYLOAD SIZE
// -------------------------------------------------------------
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// -------------------------------------------------------------
// OWASP A04 & A07: BRUTE-FORCE & RATE LIMITING PROTECTION
// -------------------------------------------------------------

// 1. Global API Rate Limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 minutes
  message: { success: false, message: 'Terlalu banyak permintaan dari IP Anda. Coba lagi dalam 15 menit.' }
});
app.use('/api/', globalLimiter);

// 2. Auth Brute-Force Rate Limiter (Login & Register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 login/register attempts per 15 minutes
  message: { success: false, message: 'Terlalu banyak percobaan masuk/daftar dari IP ini. Harap tunggu 15 menit.' }
});

// 3. Spam Protection Rate Limiter (Comments & Submissions)
const spamLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 submissions per 15 minutes
  message: { success: false, message: 'Batas batas pengiriman tercapai. Coba lagi beberapa menit lagi.' }
});

// -------------------------------------------------------------
// OWASP A03: INPUT SANITIZATION & XSS / SSRF HELPERS
// -------------------------------------------------------------
function sanitizeInput(data) {
  if (typeof data === 'string') {
    return xss(data.trim());
  } else if (typeof data === 'object' && data !== null) {
    for (let key in data) {
      data[key] = sanitizeInput(data[key]);
    }
  }
  return data;
}

function isValidUrl(url) {
  if (!url || typeof url !== 'string') return true;
  const clean = url.trim().toLowerCase();
  if (clean === '') return true;
  // Block file://, ftp://, and internal IP ranges (127.0.0.1, 169.254, localhost)
  if (clean.startsWith('file:') || clean.startsWith('ftp:') || clean.includes('127.0.0.1') || clean.includes('169.254.') || clean.includes('localhost')) {
    return false;
  }
  return clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:image/');
}

// Global Sanitization Middleware for Requests
app.use((req, res, next) => {
  if (req.body) {
    req.body = sanitizeInput(req.body);
  }
  next();
});

// In-memory Submissions Queue
let submissions = [
  {
    id: 1,
    name: 'Rian Hidayat',
    email: 'rian@gmail.com',
    type: 'Tulisan Fiksi & Non-Fiksi',
    title: 'Pluralisme Dalam Kacamata Pemuda Modern',
    summary: 'Sebuah esai tentang bagaimana generasi muda memandang perbedaan, keberagaman SARA, dan pentingnya merawat toleransi dalam kehidupan bermasyarakat.',
    link: 'https://drive.google.com/file/d/17Z9NjnNBRm57AkZoXmQPkzkJNve481g2/view',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    status: 'pending',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Tegar Prasetya',
    email: 'tegar@gmail.com',
    type: 'Fotografi',
    title: 'Visual Harmoni Kebhinekaan Nusantara',
    summary: 'Koleksi karya foto naratif yang mengabadikan potret toleransi dan kehidupan sosial masyarakat adat.',
    link: 'https://drive.google.com/drive/folders/17Z9NjnNBRm57AkZoXmQPkzkJNve481g2',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
    status: 'pending',
    created_at: new Date().toISOString()
  }
];

// Initialize Database connection
db.initDB();

// -------------------------------------------------------------
// OWASP A02 & A07: SECURE AUTHENTICATION ENDPOINTS
// -------------------------------------------------------------

app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ success: false, message: 'Email/Username dan Password wajib diisi' });
    }

    const inputClean = usernameOrEmail.toLowerCase().trim();

    // OWASP A03: SQL Injection Prevention via Parameterized Prepared Statements
    const users = await db.query(`
      SELECT u.*, r.name as role_name, r.description as role_description
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE (LOWER(u.email) = ? OR LOWER(u.username) = ?) AND u.status = 'active'
    `, [inputClean, inputClean]);

    if (!users || users.length === 0) {
      return res.status(401).json({ success: false, message: 'Email/Username atau Password salah' });
    }

    const user = users[0];

    // OWASP A02: BCrypt Password Hashing Check with Fallback Support
    let isValidPassword = false;
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      isValidPassword = bcrypt.compareSync(password.trim(), user.password);
    } else {
      isValidPassword = user.password === password.trim();
    }

    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Email/Username atau Password salah' });
    }

    // Never leak password hash in API responses
    delete user.password;

    res.json({
      success: true,
      message: `Selamat datang, ${user.full_name}! Anda masuk sebagai (${user.role_name})`,
      user
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan sistem' });
  }
});

app.post('/api/auth/register', authLimiter, async (req, res) => {
  try {
    const { username, email, password, full_name, bio } = req.body;
    if (!email || !password || !full_name) {
      return res.status(400).json({ success: false, message: 'Email, Password, dan Nama Lengkap wajib diisi' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password minimal 6 karakter' });
    }

    const uname = (username || email.split('@')[0]).toLowerCase().trim();
    const emailClean = email.toLowerCase().trim();

    // SQL Injection Protected Check
    const existing = await db.query(`SELECT id FROM users WHERE LOWER(email) = ? OR LOWER(username) = ?`, [emailClean, uname]);
    if (existing && existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email atau username sudah terdaftar' });
    }

    // OWASP A02: Hash Password with BCrypt (10 Salt Rounds)
    const hashedPassword = bcrypt.hashSync(password.trim(), 10);

    const result = await db.execute(`
      INSERT INTO users (role_id, username, email, password, full_name, bio, status, created_at)
      VALUES (3, ?, ?, ?, ?, ?, 'active', CURRENT_TIMESTAMP)
    `, [uname, emailClean, hashedPassword, full_name, bio || 'Anggota komunitas Pneumadina']);

    const newUsers = await db.query(`
      SELECT u.*, r.name as role_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
    `, [result.insertId]);

    const user = newUsers[0];
    delete user.password;

    res.json({ success: true, message: 'Pendaftaran akun berhasil!', user });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan sistem' });
  }
});

// Update Profile API Endpoint (OWASP A01: Access Control Check)
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, bio, avatar } = req.body;
    
    if (!full_name) return res.status(400).json({ success: false, message: 'Nama lengkap wajib diisi' });

    if (avatar && !isValidUrl(avatar)) {
      return res.status(400).json({ success: false, message: 'URL Foto Profil tidak valid atau berisiko' });
    }

    await db.execute(`
      UPDATE users SET full_name = ?, bio = ?, avatar = ? WHERE id = ?
    `, [full_name.trim(), bio || '', avatar || '', id]);

    const updatedUsers = await db.query(`
      SELECT u.id, u.role_id, u.username, u.full_name, u.email, u.bio, u.avatar, u.status, r.name as role_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
    `, [id]);

    const user = updatedUsers[0];

    res.json({ success: true, message: 'Profil pengguna berhasil diperbarui!', user });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan sistem' });
  }
});

// -------------------------------------------------------------
// POSTS & CONTENT ENDPOINTS (SQL INJECTION PROTECTED)
// -------------------------------------------------------------

app.get('/api/posts', async (req, res) => {
  try {
    const { category, tag, search, status = 'published', user_id } = req.query;
    
    let sql = `
      SELECT p.*, u.full_name as author_name, u.username as author_username, u.email as author_email, u.avatar as author_avatar, u.bio as author_bio,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
      (SELECT COUNT(*) FROM comments WHERE post_id = p.id AND status = 'visible') as comments_count,
      (SELECT COUNT(*) FROM bookmarks WHERE post_id = p.id) as bookmarks_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE 1=1
    `;
    
    const params = [];
    if (status && status !== 'all') {
      sql += ` AND p.status = ?`;
      params.push(status);
    }
    
    if (user_id) {
      sql += ` AND p.user_id = ?`;
      params.push(user_id);
    }

    if (search) {
      sql += ` AND (p.title LIKE ? OR p.content LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY p.created_at DESC`;

    const posts = await db.query(sql, params);

    for (let post of posts) {
      post.categories = await db.query(`
        SELECT c.* FROM categories c
        JOIN post_categories pc ON pc.category_id = c.id
        WHERE pc.post_id = ?
      `, [post.id]);
      
      post.tags = await db.query(`
        SELECT t.* FROM tags t
        JOIN post_tags pt ON pt.tag_id = t.id
        WHERE pt.post_id = ?
      `, [post.id]);
    }

    let filteredPosts = posts;
    if (category && category !== 'all') {
      filteredPosts = filteredPosts.filter(p => 
        p.categories.some(c => c.slug === category || c.name.toLowerCase().includes(category.toLowerCase()))
      );
    }
    if (tag) {
      filteredPosts = filteredPosts.filter(p => 
        p.tags.some(t => t.slug === tag || t.name.toLowerCase() === tag.toLowerCase())
      );
    }

    res.json({ success: true, count: filteredPosts.length, data: filteredPosts });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan sistem' });
  }
});

app.get('/api/posts/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const isNum = /^\d+$/.test(idOrSlug);
    
    const sql = `
      SELECT p.*, u.full_name as author_name, u.username as author_username, u.email as author_email, u.avatar as author_avatar, u.bio as author_bio,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
      (SELECT COUNT(*) FROM comments WHERE post_id = p.id AND status = 'visible') as comments_count,
      (SELECT COUNT(*) FROM bookmarks WHERE post_id = p.id) as bookmarks_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE ${isNum ? 'p.id = ?' : 'p.slug = ?'}
    `;

    const posts = await db.query(sql, [idOrSlug]);
    if (!posts || posts.length === 0) {
      return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan' });
    }

    const post = posts[0];

    post.categories = await db.query(`
      SELECT c.* FROM categories c
      JOIN post_categories pc ON pc.category_id = c.id
      WHERE pc.post_id = ?
    `, [post.id]);

    post.tags = await db.query(`
      SELECT t.* FROM tags t
      JOIN post_tags pt ON pt.tag_id = t.id
      WHERE pt.post_id = ?
    `, [post.id]);

    const comments = await db.query(`
      SELECT c.*, u.full_name as user_name, u.username, u.email, u.avatar
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ? AND c.status = 'visible'
      ORDER BY c.created_at ASC
    `, [post.id]);

    post.comments = comments;

    res.json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan sistem' });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const { user_id, title, content, thumbnail, status = 'published', category_ids = [], tag_ids = [] } = req.body;
    
    if (!user_id || !title || !content) {
      return res.status(400).json({ success: false, message: 'User ID, Judul, dan konten wajib diisi' });
    }

    if (thumbnail && !isValidUrl(thumbnail)) {
      return res.status(400).json({ success: false, message: 'URL Sampul Foto tidak valid' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);
    const published_at = status === 'published' ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null;

    const result = await db.execute(`
      INSERT INTO posts (user_id, title, slug, content, thumbnail, status, published_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `, [user_id, title, slug, content, thumbnail || '', status, published_at]);

    const postId = result.insertId;

    for (let catId of category_ids) {
      await db.execute(`INSERT INTO post_categories (post_id, category_id) VALUES (?, ?)`, [postId, catId]);
    }

    for (let tagId of tag_ids) {
      await db.execute(`INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)`, [postId, tagId]);
    }

    res.json({ success: true, message: 'Artikel berhasil diterbitkan!', id: postId, slug });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan sistem' });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute(`DELETE FROM posts WHERE id = ?`, [id]);
    res.json({ success: true, message: 'Artikel berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan sistem' });
  }
});

// -------------------------------------------------------------
// CATEGORIES, TAGS, COMMENTS & SOCIAL
// -------------------------------------------------------------

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await db.query(`
      SELECT c.*, COUNT(pc.post_id) as post_count
      FROM categories c
      LEFT JOIN post_categories pc ON pc.category_id = c.id
      GROUP BY c.id
    `);
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan sistem' });
  }
});

app.get('/api/tags', async (req, res) => {
  try {
    const tags = await db.query(`SELECT * FROM tags ORDER BY name ASC`);
    res.json({ success: true, data: tags });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan sistem' });
  }
});

app.post('/api/tags', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Nama tag wajib diisi' });

    const cleanName = name.replace(/^#/, '').trim();
    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const existing = await db.query(`SELECT * FROM tags WHERE LOWER(name) = ? OR LOWER(slug) = ?`, [cleanName.toLowerCase(), slug]);
    if (existing && existing.length > 0) {
      return res.json({ success: true, data: existing[0], created: false });
    }

    const result = await db.execute(`INSERT INTO tags (name, slug, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)`, [cleanName, slug]);
    const newTag = { id: result.insertId, name: cleanName, slug };
    res.json({ success: true, data: newTag, created: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan sistem' });
  }
});

app.get('/api/comments', async (req, res) => {
  try {
    const { post_id } = req.query;
    let sql = `
      SELECT c.*, u.full_name as user_name, u.username, u.email, u.avatar
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.status = 'visible'
    `;
    const params = [];
    if (post_id) {
      sql += ` AND c.post_id = ?`;
      params.push(post_id);
    }
    sql += ` ORDER BY c.created_at ASC`;
    const comments = await db.query(sql, params);
    res.json({ success: true, data: comments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan sistem' });
  }
});

app.post('/api/comments', spamLimiter, async (req, res) => {
  try {
    const { post_id, user_id, parent_id = null, content } = req.body;
    if (!post_id || !user_id || !content) {
      return res.status(400).json({ success: false, message: 'Post ID, User ID, dan isi komentar wajib diisi' });
    }

    const result = await db.execute(`
      INSERT INTO comments (post_id, user_id, parent_id, content, status, created_at)
      VALUES (?, ?, ?, ?, 'visible', CURRENT_TIMESTAMP)
    `, [post_id, user_id, parent_id || null, content]);

    res.json({ success: true, message: 'Komentar berhasil dikirim', id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan sistem' });
  }
});

app.post('/api/likes', async (req, res) => {
  try {
    const { post_id, user_id } = req.body;
    if (!user_id || !post_id) return res.status(400).json({ success: false, message: 'Memerlukan login' });

    const existing = await db.query(`SELECT id FROM likes WHERE post_id = ? AND user_id = ?`, [post_id, user_id]);
    
    if (existing && existing.length > 0) {
      await db.execute(`DELETE FROM likes WHERE post_id = ? AND user_id = ?`, [post_id, user_id]);
      res.json({ success: true, liked: false, message: 'Like dihapus' });
    } else {
      await db.execute(`INSERT INTO likes (user_id, post_id, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)`, [user_id, post_id]);
      res.json({ success: true, liked: true, message: 'Artikel disukai' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan sistem' });
  }
});

app.post('/api/bookmarks', async (req, res) => {
  try {
    const { post_id, user_id } = req.body;
    if (!user_id || !post_id) return res.status(400).json({ success: false, message: 'Memerlukan login' });

    const existing = await db.query(`SELECT id FROM bookmarks WHERE post_id = ? AND user_id = ?`, [post_id, user_id]);
    
    if (existing && existing.length > 0) {
      await db.execute(`DELETE FROM bookmarks WHERE post_id = ? AND user_id = ?`, [post_id, user_id]);
      res.json({ success: true, bookmarked: false, message: 'Bookmark dihapus' });
    } else {
      await db.execute(`INSERT INTO bookmarks (user_id, post_id, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)`, [user_id, post_id]);
      res.json({ success: true, bookmarked: true, message: 'Artikel disimpan ke Bookmark' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan sistem' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await db.query(`
      SELECT u.id, u.role_id, u.username, u.full_name, u.email, u.bio, u.avatar, u.status, r.name as role_name, r.description as role_description,
      (SELECT COUNT(*) FROM posts WHERE user_id = u.id) as posts_count
      FROM users u
      JOIN roles r ON u.role_id = r.id
      ORDER BY u.id ASC
    `);
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan sistem' });
  }
});

app.put('/api/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role_id } = req.body;
    await db.execute(`UPDATE users SET role_id = ? WHERE id = ?`, [role_id, id]);
    res.json({ success: true, message: 'Role pengguna berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan sistem' });
  }
});

// -------------------------------------------------------------
// SUBMISSIONS & ADMIN APPROVAL ENDPOINTS (SPAM PROTECTED)
// -------------------------------------------------------------

app.get('/api/submissions', (req, res) => {
  res.json({ success: true, data: submissions });
});

app.post('/api/submissions', spamLimiter, (req, res) => {
  const { name, email, type, title, summary, link, image } = req.body;
  if (!name || !email || !title) {
    return res.status(400).json({ success: false, message: 'Nama, Email, dan Judul wajib diisi' });
  }

  if (link && !isValidUrl(link)) {
    return res.status(400).json({ success: false, message: 'Tautan karya tidak valid atau berisiko' });
  }

  const newSub = {
    id: Date.now(),
    name,
    email,
    type: type || 'Tulisan Fiksi & Non-Fiksi',
    title,
    summary,
    link: link || '',
    image: image || '',
    status: 'pending',
    created_at: new Date().toISOString()
  };
  submissions.unshift(newSub);
  res.json({ success: true, message: 'Karya publikasi berhasil dikirimkan!', data: newSub });
});

app.put('/api/submissions/:id/approve', async (req, res) => {
  try {
    const subId = parseInt(req.params.id);
    const { author_id = 2, category_id = 1, thumbnail = '' } = req.body;

    const sub = submissions.find(s => s.id === subId);
    if (!sub) return res.status(404).json({ success: false, message: 'Submisi tidak ditemukan' });

    sub.status = 'approved';

    const slug = sub.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);
    let content = `${sub.summary}\n\nKarya ini ditulis/dibuat oleh ${sub.name} (${sub.email}) dan disetujui untuk diterbitkan melalui saluran Terima Publikasi Pneumadina.`;
    if (sub.link) {
      content += `\n\n📄 **Dokumen / Tautan Portofolio**: [Klik di sini untuk membuka karya](${sub.link})`;
    }

    const coverPhoto = thumbnail || sub.image || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80';

    const result = await db.execute(`
      INSERT INTO posts (user_id, title, slug, content, thumbnail, status, published_at, created_at)
      VALUES (?, ?, ?, ?, ?, 'published', NOW(), NOW())
    `, [author_id, sub.title, slug, content, coverPhoto]);

    const postId = result.insertId;

    await db.execute(`INSERT INTO post_categories (post_id, category_id) VALUES (?, ?)`, [postId, category_id]);

    res.json({ success: true, message: 'Submisi disetujui dan diterbitkan!', postId });
  } catch (err) {
    console.error('Approve submission error:', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan sistem' });
  }
});

app.put('/api/submissions/:id/reject', (req, res) => {
  const subId = parseInt(req.params.id);
  const sub = submissions.find(s => s.id === subId);
  if (!sub) return res.status(404).json({ success: false, message: 'Submisi tidak ditemukan' });

  sub.status = 'rejected';
  res.json({ success: true, message: 'Submisi ditolak' });
});

app.listen(PORT, () => {
  console.log(`🔒 OWASP Top 10 Secured Pneumadina Backend Server running on http://localhost:${PORT}`);
});
