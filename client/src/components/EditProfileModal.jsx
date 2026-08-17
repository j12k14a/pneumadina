import React, { useState } from 'react';
import { X, User, Save, Image, FileText } from 'lucide-react';

export default function EditProfileModal({ currentUser, onClose, onUpdateSuccess }) {
  const [fullName, setFullName] = useState(currentUser?.full_name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Nama Lengkap tidak boleh kosong!');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          bio,
          avatar
        })
      });

      const data = await res.json();
      if (data.success) {
        setMsg('🎉 Profil berhasil diperbarui!');
        onUpdateSuccess(data.user);
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setErrorMsg(data.message || 'Gagal memperbarui profil.');
      }
    } catch (err) {
      console.error('Update profile error:', err);
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
      zIndex: 450,
      padding: '10px'
    }}>
      <div className="animate-popup-enter" style={{
        backgroundColor: '#FFFFFF',
        width: '100%',
        maxWidth: '560px',
        maxHeight: '94vh',
        borderRadius: '20px',
        border: '3px solid #111827',
        boxShadow: '6px 6px 0px 0px #111827',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Header */}
        <div style={{
          padding: 'clamp(1rem, 4vw, 1.25rem)',
          backgroundColor: '#FFD600',
          borderBottom: '3px solid #111827',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div>
            <span className="badge badge-dark" style={{ fontSize: '0.65rem', marginBottom: '2px' }}>PENGATURAN AKUN</span>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', fontWeight: '900', color: '#111827' }}>
              Edit Profil Pengguna
            </h2>
          </div>

          <button 
            onClick={onClose}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#111827',
              border: '2px solid #111827',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontWeight: '900',
              flexShrink: 0
            }}
          >
            <X size={16} />
          </button>
        </div>

        {msg && (
          <div style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '10px 16px', fontWeight: '800', borderBottom: '1px solid #059669', fontSize: '0.85rem' }}>
            {msg}
          </div>
        )}

        {errorMsg && (
          <div style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '10px 16px', fontWeight: '800', borderBottom: '1px solid #EF4444', fontSize: '0.85rem' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: 'clamp(1rem, 4vw, 1.25rem)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Avatar Preview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#FAF8F5', padding: '12px', borderRadius: '12px', border: '1.5px solid #111827' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: '#FFD600',
              border: '2px solid #111827',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900',
              fontSize: '1.4rem',
              color: '#111827',
              boxShadow: '2px 2px 0px 0px #111827',
              flexShrink: 0
            }}>
              {avatar ? (
                <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
              ) : (
                fullName.charAt(0) || 'U'
              )}
            </div>
            <div>
              <div style={{ fontWeight: '900', fontSize: '0.95rem', color: '#111827' }}>{fullName || currentUser?.username}</div>
              <div style={{ fontSize: '0.725rem', color: '#2563EB', fontWeight: '700' }}>Peran: {currentUser?.role_name}</div>
              <div style={{ fontSize: '0.725rem', color: '#6B7280' }}>✉️ {currentUser?.email}</div>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label style={{ display: 'block', fontWeight: '900', fontSize: '0.775rem', marginBottom: '4px', color: '#111827' }}>
              NAMA LENGKAP *
            </label>
            <input 
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nama Lengkap Anda"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '2px solid #111827',
                fontSize: '0.875rem',
                fontWeight: '700'
              }}
            />
          </div>

          {/* Avatar URL */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '900', fontSize: '0.775rem', marginBottom: '4px', color: '#111827' }}>
              <Image size={14} color="#2563EB" /> TAUTAN FOTO PROFIL (URL)
            </label>
            <input 
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://images.unsplash.com/... atau URL foto profil Anda"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '2px solid #111827',
                fontSize: '0.85rem'
              }}
            />
          </div>

          {/* Bio */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '900', fontSize: '0.775rem', marginBottom: '4px', color: '#111827' }}>
              <FileText size={14} color="#2563EB" /> BIO / DESKRIPSI SINGKAT
            </label>
            <textarea 
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tuliskan bio singkat, ketertarikan, atau latar belakang Anda..."
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '2px solid #111827',
                fontSize: '0.85rem',
                resize: 'vertical'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-yellow"
            style={{ width: '100%', padding: '10px', fontSize: '0.9rem', fontWeight: '900', marginTop: '4px' }}
          >
            <Save size={16} /> {loading ? 'Menyimpan...' : 'Simpan Perubahan Profil'}
          </button>

        </form>

      </div>
    </div>
  );
}
