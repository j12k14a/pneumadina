const mysql = require('mysql2/promise');

async function updateContent() {
  try {
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'pneumadina'
    });

    console.log('Connected to MySQL [pneumadina]...');

    // 1. Update Tags
    await conn.query('DELETE FROM post_tags');
    await conn.query('DELETE FROM tags');
    await conn.query(`
      INSERT INTO tags (id, name, slug) VALUES
      (1, 'Pluralisme', 'pluralisme'),
      (2, 'BookClub', 'bookclub'),
      (3, 'Pasifisme', 'pasifisme'),
      (4, 'SainsKritis', 'sainskritis'),
      (5, 'Demokrasi', 'demokrasi'),
      (6, 'Literasi', 'literasi'),
      (7, 'Paramadina', 'paramadina'),
      (8, 'Tridaya', 'tridaya'),
      (9, 'SARA-SEHAN', 'sara-sehan'),
      (10, 'Ekosentrisme', 'ekosentrisme');
    `);
    console.log('✅ Tags updated to Pneumadina themes!');

    // 2. Clean old posts
    await conn.query('DELETE FROM comments');
    await conn.query('DELETE FROM likes');
    await conn.query('DELETE FROM bookmarks');
    await conn.query('DELETE FROM post_categories');
    await conn.query('DELETE FROM posts');

    const posts = [
      {
        id: 1,
        user_id: 2, // Diandra
        title: 'Manifesto Proker KKP: Membangun Sains Inklusif dan Mengikis Hegemoni Keilmuan',
        slug: 'manifesto-proker-kkp-membangun-sains-inklusif',
        content: `Divisi Keilmuan, Kajian, dan Penelitian (KKP) Pneumadina hadir dengan keyakinan epistemologis mendasar: sains dan ilmu pengetahuan tidak boleh bersifat hierarkis, reduksionis, koruptif, ataupun hegemonik. 

Ilmu pengetahuan sejati harus inklusif, egaliter, harmonis, progresif, dan senantiasa berpijak pada kejujuran dialektis. Melalui program kerja KKP, Pneumadina menginisiasi riset-riset sosial kritis, seperti pemetaan survei tingkat toleransi dan kebebasan berekspresi di lingkungan kampus Universitas Paramadina.

Kami menolak eksklusivitas menara gading akademis. Selaras dengan Tridaya cipta, rasa, dan karsa, ruang riset Pneumadina terbuka bagi seluruh mahasiswa lintas SARA untuk mengkaji wacana kemanusiaan dan keadilan sosial tanpa rasa takut.`,
        thumbnail: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
        categoryId: 2, // Non-Fiksi
        tagIds: [1, 4, 7] // Pluralisme, SainsKritis, Paramadina
      },
      {
        id: 2,
        user_id: 3, // Tsaqilah
        title: 'Buku Panduan Tata Cara Persidangan dan Musyawarah Pleno Pneumadina',
        slug: 'panduan-tata-cara-persidangan-musyawarah-pleno-pneumadina',
        content: `Sidang atau musyawarah merupakan forum formal tertinggi organisasi untuk merumuskan mufakat yang wajib ditaati oleh seluruh elemen komunitas. 

Dalam tradisi persidangan Pneumadina, kedaulatan ada di tangan anggota yang diwakili oleh tiga atau dua presidium sidang. Setiap peserta sidang memiliki hak konstitusional:
1. **Hak Bicara**: Bertanya, berpendapat, dan menyampaikan sanggahan secara lisan maupun tertulis.
2. **Hak Suara**: Mengambil bagian dalam penentuan keputusan akhir.
3. **Hak Memilih & Dipilih**: Mengajukan dan dicalonkan dalam suksesi kepengurusan.

Ketukan palu sidang memiliki marwah simbolis:
- **1 Kali Ketukan**: Pengesahan keputusan per poin / pasal, skorsing waktu singkat, atau serah terima palu.
- **2 Kali Ketukan**: Skorsing atau pencabutan skorsing jangka panjang (lobi-lobi).
- **3 Kali Ketukan**: Pembukaan dan penutupan resmi sidang pleno atau pengesahan ketetapan final kongres.
- **Ketukan Berkali-kali**: Menertibkan suasana forum yang kehilangan keteraturan (*order*).`,
        thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
        categoryId: 2, // Non-Fiksi
        tagIds: [5, 6, 7] // Demokrasi, Literasi, Paramadina
      },
      {
        id: 3,
        user_id: 1, // Jawsyan
        title: 'Program MAJEMUK: Merajut Dialog Antariman dan Kerelawanan Lintas SARA',
        slug: 'program-majemuk-merajut-dialog-antariman-lintas-sara',
        content: `Program MAJEMUK (Mari Jenguk-Menjenguk) adalah komitmen sosial Pneumadina untuk merawat kebhinekaan dalam praksis nyata. Kami meyakini bahwa pasifisme dan demokrasi tidak cukup hanya didiskusikan di ruang kelas, tetapi harus hadir menjenguk dan mendengar realitas saudara-saudara kita dari berbagai suku, agama, ras, dan adat.

Melalui orientasi kultural dan jurnalisme empati, MAJEMUK menyelenggarakan:
- *Interfaith & Intercultural Dialogues* bersama paguyuban dan pemuka lintas iman.
- Kunjungan komunitas adat dan liputan perayaan sakral nusantara (Bulan Wakesan Wiwitan, Nyepi, hingga sarasehan lintas SARA).
- Pengabdian kemanusiaan yang berkeadilan dan egaliter.

Pneumadina percaya bahwa keberagaman bukanlah ancaman, melainkan kekayaan peradaban yang harus dirawat dengan dialog yang jujur dan tulus.`,
        thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
        categoryId: 2, // Non-Fiksi
        tagIds: [1, 3, 9] // Pluralisme, Pasifisme, SARA-SEHAN
      },
      {
        id: 4,
        user_id: 4, // Mariam
        title: 'Selasar Senja Cipayung: Cerpen Tentang Ruang Baca dan Persahabatan',
        slug: 'selasar-senja-cipayung-cerpen-ruang-baca',
        content: `Angin senja di selasar Gedung A Kampus Cipayung berhembus perlahan, menerbangkan ujung lembaran buku yang tergeletak di atas karpet lapak baca. 

Di lingkaran kecil itu, lima mahasiswa duduk beralaskan karpet sederhana. Tak ada sekat jurusan atau latar belakang suku yang membedakan. Wajah-wajah mereka tenggelam dalam keheningan membaca selama tiga puluh menit pertama, sebelum tawa dan perdebatan hangat merebak saat sesi telaah dimulai.

"Buku ini tidak sekadar bercerita tentang sejarah," ujar salah satu kawan sambil mengetuk sampul buku tebalnya. "Buku ini menagih nurani kita tentang apa arti menjadi manusia yang adil."

Di sinilah Pneumadina menemukan rumahnya: bukan pada gedung yang megah, melainkan pada ketulusan untuk saling berbagi kata, rasa, dan secangkir kopi di bawah temaram lampu kampus.`,
        thumbnail: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=800&q=80',
        categoryId: 1, // Fiksi
        tagIds: [2, 6, 8] // BookClub, Literasi, Tridaya
      },
      {
        id: 5,
        user_id: 4, // Mariam
        title: 'Nyanyian Kosmos di Bawah Langit Paramadina',
        slug: 'nyanyian-kosmos-di-bawah-langit-paramadina',
        content: `Bumi bernapas dalam bisik dedaunan basah,
Bukan sekadar pijakan bagi keserakahan manusia.
Kami menanggalkan ego antroposentrisme,
Menunduk hormat pada siklus tanah dan air yang merawat hayat.

Dalam setiap lembar zine yang dicetak,
Ada komitmen untuk menjaga rimba dan udara.
Pneumadina melangkah dengan kesadaran kosmosentris:
Bahwa mencintai manusia sejati menuntut kita menjaga rumah tempat kita bersama berteduh.`,
        thumbnail: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80',
        categoryId: 1, // Fiksi
        tagIds: [3, 8, 10] // Pasifisme, Tridaya, Ekosentrisme
      },
      {
        id: 6,
        user_id: 2, // Diandra
        title: 'Eksplorasi Visual PneuMaGazine: Menghidupkan Tridaya Cipta, Rasa, dan Karsa',
        slug: 'eksplorasi-visual-pneumagazine-tridaya',
        content: `PneuMaGazine dirancang bukan hanya sebagai media bacaan, melainkan artefak visual yang merayakan kebebasan estetika. Mengadopsi prinsip desain Neobrutalism berkarakter tegas—dengan garis tepi tebal, tipografi lugas, dan kontras warna kuning-hitam khas Pneumadina—setiap edisi zine menjadi saksi keberanian berekspresi.

Divisi Publikasi, Desain, dan Dokumentasi (PDD) memadukan kolase foto analog, ilustrasi tangan kontemporer, dan tata letak eksperimental. 

"Karya seni yang baik adalah yang mampu memprovokasi kesadaran pembacanya untuk berpikir kritis dan bertindak adil." Zine ini adalah ruang terbuka bagi seluruh pegiat desain grafis kampus untuk mempublikasikan gagasan visual mereka ke publik luas.`,
        thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
        categoryId: 3, // Desain
        tagIds: [6, 8, 7] // Literasi, Tridaya, Paramadina
      },
      {
        id: 7,
        user_id: 3, // Tsaqilah
        title: 'Potret Narasi: Lapak Baca Buku Gratis dan Dialog Lintas SARA',
        slug: 'potret-narasi-lapak-baca-gratis-paramadina',
        content: `Sebuah rekaman visual dokumenter yang mengabadikan hangatnya Lapak Baca Selasar Literasi dan sarasehan budaya di Universitas Paramadina. Melalui lensa fotografi jurnalistik, terekam momen-momen otentik saat para mahasiswa berdialog, membaca di lantai perpustakaan, dan merajut toleransi lintas iman.

Foto-foto ini bercerita lebih dari sekadar dokumentasi acara: ia adalah arsip hidup tentang bagaimana ruang inklusif dapat tumbuh subur di tengah masyarakat urban kampus.`,
        thumbnail: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
        categoryId: 4, // Fotografi
        tagIds: [1, 2, 7] // Pluralisme, BookClub, Paramadina
      },
      {
        id: 8,
        user_id: 1, // Jawsyan
        title: 'Menuju Kongres Perdana I Komunitas Pneumadina: Tonggak Konstitusi AD/ART 2026',
        slug: 'menuju-kongres-perdana-i-komunitas-pneumadina-2026',
        content: `Sabtu, 27 Juni 2026 menjadi catatan bersejarah bagi Komunitas Pneumadina dengan diselenggarakannya Kongres Perdana (I) bertempat di Ruang A 2-5, Gedung A, Universitas Paramadina Kampus Cipayung.

Kongres Perdana ini mengusung agenda musyawarah komprehensif:
1. **Sidang Pleno I**: Penentuan dan Pengesahan Presidium Sidang Tetap serta Tata Tertib Kongres.
2. **Sidang Pleno II**: Pemaparan dan Pengesahan LPJ per Divisi (BPH, Litbang, PDD, Kaderisasi, Redaksi) disertai sesi refleksi apresiasi-kritik-saran.
3. **Sidang Pleno III**: Peninjauan mendalam dan Pengesahan AD-ART Perdana Pneumadina 2026 sebagai haluan dasar organisasi.
4. **Sidang Pleno IV**: Penetapan Garis Besar Program Kerja (GBPK) dan suksesi estafet kepemimpinan baru.

Kongres ini menjadi bukti nyata kedewasaan demokrasi komunitas kami dalam membangun kelembagaan yang transparan, akuntabel, dan berakar pada nilai-nilai persaudaraan.`,
        thumbnail: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
        categoryId: 2, // Non-Fiksi
        tagIds: [5, 7, 1] // Demokrasi, Paramadina, Pluralisme
      }
    ];

    for (const post of posts) {
      const [result] = await conn.execute(`
        INSERT INTO posts (id, user_id, title, slug, content, thumbnail, status, published_at, created_at)
        VALUES (?, ?, ?, ?, ?, ?, 'published', NOW(), NOW())
      `, [post.id, post.user_id, post.title, post.slug, post.content, post.thumbnail]);

      // Category relation
      await conn.execute(`INSERT INTO post_categories (post_id, category_id) VALUES (?, ?)`, [post.id, post.categoryId]);

      // Tag relations
      for (const tagId of post.tagIds) {
        await conn.execute(`INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)`, [post.id, tagId]);
      }

      // Add default likes
      await conn.execute(`INSERT INTO likes (user_id, post_id, created_at) VALUES (1, ?, NOW())`, [post.id]);
      await conn.execute(`INSERT INTO likes (user_id, post_id, created_at) VALUES (2, ?, NOW())`, [post.id]);
      if (post.id % 2 === 0) {
        await conn.execute(`INSERT INTO likes (user_id, post_id, created_at) VALUES (3, ?, NOW())`, [post.id]);
      }

      // Add a welcoming comment
      await conn.execute(`
        INSERT INTO comments (post_id, user_id, parent_id, content, status, created_at)
        VALUES (?, 1, NULL, 'Luar biasa, sangat menginspirasi gagasan dan pergerakan Pneumadina kita!', 'visible', NOW())
      `, [post.id]);
    }

    console.log('✅ Successfully seeded 8 authentic Pneumadina articles across all 4 categories!');
    await conn.end();
  } catch (err) {
    console.error('Error updating content:', err);
  }
}

updateContent();
