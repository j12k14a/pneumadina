const mysql = require('mysql2/promise');

async function initTeamAndLikes() {
  try {
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'pneumadina'
    });

    console.log('Connected to MySQL [pneumadina]...');

    // 1. Create team_members table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS team_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        member_id VARCHAR(50) UNIQUE,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(100) NOT NULL,
        is_leader TINYINT(1) DEFAULT 0,
        division_id VARCHAR(50) NOT NULL,
        division_name VARCHAR(100) NOT NULL,
        image VARCHAR(255) NOT NULL,
        instagram VARCHAR(100) DEFAULT '@pneumadina',
        bio TEXT,
        order_index INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table team_members verified / created.');

    // 2. Seed initial 14 members if empty
    const [existing] = await conn.query('SELECT COUNT(*) as count FROM team_members');
    if (existing[0].count === 0) {
      const members = [
        {
          member_id: 'bram',
          name: 'Bram',
          role: 'Ketua Umum',
          is_leader: 1,
          division_id: 'bph',
          division_name: 'Badan Pengurus Harian',
          image: '/team/bph-ketua-umum-bram.png',
          instagram: '@pneumadina',
          bio: 'Memimpin koordinasi dan arah strategis pergerakan literasi Pneumadina.',
          order_index: 1
        },
        {
          member_id: 'aldi',
          name: 'Aldi',
          role: 'Wakil Ketua Umum',
          is_leader: 1,
          division_id: 'bph',
          division_name: 'Badan Pengurus Harian',
          image: '/team/bph-wakil-ketua-umum-aldi.png',
          instagram: '@pneumadina',
          bio: 'Mendampingi kepemimpinan dan sinkronisasi program kerja antar divisi.',
          order_index: 2
        },
        {
          member_id: 'sheiza',
          name: 'Sheiza',
          role: 'Sekretaris',
          is_leader: 0,
          division_id: 'bph',
          division_name: 'Badan Pengurus Harian',
          image: '/team/bph-sekretaris-sheiza.png',
          instagram: '@pneumadina',
          bio: 'Mengelola administrasi persuratan, notulensi, dan tata kelola organisasi.',
          order_index: 3
        },
        {
          member_id: 'djordhy',
          name: 'Djordhy',
          role: 'Ketua Divisi',
          is_leader: 1,
          division_id: 'kaderisasi',
          division_name: 'Kaderisasi',
          image: '/team/kaderisasi-ketua-djordhy.png',
          instagram: '@pneumadina',
          bio: 'Mengembangkan potensi anggota, perekrutan, dan pembinaan kultur komunitas.',
          order_index: 4
        },
        {
          member_id: 'diandra',
          name: 'Diandra',
          role: 'Ketua Divisi',
          is_leader: 1,
          division_id: 'litbang',
          division_name: 'Penelitian & Pengembangan',
          image: '/team/litbang-ketua-diandra.png',
          instagram: '@pneumadina',
          bio: 'Mengawal riset tema, analisis wacana, dan inovasi pengembangan komunitas.',
          order_index: 5
        },
        {
          member_id: 'jawsyan',
          name: 'Jawsyan',
          role: 'Anggota',
          is_leader: 0,
          division_id: 'litbang',
          division_name: 'Penelitian & Pengembangan',
          image: '/team/litbang-anggota-jawsyan.png',
          instagram: '@pneumadina',
          bio: 'Riset teknologi, pengembangan platform digital, dan kajian literasi kritis.',
          order_index: 6
        },
        {
          member_id: 'mariam',
          name: 'Mariam',
          role: 'Anggota',
          is_leader: 0,
          division_id: 'litbang',
          division_name: 'Penelitian & Pengembangan',
          image: '/team/litbang-anggota-mariam.png',
          instagram: '@pneumadina',
          bio: 'Eksplorasi literatur kontemporer, kurasi bacaan, dan kajian sosial.',
          order_index: 7
        },
        {
          member_id: 'tsaqilah',
          name: 'Tsaqilah',
          role: 'Anggota',
          is_leader: 0,
          division_id: 'litbang',
          division_name: 'Penelitian & Pengembangan',
          image: '/team/litbang-anggota-tsaqilah.png',
          instagram: '@pneumadina',
          bio: 'Analisa gagasan kritis, pengumpulan data karya, dan riset pembaca.',
          order_index: 8
        },
        {
          member_id: 'hilda',
          name: 'Hilda',
          role: 'Ketua Divisi',
          is_leader: 1,
          division_id: 'pdd',
          division_name: 'Publikasi Desain Dokumentasi',
          image: '/team/pdd-ketua-hilda.png',
          instagram: '@pneumadina',
          bio: 'Menjaga standar estetika visual, branding, dan publikasi multimedia.',
          order_index: 9
        },
        {
          member_id: 'joefunny',
          name: 'Joefunny',
          role: 'Anggota',
          is_leader: 0,
          division_id: 'pdd',
          division_name: 'Publikasi Desain Dokumentasi',
          image: '/team/pdd-anggota-joefunny.png',
          instagram: '@pneumadina',
          bio: 'Dokumentasi kegiatan, desain poster kreatif, dan tata visual karya.',
          order_index: 10
        },
        {
          member_id: 'diaz',
          name: 'Diaz',
          role: 'Ketua Divisi',
          is_leader: 1,
          division_id: 'redaksi',
          division_name: 'Redaksi',
          image: '/team/redaksi-ketua-diaz.png',
          instagram: '@pneumadina',
          bio: 'Mengkoordinasikan proses kurasi naskah, editorial, dan jadwal terbit karya.',
          order_index: 11
        },
        {
          member_id: 'reza',
          name: 'Reza',
          role: 'Anggota',
          is_leader: 0,
          division_id: 'redaksi',
          division_name: 'Redaksi',
          image: '/team/redaksi-anggota-reza.png',
          instagram: '@pneumadina',
          bio: 'Penyuntingan naskah esai, fiksi, dan pemeriksaan akurasi wacana.',
          order_index: 12
        },
        {
          member_id: 'jasmine',
          name: 'Jasmine',
          role: 'Anggota',
          is_leader: 0,
          division_id: 'redaksi',
          division_name: 'Redaksi',
          image: '/team/redaksi-anggota-jasmine.png',
          instagram: '@pneumadina',
          bio: 'Kurasi tulisan sastra, puisi, dan interaksi dengan para kontributor.',
          order_index: 13
        },
        {
          member_id: 'ayra',
          name: 'Ayra',
          role: 'Anggota',
          is_leader: 0,
          division_id: 'redaksi',
          division_name: 'Redaksi',
          image: '/team/redaksi-anggota-ayra.png',
          instagram: '@pneumadina',
          bio: 'Editorial non-fiksi, tata bahasa naratif, dan komunikasi penulis.',
          order_index: 14
        }
      ];

      for (const m of members) {
        await conn.execute(`
          INSERT INTO team_members (member_id, name, role, is_leader, division_id, division_name, image, instagram, bio, order_index)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [m.member_id, m.name, m.role, m.is_leader, m.division_id, m.division_name, m.image, m.instagram, m.bio, m.order_index]);
      }
      console.log('✅ Seeded 14 initial team members into database.');
    }

    // 3. Update likes table to support guest likes
    try {
      await conn.query('ALTER TABLE likes MODIFY user_id int(10) unsigned NULL');
      console.log('✅ Modified likes.user_id to allow NULL.');
    } catch (e) {
      console.log('Note on likes user_id:', e.message);
    }

    try {
      const [cols] = await conn.query("SHOW COLUMNS FROM likes LIKE 'guest_id'");
      if (cols.length === 0) {
        await conn.query('ALTER TABLE likes ADD COLUMN guest_id VARCHAR(64) NULL AFTER user_id');
        await conn.query('ALTER TABLE likes ADD INDEX idx_guest_post (guest_id, post_id)');
        console.log('✅ Added guest_id to likes table.');
      }
    } catch (e) {
      console.log('Note on likes guest_id:', e.message);
    }

    await conn.end();
    console.log('🎉 Done initializing team and guest likes!');
  } catch (err) {
    console.error('Error init team/likes:', err);
  }
}

initTeamAndLikes();
