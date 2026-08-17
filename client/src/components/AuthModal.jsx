import React, { useState } from 'react';
import { X, LogIn, UserPlus, Lock, Mail, User, CheckCircle } from 'lucide-react';

export default function AuthModal({ onClose, onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration States
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regUsername, setRegUsername] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!usernameOrEmail.trim() || !password.trim()) {
      setErrorMsg('Email dan Password wajib diisi!');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usernameOrEmail: usernameOrEmail.trim(),
          password: password.trim()
        })
      });

      const data = await res.json();
      if (data.success) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setErrorMsg(data.message || 'Email atau Password salah.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg('⚠️ Gagal terhubung ke server backend.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regEmail.trim() || !regPassword.trim() || !regFullName.trim()) {
      setErrorMsg('Email, Password, dan Nama Lengkap wajib diisi!');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: regFullName.trim(),
          email: regEmail.trim(),
          username: regUsername.trim(),
          password: regPassword.trim()
        })
      });

      const data = await res.json();
      if (data.success) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setErrorMsg(data.message || 'Pendaftaran akun gagal.');
      }
    } catch (err) {
      console.error('Register error:', err);
      setErrorMsg('⚠️ Gagal terhubung ke server backend.');
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
                onClick={() => { setIsRegister(true); setErrorMsg(''); }}
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
                onClick={() => { setIsRegister(false); setErrorMsg(''); }}
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
