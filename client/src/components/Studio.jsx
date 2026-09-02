import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Image, 
  Tag, 
  Plus, 
  Check, 
  Layers, 
  FileUp, 
  Sparkles, 
  FileText, 
  Loader2, 
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { db, doc, setDoc } from '../firebase';
import { extractTextFromPdf, analyzeAndFormatPdfArticle } from '../utils/pdfExtractHelper';
import { slugify } from '../utils/urlHelper';

export default function Studio({ 
  onClose, 
  categories, 
  tags, 
  currentUser, 
  onPostCreated, 
  onCategoryCreated,
  postToEdit = null,
  onPostUpdated
}) {
  const [title, setTitle] = useState(postToEdit?.title || '');
  const [content, setContent] = useState(postToEdit?.content || '');
  const [thumbnail, setThumbnail] = useState(postToEdit?.thumbnail || '');
  const [localCategories, setLocalCategories] = useState(categories);
  const [selectedCategory, setSelectedCategory] = useState(
    postToEdit?.category_id || postToEdit?.categories?.[0]?.id || categories[0]?.id || 1
  );
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedTags, setSelectedTags] = useState(
    postToEdit?.tags ? postToEdit.tags.map(t => t.id || t.name) : []
  );
  const [newTagName, setNewTagName] = useState('');
  const [localTags, setLocalTags] = useState(tags);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title || '');
      setContent(postToEdit.content || '');
      setThumbnail(postToEdit.thumbnail || '');
      setSelectedCategory(postToEdit.category_id || postToEdit.categories?.[0]?.id || categories[0]?.id || 1);
      setSelectedTags(postToEdit.tags ? postToEdit.tags.map(t => t.id || t.name) : []);
    }
  }, [postToEdit]);

  // PDF Upload & Extraction State
  const [pdfScanning, setPdfScanning] = useState(false);
  const [pdfExtractResult, setPdfExtractResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  useEffect(() => {
    setLocalTags(tags);
  }, [tags]);

  const handleTagToggle = (tagId) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleAddNewCategory = async (nameToAdd) => {
    const catName = (nameToAdd || newCategoryName).trim();
    if (!catName) return;

    const newCat = {
      id: Date.now(),
      name: catName,
      slug: slugify(catName)
    };

    if (db) {
      try {
        await setDoc(doc(db, 'categories', String(newCat.id)), newCat);
      } catch (e) {}
    }

    if (!localCategories.some(c => c.name.toLowerCase() === catName.toLowerCase())) {
      setLocalCategories(prev => [...prev, newCat]);
    }
    setSelectedCategory(newCat.id);
    setNewCategoryName('');
    if (onCategoryCreated) onCategoryCreated();

    try {
      fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: catName })
      }).catch(() => {});
    } catch (e) {}

    return newCat;
  };

  const handleAddNewTag = async (tagNameToAdd) => {
    const tagName = (tagNameToAdd || newTagName).trim();
    if (!tagName) return null;

    // Check if tag already exists in localTags
    const existing = localTags.find(t => t.name.toLowerCase() === tagName.toLowerCase());
    if (existing) {
      if (!selectedTags.includes(existing.id)) {
        setSelectedTags(prev => [...prev, existing.id]);
      }
      return existing;
    }

    const newTag = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      name: tagName,
      slug: slugify(tagName)
    };

    if (db) {
      try {
        await setDoc(doc(db, 'tags', String(newTag.id)), newTag);
      } catch (e) {}
    }

    setLocalTags(prev => [...prev, newTag]);
    setSelectedTags(prev => [...prev, newTag.id]);
    setNewTagName('');

    try {
      fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: tagName })
      }).catch(() => {});
    } catch (e) {}

    return newTag;
  };

  // PDF File Handler & Extraction Runner
  const handlePdfUpload = async (file) => {
    if (!file || !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Harap pilih file berformat .pdf');
      return;
    }

    try {
      setPdfScanning(true);
      setErrorMsg('');
      setPdfExtractResult(null);

      // 1. Extract raw text from PDF
      const pdfData = await extractTextFromPdf(file);
      if (!pdfData || !pdfData.pages || pdfData.pages.length === 0) {
        throw new Error('Tidak dapat membaca isi dokumen PDF.');
      }

      // 2. Intelligent structure analysis
      const analysis = analyzeAndFormatPdfArticle(pdfData, file.name);

      // 3. Populate form fields
      setTitle(analysis.title);
      setContent(analysis.content);

      if (!thumbnail) {
        setThumbnail('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200');
      }

      // 4. Auto Match / Set Category
      const matchedCat = localCategories.find(c => 
        c.slug.toLowerCase().includes(analysis.category) || 
        c.name.toLowerCase().includes(analysis.category)
      );
      if (matchedCat) {
        setSelectedCategory(matchedCat.id);
      }

      // 5. Auto Add & Select Extracted Tags
      if (analysis.tags && analysis.tags.length > 0) {
        for (const t of analysis.tags) {
          await handleAddNewTag(t);
        }
      }

      setPdfExtractResult({
        fileName: file.name,
        numPages: analysis.numPages,
        wordCount: analysis.wordCount,
        readTimeMinutes: analysis.readTimeMinutes,
        detectedTagsCount: analysis.tags.length
      });

    } catch (err) {
      console.error('Error extracting PDF:', err);
      setErrorMsg(`Gagal memindai PDF: ${err.message || 'Format tidak didukung'}`);
    } finally {
      setPdfScanning(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePdfUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setErrorMsg('Judul dan isi artikel wajib diisi!');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const catObj = localCategories.find(c => c.id === Number(selectedCategory)) || localCategories[0] || { id: 1, name: 'Non-Fiksi', slug: 'non-fiksi' };
    const matchedTags = localTags.filter(t => selectedTags.includes(t.id));

    const postSlug = slugify(title.trim());

    // EDIT MODE SUBMISSION
    if (postToEdit) {
      const updatedPost = {
        ...postToEdit,
        title: title.trim(),
        slug: postSlug || postToEdit.slug,
        content: content.trim(),
        excerpt: content.trim().substring(0, 160).replace(/[#*`_>]/g, '') + '...',
        thumbnail: thumbnail.trim() || postToEdit.thumbnail || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200',
        category_id: catObj.id,
        category_name: catObj.name,
        categories: [catObj],
        tags: matchedTags.length > 0 ? matchedTags : (postToEdit.tags || [{ id: 1, name: 'Editorial' }]),
        read_time: Math.max(1, Math.round(content.split(/\s+/).length / 200)),
        updated_at: new Date().toISOString()
      };

      // 1. Simpan ke Cloud Firestore (Realtime)
      if (db) {
        try {
          await setDoc(doc(db, 'posts', String(updatedPost.id)), updatedPost, { merge: true });
        } catch (e) {
          console.warn('Firestore post update notice:', e);
        }
      }

      // 2. Simpan ke cache lokal
      try {
        const savedPosts = localStorage.getItem('pneumadina_posts');
        if (savedPosts) {
          const pList = JSON.parse(savedPosts);
          const newPList = pList.map(p => p.id === updatedPost.id ? updatedPost : p);
          localStorage.setItem('pneumadina_posts', JSON.stringify(newPList));
        }
      } catch (e) {}

      // 3. Notifikasi backend lokal jika aktif
      try {
        fetch(`/api/posts/${updatedPost.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            content,
            thumbnail,
            category_ids: [selectedCategory],
            tag_ids: selectedTags
          })
        }).catch(() => {});
      } catch (err) {}

      setLoading(false);
      if (onPostUpdated) onPostUpdated(updatedPost);
      onClose();
      return;
    }

    // CREATE MODE SUBMISSION
    const newPost = {
      id: Date.now(),
      title: title.trim(),
      slug: postSlug,
      content: content.trim(),
      excerpt: content.trim().substring(0, 160).replace(/[#*`_>]/g, '') + '...',
      thumbnail: thumbnail.trim() || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200',
      user_id: currentUser.id,
      author_name: currentUser.full_name,
      author_username: currentUser.username,
      author_avatar: currentUser.avatar || '/team/bph-anggota-sheiza.png',
      category_id: catObj.id,
      category_name: catObj.name,
      categories: [catObj],
      tags: matchedTags.length > 0 ? matchedTags : [{ id: 1, name: 'Editorial' }],
      status: 'published',
      likes_count: 0,
      views_count: 0,
      read_time: Math.max(1, Math.round(content.split(/\s+/).length / 200)),
      created_at: new Date().toISOString()
    };

    // 1. Simpan ke Cloud Firestore (Realtime ke seluruh dunia)
    if (db) {
      try {
        await setDoc(doc(db, 'posts', String(newPost.id)), newPost);
      } catch (e) {
        console.warn('Firestore post save notice:', e);
      }
    }

    // 2. Simpan ke cache lokal
    try {
      const savedPosts = localStorage.getItem('pneumadina_posts');
      const pList = savedPosts ? JSON.parse(savedPosts) : [];
      pList.unshift(newPost);
      localStorage.setItem('pneumadina_posts', JSON.stringify(pList));
    } catch (e) {}

    // 3. Notifikasi backend lokal jika aktif
    try {
      fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser.id,
          title,
          content,
          thumbnail,
          status: 'published',
          category_ids: [selectedCategory],
          tag_ids: selectedTags
        })
      }).catch(() => {});
    } catch (err) {}

    setLoading(false);
    if (onPostCreated) onPostCreated(newPost);
    onClose();
  };

  return (
    <div className="animate-backdrop" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(17, 24, 39, 0.8)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 400,
      padding: '10px'
    }}>
      <div className="animate-popup-enter" style={{
        backgroundColor: '#FFFFFF',
        width: '100%',
        maxWidth: '860px',
        maxHeight: '94vh',
        borderRadius: '20px',
        border: '3px solid #111827',
        boxShadow: '6px 6px 0px 0px #111827',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        {/* Header */}
        <div style={{
          padding: 'clamp(1rem, 3.5vw, 1.5rem)',
          backgroundColor: '#FFD600',
          borderBottom: '3px solid #111827',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-dark" style={{ fontSize: '0.65rem' }}>STUDIO PENULIS</span>
              {postToEdit ? (
                <span className="badge badge-yellow" style={{ fontSize: '0.65rem', backgroundColor: '#FFFFFF' }}>MODE EDIT ARTIKEL</span>
              ) : (
                <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>AI & SMART PDF SCAN</span>
              )}
            </div>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', fontWeight: '900', color: '#111827', marginTop: '2px' }}>
              {postToEdit ? 'Edit & Perbarui Artikel' : 'Tulis & Terbitkan Artikel'}
            </h2>
          </div>

          <button 
            onClick={onClose}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#111827',
              border: '2px solid #111827',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontWeight: '900',
              flexShrink: 0
            }}
          >
            <X size={18} />
          </button>
        </div>

        {errorMsg && (
          <div style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '10px 16px', fontWeight: '700', borderBottom: '1px solid #EF4444', fontSize: '0.85rem' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: 'clamp(1rem, 3.5vw, 1.5rem)', overflowY: 'auto', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* SMART PDF UPLOAD & AUTO-EXTRACT DROPZONE */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              backgroundColor: dragOver ? '#FEF08A' : pdfExtractResult ? '#ECFDF5' : '#FFFDF5',
              border: '2.5px dashed #111827',
              borderRadius: '16px',
              padding: '1.25rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '3px 3px 0px 0px #111827',
              position: 'relative'
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handlePdfUpload(e.target.files[0]);
                }
              }}
            />

            {pdfScanning ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '10px 0' }}>
                <Loader2 className="animate-spin" size={32} color="#2563EB" />
                <div style={{ fontWeight: '900', fontSize: '0.95rem', color: '#111827' }}>
                  Memindai Dokumen PDF & Menstruktur Tulisan...
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                  Mengekstrak judul, bab, abstrak, tabel, kategori, dan tag otomatis.
                </div>
              </div>
            ) : pdfExtractResult ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: '900', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={20} /> PDF Berhasil Dipindai & Di-generate!
                </div>
                <div style={{ fontSize: '0.8rem', color: '#111827', fontWeight: '700' }}>
                  📄 <strong>{pdfExtractResult.fileName}</strong> ({pdfExtractResult.numPages} Halaman, ~{pdfExtractResult.wordCount} Kata, {pdfExtractResult.readTimeMinutes} menit baca)
                </div>
                <div style={{ fontSize: '0.725rem', color: '#059669', fontWeight: '700' }}>
                  ✨ Judul, isi naskah, kategori, dan {pdfExtractResult.detectedTagsCount} tag telah terisi otomatis di bawah. Klik lagi untuk upload PDF lain.
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: '#FFD600',
                  border: '2px solid #111827',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '2px 2px 0px 0px #111827'
                }}>
                  <FileUp size={22} color="#111827" />
                </div>
                <div style={{ fontWeight: '900', fontSize: '0.9rem', color: '#111827' }}>
                  ✨ Upload File PDF Artikel (Auto Scan & Extract)
                </div>
                <div style={{ fontSize: '0.75rem', color: '#4B5563', maxWidth: '480px' }}>
                  Tarik & lepas file artikel PDF (seperti makalah/jurnal ilmiah), sistem akan mengekstrak judul, bab, abstrak, kategori, dan tag otomatis tanpa perlu ketik ulang!
                </div>
              </div>
            )}
          </div>

          {/* Judul Artikel */}
          <div>
            <label style={{ display: 'block', fontWeight: '900', fontSize: '0.8rem', marginBottom: '4px', color: '#111827' }}>
              JUDUL ARTIKEL *
            </label>
            <input
              type="text"
              required
              placeholder="Masukkan judul artikel yang memikat..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '2px solid #111827',
                fontSize: '0.95rem',
                fontWeight: '700',
                outline: 'none'
              }}
            />
          </div>

          {/* Kategori & Thumbnail Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            
            {/* Kategori Selection */}
            <div>
              <label style={{ display: 'block', fontWeight: '900', fontSize: '0.8rem', marginBottom: '4px', color: '#111827' }}>
                KATEGORI UTAMA *
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '2px solid #111827',
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                {localCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Tambah Kategori Baru */}
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                <input
                  type="text"
                  placeholder="+ Kategori Baru..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: '1.5px solid #111827',
                    fontSize: '0.75rem'
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleAddNewCategory()}
                  className="btn btn-outline"
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  <Plus size={12} /> Tambah
                </button>
              </div>
            </div>

            {/* Thumbnail URL */}
            <div>
              <label style={{ display: 'block', fontWeight: '900', fontSize: '0.8rem', marginBottom: '4px', color: '#111827' }}>
                FOTO SAMPUL / THUMBNAIL URL
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '2px solid #111827',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>
              <div style={{ fontSize: '0.7rem', color: '#6B7280', marginTop: '4px' }}>
                * Kosongkan untuk menggunakan foto cover otomatis bertema riset.
              </div>
            </div>

          </div>

          {/* Tags Selection & Addition */}
          <div>
            <label style={{ display: 'block', fontWeight: '900', fontSize: '0.8rem', marginBottom: '6px', color: '#111827' }}>
              PILIH / TAMBAH TAGS
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
              {localTags.map(t => {
                const isSelected = selectedTags.includes(t.id);
                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => handleTagToggle(t.id)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      border: '1.5px solid #111827',
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#FFD600' : '#FFFFFF',
                      color: '#111827',
                      boxShadow: isSelected ? '2px 2px 0px 0px #111827' : 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {isSelected && <Check size={12} />} #{t.name}
                  </button>
                );
              })}
            </div>

            {/* Input Tag Baru */}
            <div style={{ display: 'flex', gap: '6px', maxWidth: '300px' }}>
              <input
                type="text"
                placeholder="+ Buat Tag Baru..."
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: '1.5px solid #111827',
                  fontSize: '0.75rem'
                }}
              />
              <button
                type="button"
                onClick={() => handleAddNewTag()}
                className="btn btn-outline"
                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
              >
                <Plus size={12} /> Tambah
              </button>
            </div>
          </div>

          {/* Content Editor */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label style={{ fontWeight: '900', fontSize: '0.8rem', color: '#111827' }}>
                ISI ARTIKEL (MENDUKUNG MARKDOWN FORMAT) *
              </label>
              <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>
                Mendukung: # H1, ## H2, &gt; Kutipan, **Tebal**, dll.
              </span>
            </div>
            <textarea
              required
              rows={12}
              placeholder="Tulis naskah lengkap Anda di sini atau gunakan fitur Upload PDF di atas..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '2.5px solid #111827',
                fontSize: '0.875rem',
                lineHeight: '1.6',
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Footer Actions */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            paddingTop: '12px',
            borderTop: '2px solid #E5E7EB'
          }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-yellow"
              style={{ padding: '8px 22px', fontSize: '0.85rem' }}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} /> {postToEdit ? 'Menyimpan...' : 'Menerbitkan...'}
                </>
              ) : (
                <>
                  <Send size={16} /> {postToEdit ? 'Simpan Perubahan' : 'Terbitkan Artikel'}
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
