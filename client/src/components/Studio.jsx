import React, { useState, useEffect } from 'react';
import { X, Send, Image, Tag, Plus, Check, Layers } from 'lucide-react';

export default function Studio({ onClose, categories, tags, currentUser, onPostCreated, onCategoryCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [localCategories, setLocalCategories] = useState(categories);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || 1);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTagName, setNewTagName] = useState('');
  const [localTags, setLocalTags] = useState(tags);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

  const handleAddNewCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName })
      });
      const data = await res.json();
      if (data.success) {
        const addedCat = data.data;
        if (!localCategories.some(c => c.id === addedCat.id)) {
          setLocalCategories([...localCategories, addedCat]);
        }
        setSelectedCategory(addedCat.id);
        setNewCategoryName('');
        if (onCategoryCreated) onCategoryCreated();
      } else {
        setErrorMsg(data.message || 'Gagal membuat kategori baru');
      }
    } catch (err) {
      console.error('Error adding category:', err);
    }
  };

  const handleAddNewTag = async () => {
    if (!newTagName.trim()) return;
    try {
      const res = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTagName })
      });
      const data = await res.json();
      if (data.success) {
        const addedTag = data.data;
        if (!localTags.some(t => t.id === addedTag.id)) {
          setLocalTags([...localTags, addedTag]);
        }
        if (!selectedTags.includes(addedTag.id)) {
          setSelectedTags([...selectedTags, addedTag.id]);
        }
        setNewTagName('');
      }
    } catch (err) {
      console.error('Error adding tag:', err);
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

    try {
      const res = await fetch('/api/posts', {
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
      });

      const data = await res.json();
      if (data.success) {
        onPostCreated();
        onClose();
      } else {
        setErrorMsg(data.message || 'Gagal menerbitkan artikel.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Terjadi kesalahan koneksi server.');
    } finally {
      setLoading(false);
    }
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
        maxWidth: '820px',
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
          padding: 'clamp(1rem, 4vw, 1.5rem)',
          backgroundColor: '#FFD600',
          borderBottom: '3px solid #111827',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div>
            <span className="badge badge-dark" style={{ fontSize: '0.65rem', marginBottom: '2px' }}>STUDIO PENULIS</span>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', fontWeight: '900', color: '#111827' }}>
              Tulis & Terbitkan Artikel
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
        <form onSubmit={handleSubmit} style={{ padding: 'clamp(1rem, 4vw, 1.5rem)', overflowY: 'auto', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div>
            <label style={{ display: 'block', fontWeight: '900', fontSize: '0.8rem', marginBottom: '4px', color: '#111827' }}>
              JUDUL ARTIKEL *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Merawat Kerukunan Lintas SARA di Era Modern"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '2px solid #111827',
                fontSize: '0.9rem',
                fontWeight: '700',
                outline: 'none'
              }}
            />
          </div>

          {/* Cover Photo Input */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '900', fontSize: '0.8rem', marginBottom: '4px', color: '#111827' }}>
              <Image size={15} color="#2563EB" /> URL SAMPUL FOTO / COVER IMAGE (OPSIONAL)
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/... atau URL gambar cover"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '2px solid #111827',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            {thumbnail && (
              <div style={{ marginTop: '6px', borderRadius: '8px', overflow: 'hidden', maxHeight: '120px', border: '1px solid #111827' }}>
                <img src={thumbnail} alt="Cover Preview" style={{ width: '100%', height: '120px', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
              </div>
            )}
          </div>

          {/* Category Selector & Add Custom Category */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '900', fontSize: '0.8rem', marginBottom: '6px', color: '#111827' }}>
              <Layers size={15} color="#2563EB" /> PILIH / TAMBAH KATEGORI UTAMA *
            </label>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
              {localCategories.map(cat => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`btn ${selectedCategory === cat.id ? 'btn-yellow' : 'btn-outline'}`}
                  style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                >
                  {cat.name} {selectedCategory === cat.id && '✓'}
                </button>
              ))}
            </div>

            {/* Input to Create New Category */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <input 
                type="text"
                placeholder="Buat kategori baru (misal: Sastra, Opini, Riset)..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                style={{
                  flexGrow: 1,
                  minWidth: '180px',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: '1.5px solid #111827',
                  fontSize: '0.8rem'
                }}
              />
              <button 
                type="button"
                onClick={handleAddNewCategory}
                className="btn btn-yellow"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                <Plus size={15} /> Tambah Kategori
              </button>
            </div>
          </div>

          {/* Tags Selector & Add Custom Tag */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '900', fontSize: '0.8rem', marginBottom: '6px', color: '#111827' }}>
              <Tag size={15} color="#2563EB" /> PILIH / TAMBAH TAGS
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
                      padding: '3px 10px',
                      borderRadius: '9999px',
                      border: '1.5px solid #111827',
                      backgroundColor: isSelected ? '#111827' : '#FFFFFF',
                      color: isSelected ? '#FFD600' : '#111827',
                      fontWeight: '800',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    #{t.name} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>

            {/* Input to Create New Custom Tag */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <input 
                type="text"
                placeholder="Buat tag baru (misal: #PasifismeGlobal)"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                style={{
                  flexGrow: 1,
                  minWidth: '180px',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: '1.5px solid #111827',
                  fontSize: '0.8rem'
                }}
              />
              <button 
                type="button"
                onClick={handleAddNewTag}
                className="btn btn-yellow"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                <Plus size={15} /> Tambah Tag
              </button>
            </div>
          </div>

          {/* Main Article Content Input */}
          <div>
            <label style={{ display: 'block', fontWeight: '900', fontSize: '0.8rem', marginBottom: '4px', color: '#111827' }}>
              ISI ARTIKEL / GAGASAN *
            </label>
            <textarea
              required
              rows={7}
              placeholder="Tuliskan esai, analisa, gagasan, atau puisi Anda..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #111827',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-yellow"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '0.95rem',
              fontWeight: '900',
              marginTop: '4px'
            }}
          >
            <Send size={16} /> {loading ? 'Memproses Publikasi...' : 'Terbitkan Artikel Sekarang'}
          </button>

        </form>

      </div>
    </div>
  );
}
