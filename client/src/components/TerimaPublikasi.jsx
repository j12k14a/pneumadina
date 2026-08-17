import React, { useState } from 'react';
import { X, Send, Image, FileText, Camera, Link as LinkIcon, CheckCircle2, Palette, BookOpen } from 'lucide-react';

export default function TerimaPublikasi({ onClose, onSubmitSuccess }) {
  const [type, setType] = useState('Fiksi');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !title.trim()) {
      setErrorMsg('Nama, Email, dan Judul karya wajib diisi!');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          type,
          title,
          summary,
          link,
          image
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        if (onSubmitSuccess) onSubmitSuccess();
      } else {
        setErrorMsg(data.message || 'Gagal mengirim karya.');
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
        maxWidth: '720px',
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
          backgroundColor: '#FFD600',
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.45) 1.5px, transparent 1.5px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.45) 1.5px, transparent 1.5px)
          `,
          backgroundSize: '16px 16px',
          padding: 'clamp(1rem, 4vw, 1.5rem)',
          borderBottom: '3px solid #111827',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div>
            <span className="badge badge-dark" style={{ fontSize: '0.65rem', marginBottom: '2px' }}>@PNEUMADINA</span>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.3rem, 4vw, 1.7rem)', fontWeight: '900', color: '#111827' }}>
              TERIMA PUBLIKASI KARYA
            </h2>
            <p style={{ fontSize: '0.775rem', fontWeight: '700', color: '#111827', opacity: 0.9 }}>
              Pilih kanal karya Anda: <strong>Fiksi, Non-Fiksi, Desain, atau Fotografi</strong>.
            </p>
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

        {success ? (
          <div style={{ padding: '30px 20px', textAlign: 'center' }}>
            <CheckCircle2 size={56} color="#059669" style={{ margin: '0 auto 14px auto' }} />
            <h3 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: '900', marginBottom: '8px' }}>
              Karya Berhasil Dikirimkan!
            </h3>
            <p style={{ color: '#4B5563', marginBottom: '20px', lineHeight: '1.6', fontSize: '0.875rem' }}>
              Terima kasih kawan! Redaksi dan Tim Author Pneumadina akan mereview karya Anda. Karya yang disetujui akan diterbitkan langsung di beranda Pneumadina.
            </p>
            <button className="btn btn-yellow" onClick={onClose} style={{ padding: '8px 20px' }}>
              Tutup Modal
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: 'clamp(1rem, 4vw, 1.5rem)', overflowY: 'auto', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {errorMsg && (
              <div style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '10px 14px', borderRadius: '8px', fontWeight: '700', fontSize: '0.85rem' }}>
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Publication Type (4 Categorized Channels per Requirement 1) */}
            <div>
              <label style={{ display: 'block', fontWeight: '900', fontSize: '0.775rem', marginBottom: '6px', color: '#111827' }}>
                KATEGORI KARYA UTAMA *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setType('Fiksi')}
                  className={`btn ${type === 'Fiksi' ? 'btn-yellow' : 'btn-outline'}`}
                  style={{ padding: '8px 6px', fontSize: '0.775rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
                >
                  <BookOpen size={16} color="#2563EB" /> 📖 Fiksi
                </button>

                <button
                  type="button"
                  onClick={() => setType('Non-Fiksi')}
                  className={`btn ${type === 'Non-Fiksi' ? 'btn-yellow' : 'btn-outline'}`}
                  style={{ padding: '8px 6px', fontSize: '0.775rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
                >
                  <FileText size={16} color="#2563EB" /> ✍️ Non-Fiksi
                </button>

                <button
                  type="button"
                  onClick={() => setType('Desain')}
                  className={`btn ${type === 'Desain' ? 'btn-yellow' : 'btn-outline'}`}
                  style={{ padding: '8px 6px', fontSize: '0.775rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
                >
                  <Palette size={16} color="#2563EB" /> 🎨 Desain
                </button>

                <button
                  type="button"
                  onClick={() => setType('Fotografi')}
                  className={`btn ${type === 'Fotografi' ? 'btn-yellow' : 'btn-outline'}`}
                  style={{ padding: '8px 6px', fontSize: '0.775rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
                >
                  <Camera size={16} color="#2563EB" /> 📸 Fotografi
                </button>
              </div>
            </div>

            {/* Author Contact Info */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '900', fontSize: '0.775rem', marginBottom: '4px' }}>
                  NAMA LENGKAP / PENA *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '2px solid #111827', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: '900', fontSize: '0.775rem', marginBottom: '4px' }}>
                  EMAIL KONTAK *
                </label>
                <input
                  type="email"
                  required
                  placeholder="email@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '2px solid #111827', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label style={{ display: 'block', fontWeight: '900', fontSize: '0.775rem', marginBottom: '4px' }}>
                JUDUL KARYA / DOKUMEN *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Merawat Toleransi Lintas Generasi"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '2px solid #111827', fontSize: '0.85rem' }}
              />
            </div>

            {/* Summary */}
            <div>
              <label style={{ display: 'block', fontWeight: '900', fontSize: '0.775rem', marginBottom: '4px' }}>
                ABSTRAK / RINGKASAN KARYA
              </label>
              <textarea
                rows={3}
                placeholder="Ringkasan esai, fiksi, atau deskripsi ilustrasi/fotografi..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '2px solid #111827', fontSize: '0.85rem', resize: 'vertical' }}
              />
            </div>

            {/* Document Link */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '900', fontSize: '0.775rem', marginBottom: '4px' }}>
                <LinkIcon size={14} color="#2563EB" /> LINK DOKUMEN (DRIVE / NOTION / MEDIUM)
              </label>
              <input
                type="url"
                placeholder="https://drive.google.com/..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '2px solid #111827', fontSize: '0.85rem' }}
              />
            </div>

            {/* Image Upload Link */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '900', fontSize: '0.775rem', marginBottom: '4px' }}>
                <Image size={14} color="#2563EB" /> TAUTAN GAMBAR / COVER (OPSIONAL)
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/... atau URL gambar"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '2px solid #111827', fontSize: '0.85rem' }}
              />
              {image && (
                <div style={{ marginTop: '6px', borderRadius: '8px', overflow: 'hidden', maxHeight: '100px', border: '1px solid #111827' }}>
                  <img src={image} alt="Preview" style={{ width: '100%', height: '100px', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-yellow"
              style={{ width: '100%', padding: '10px', fontSize: '0.9rem', fontWeight: '900', marginTop: '4px' }}
            >
              <Send size={16} /> {loading ? 'Mengirimkan...' : `Kirim Karya (${type})`}
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
