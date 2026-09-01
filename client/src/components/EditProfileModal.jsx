import React, { useState } from 'react';
import { X, User, Save, Image, FileText, Upload } from 'lucide-react';
import { db, doc, setDoc } from '../firebase';

export default function EditProfileModal({ currentUser, onClose, onUpdateSuccess }) {
  const [fullName, setFullName] = useState(currentUser?.full_name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg('Ukuran file maksimal 2 MB');
      return;
    }

    setUploadingPhoto(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatar(event.target.result);
      setUploadingPhoto(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Nama Lengkap tidak boleh kosong!');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const updatedUser = {
      ...currentUser,
      full_name: fullName.trim(),
      bio: bio.trim(),
      avatar: avatar.trim()
    };

    // 1. Simpan langsung ke Cloud Firestore (Realtime)
    if (db && currentUser?.id) {
      try {
        await setDoc(doc(db, 'users', String(currentUser.id)), {
          full_name: updatedUser.full_name,
          bio: updatedUser.bio,
          avatar: updatedUser.avatar
        }, { merge: true });
      } catch (err) {
        console.warn('Firestore update profile notice:', err);
      }
    }

    // 2. Simpan ke localStorage
    try {
      localStorage.setItem('pneumadina_user', JSON.stringify(updatedUser));
      const savedUsers = localStorage.getItem('pneumadina_users');
      if (savedUsers) {
        const uList = JSON.parse(savedUsers);
        const updatedList = uList.map(u => u.id === currentUser.id ? { ...u, ...updatedUser } : u);
        localStorage.setItem('pneumadina_users', JSON.stringify(updatedList));
      }
    } catch (e) {}

    // 3. Sync ke backend lokal jika tersedia
    try {
      fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: updatedUser.full_name,
          bio: updatedUser.bio,
          avatar: updatedUser.avatar
        })
      }).catch(() => {});
    } catch (err) {}

    setMsg('🎉 Profil berhasil diperbarui!');
    if (onUpdateSuccess) onUpdateSuccess(updatedUser);
    setTimeout(() => {
      onClose();
    }, 1000);
    setLoading(false);
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

          {/* Avatar URL & File Upload */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: '900', fontSize: '0.775rem', marginBottom: '6px', color: '#111827' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Image size={14} color="#2563EB" /> FOTO PROFIL
              </span>
              <label style={{ 
                cursor: 'pointer', 
                backgroundColor: '#EFF6FF', 
                color: '#1D4ED8', 
                border: '1.5px solid #2563EB', 
                padding: '3px 8px', 
                borderRadius: '6px', 
                fontSize: '0.725rem', 
                fontWeight: '800',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Upload size={12} /> {uploadingPhoto ? 'Mengunggah...' : 'Unggah dari Komputer'}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  style={{ display: 'none' }} 
                />
              </label>
            </label>

            <input 
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://... atau /team/litbang-anggota-jawsyan.png"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '2px solid #111827',
                fontSize: '0.85rem'
              }}
            />

            {/* Quick Avatar Presets */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#6B7280', alignSelf: 'center' }}>Pilihan Cepat:</span>
              <button 
                type="button" 
                onClick={() => setAvatar('/team/litbang-anggota-jawsyan.png')}
                style={{ fontSize: '0.7rem', fontWeight: '800', padding: '2px 6px', borderRadius: '4px', border: '1px solid #111827', backgroundColor: '#FEF08A', cursor: 'pointer' }}
              >
                📸 Foto Jawsyan
              </button>
              <button 
                type="button" 
                onClick={() => setAvatar('/team/bph-ketua-umum-bram.png')}
                style={{ fontSize: '0.7rem', fontWeight: '800', padding: '2px 6px', borderRadius: '4px', border: '1px solid #111827', backgroundColor: '#E0E7FF', cursor: 'pointer' }}
              >
                📸 Foto Bram
              </button>
              <button 
                type="button" 
                onClick={() => setAvatar('/team/litbang-ketua-diandra.png')}
                style={{ fontSize: '0.7rem', fontWeight: '800', padding: '2px 6px', borderRadius: '4px', border: '1px solid #111827', backgroundColor: '#FCE7F3', cursor: 'pointer' }}
              >
                📸 Foto Diandra
              </button>
            </div>
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
