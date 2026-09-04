import React, { useState, useEffect } from 'react';
import { X, LogIn, UserPlus, Lock, Mail, User, CheckCircle } from 'lucide-react';
import { db, doc, setDoc, getDocs, collection } from '../firebase';

export default function AuthModal({ 
  onClose, 
  onLoginSuccess,
  initialMode = 'login',
  onModeChange
}) {
  const [isRegister, setIsRegister] = useState(initialMode === 'regis');

  useEffect(() => {
    setIsRegister(initialMode === 'regis');
  }, [initialMode]);

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration States
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regUsername, setRegUsername] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const KNOWN_ACCOUNTS = [
    {
      id: 1,
      role_id: 1,
      role_name: 'Admin',
      username: 'admin',
      email: 'jawsyantampan.admin@pneumadina.com',
      full_name: 'Admin Jawsyan Tampan',
      avatar: '/team/litbang-anggota-jawsyan.png',
      bio: 'Administrator Utama Komunitas Pneumadina',
      password: 'AdminPnewmadina2026!',
      passwords: ['AdminPnewmadina2026!']
    },
    {
      id: 2,
      role_id: 2,
      role_name: 'Author',
      username: 'diandra',
      email: 'diandra@pneumadina.com',
      full_name: 'Diandra Paramadina',
      avatar: '/team/litbang-ketua-diandra.png',
      bio: 'Penulis & Ketua Litbang Pneumadina',
      password: 'DiandraAuthor2026!',
      passwords: ['DiandraAuthor2026!']
    },
    {
      id: 3,
      role_id: 2,
      role_name: 'Author',
      username: 'tsaqilah',
      email: 'tsaqilah@pneumadina.com',
      full_name: 'Tsaqilah Paramadina',
      avatar: '/team/litbang-anggota-tsaqilah.png',
      bio: 'Penulis & Anggota Litbang Pneumadina',
      password: 'TsaqilahAuthor2026!',
      passwords: ['TsaqilahAuthor2026!']
    },
    {
      id: 4,
      role_id: 2,
      role_name: 'Author',
      username: 'mariam',
      email: 'mariam@pneumadina.com',
      full_name: 'Mariam Paramadina',
      avatar: '/team/litbang-anggota-mariam.png',
      bio: 'Penulis & Anggota Litbang Pneumadina',
      password: 'MariamAuthor2026!',
      passwords: ['MariamAuthor2026!']
    },
    {
      id: 5,
      role_id: 3,
      role_name: 'Member',
      username: 'contoh',
      email: 'contoh@pneumadina.com',
      full_name: 'Contoh Member Paramadina',
      avatar: '/team/bph-anggota-sheiza.png',
      bio: 'Anggota Komunitas Pneumadina',
      password: 'ContohMember2026!',
      passwords: ['ContohMember2026!']
    },
    {
      id: 6,
      role_id: 3,
      role_name: 'Member',
      username: 'bram',
      email: 'bram@pneumadina.com',
      full_name: 'Bram Ketum',
      avatar: '/team/bph-ketua-umum-bram.png',
      bio: 'Ketua Umum Komunitas Pneumadina',
      password: 'Bramketum2026!',
      passwords: ['Bramketum2026!']
    }
  ];

  // Handle Login Submit (Sinkron Cloud Firestore Realtime + Fallback)
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!usernameOrEmail.trim() || !password.trim()) {
      setErrorMsg('Email dan Password wajib diisi!');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    const inputClean = usernameOrEmail.trim().toLowerCase();

    // 1. Cek langsung ke database Cloud Firestore
    if (db) {
      try {
        const snap = await getDocs(collection(db, 'users'));
        const firestoreUsers = [];
        snap.forEach(d => firestoreUsers.push(d.data()));

        const foundInCloud = firestoreUsers.find(u => 
          (u.email && u.email.toLowerCase() === inputClean) || 
          (u.username && u.username.toLowerCase() === inputClean) ||
          (u.email && u.email.replace('@pneumadina.com', '@pnewmadina.com').toLowerCase() === inputClean) ||
          (u.email && u.email.replace('@pnewmadina.com', '@pneumadina.com').toLowerCase() === inputClean)
        );

        if (foundInCloud) {
          const passMatches = (foundInCloud.password && foundInCloud.password === password.trim()) ||
                              (foundInCloud.passwords && foundInCloud.passwords.includes(password.trim()));
          if (passMatches) {
            const userSafe = { ...foundInCloud };
            delete userSafe.password;
            delete userSafe.passwords;
            onLoginSuccess(userSafe);
            onClose();
            setLoading(false);
            return;
          } else {
            setErrorMsg('Kata sandi yang Anda masukkan salah.');
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Firestore read login notice:', err);
      }
    }

    // 2. Cek ke local storage dan akun kredensial bawaan
    let localUsers = [];
    try {
      const savedUsers = localStorage.getItem('pneumadina_users');
      if (savedUsers) localUsers = JSON.parse(savedUsers);
    } catch (e) {}

    const allAccounts = [...KNOWN_ACCOUNTS, ...localUsers];
    const matched = allAccounts.find(acc => 
      acc.username.toLowerCase() === inputClean || 
      acc.email.toLowerCase() === inputClean || 
      acc.email.replace('@pneumadina.com', '@pnewmadina.com').toLowerCase() === inputClean ||
      acc.email.replace('@pnewmadina.com', '@pneumadina.com').toLowerCase() === inputClean
    );

    if (matched) {
      const isPassValid = (matched.passwords && matched.passwords.includes(password.trim())) || (matched.password === password.trim());
      if (isPassValid) {
        const userCopy = { ...matched };
        delete userCopy.passwords;
        delete userCopy.password;
        onLoginSuccess(userCopy);
        onClose();
      } else {
        setErrorMsg('Kata sandi yang Anda masukkan salah.');
      }
    } else {
      setErrorMsg('Email atau Username tidak terdaftar.');
    }
    setLoading(false);
  };

  // Handle Register Submit (Simpan Langsung ke Cloud Firestore)
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regEmail.trim() || !regPassword.trim() || !regFullName.trim()) {
      setErrorMsg('Email, Password, dan Nama Lengkap wajib diisi!');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const emailClean = regEmail.trim().toLowerCase();
    const uname = regUsername.trim() || emailClean.split('@')[0].replace(/[^a-z0-9_]/g, '');

    const newUser = {
      id: Date.now(),
      role_id: 3,
      role_name: 'Member',
      full_name: regFullName.trim(),
      username: uname,
      email: emailClean,
      password: regPassword.trim(),
      avatar: '/team/bph-anggota-sheiza.png',
      bio: 'Anggota Komunitas Pneumadina',
      posts_count: 0,
      created_at: new Date().toISOString()
    };

    // 1. Simpan ke Cloud Firestore (Realtime untuk seluruh pengguna & dashboard admin)
    if (db) {
      try {
        await setDoc(doc(db, 'users', String(newUser.id)), newUser);
      } catch (err) {
        console.warn('Firestore register write notice:', err);
      }
    }

    // 2. Simpan ke localStorage agar instan
    try {
      const savedUsers = localStorage.getItem('pneumadina_users');
      const list = savedUsers ? JSON.parse(savedUsers) : [];
      if (!list.some(u => u.email.toLowerCase() === emailClean)) {
        list.push(newUser);
        localStorage.setItem('pneumadina_users', JSON.stringify(list));
      }
    } catch (e) {}

    // 3. Simpan ke backend lokal jika tersedia
    try {
      fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: newUser.full_name,
          email: newUser.email,
          username: newUser.username,
          password: newUser.password
        })
      }).catch(() => {});
    } catch (e) {}

    const userCopy = { ...newUser };
    delete userCopy.password;
    onLoginSuccess(userCopy);
    onClose();
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
      zIndex: 400,
      padding: '10px'
    }}>
      <div className="animate-popup-enter" style={{
        backgroundColor: '#FFFFFF',
        width: '100%',
        maxWidth: '480px',
        maxHeight: '94vh',
        borderRadius: '20px',
        border: '3px solid #111827',
        boxShadow: '6px 6px 0px 0px #111827',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Yellow Header */}
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
            <span className="badge badge-dark" style={{ fontSize: '0.65rem', marginBottom: '2px' }}>
              {isRegister ? 'PENDAFTARAN AKUN BARU' : 'LOG MASUK DATABASE USERS'}
            </span>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', fontWeight: '900', color: '#111827' }}>
              {isRegister ? 'Daftar Akun Pneumadina' : 'Masuk Akun Pneumadina'}
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

        {errorMsg && (
          <div style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '10px 16px', fontWeight: '700', borderBottom: '1px solid #EF4444', fontSize: '0.825rem' }}>
            {errorMsg}
          </div>
        )}

        {/* LOGIN FORM */}
        {!isRegister ? (
          <form onSubmit={handleLoginSubmit} style={{ padding: 'clamp(1rem, 4vw, 1.25rem)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '900', fontSize: '0.775rem', marginBottom: '4px', color: '#111827' }}>
                <Mail size={14} color="#2563EB" /> ALAMAT EMAIL TERDAFTAR *
              </label>
              <input 
                type="email"
                required
                placeholder="email@pnewmadina.com"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
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

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '900', fontSize: '0.775rem', marginBottom: '4px', color: '#111827' }}>
                <Lock size={14} color="#2563EB" /> KATA SANDI / PASSWORD *
              </label>
              <input 
                type="password"
                required
                placeholder="Masukkan kata sandi Anda"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '2px solid #111827',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            <div style={{ fontSize: '0.725rem', color: '#6B7280' }}>
              🔒 Masuk menggunakan kredensial email & password yang ada di tabel users database <code>pnewmadina</code>.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-yellow"
              style={{ width: '100%', padding: '10px', fontSize: '0.9rem', fontWeight: '900', marginTop: '4px' }}
            >
              <LogIn size={16} /> {loading ? 'Memverifikasi...' : 'Masuk Ke Akun'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '6px', fontSize: '0.825rem' }}>
              Belum punya akun?{' '}
              <button 
                type="button" 
                onClick={() => { 
                  setIsRegister(true); 
                  setErrorMsg(''); 
                  if (onModeChange) onModeChange('regis');
                }}
                style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: '800', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Daftar Akun Baru
              </button>
            </div>

          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegisterSubmit} style={{ padding: 'clamp(1rem, 4vw, 1.25rem)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            <div>
              <label style={{ display: 'block', fontWeight: '900', fontSize: '0.775rem', marginBottom: '4px' }}>
                NAMA LENGKAP *
              </label>
              <input 
                type="text"
                required
                placeholder="Nama Lengkap Anda"
                value={regFullName}
                onChange={(e) => setRegFullName(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '2px solid #111827', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '900', fontSize: '0.775rem', marginBottom: '4px' }}>
                EMAIL TERDAFTAR *
              </label>
              <input 
                type="email"
                required
                placeholder="email@pnewmadina.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '2px solid #111827', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '900', fontSize: '0.775rem', marginBottom: '4px' }}>
                USERNAME (OPSIONAL)
              </label>
              <input 
                type="text"
                placeholder="username"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '2px solid #111827', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '900', fontSize: '0.775rem', marginBottom: '4px' }}>
                KATA SANDI / PASSWORD *
              </label>
              <input 
                type="password"
                required
                placeholder="Minimal 6 karakter"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '2px solid #111827', fontSize: '0.85rem' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-yellow"
              style={{ width: '100%', padding: '10px', fontSize: '0.9rem', fontWeight: '900', marginTop: '4px' }}
            >
              <UserPlus size={16} /> {loading ? 'Mendaftarkan...' : 'Daftar Akun Baru'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '4px', fontSize: '0.825rem' }}>
              Sudah punya akun?{' '}
              <button 
                type="button" 
                onClick={() => { 
                  setIsRegister(false); 
                  setErrorMsg(''); 
                  if (onModeChange) onModeChange('login');
                }}
                style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: '800', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Masuk Di Sini
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
