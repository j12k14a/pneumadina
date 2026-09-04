import React, { useState } from 'react';
import PneumadinaLogo from './PneumadinaLogo';
import { Search, PenSquare, BookOpen, Send, LogIn, LogOut, LayoutDashboard, UserCheck, Menu, X, Heart } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  onLogout,
  onOpenAuth,
  onOpenStudio, 
  onOpenTerimaPublikasi, 
  onOpenBookClub, 
  onOpenDonation,
  onOpenRoleDashboard,
  onOpenEditProfile,
  searchQuery, 
  setSearchQuery 
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const isRoleAdmin = currentUser?.role_id === 1;
  const isRoleAuthor = currentUser?.role_id === 2;
  const isRoleMember = currentUser?.role_id === 3;

  return (
    <header style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 100, 
      backgroundColor: '#FFFFFF', 
      borderBottom: '2.5px solid #111827',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    }}>
      {/* Top Announcement Bar - Responsive Yellow Theme */}
      <div className="announcement-bar" style={{ 
        backgroundColor: '#FFD600', 
        color: '#111827', 
        padding: '6px 12px', 
        fontSize: '0.775rem', 
        fontWeight: '700',
        textAlign: 'center',
        borderBottom: '1px solid #111827',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        flexWrap: 'wrap'
      }}>
        <span className="badge badge-dark" style={{ fontSize: '0.625rem', padding: '2px 8px' }}>OPEN RECRUITMENT</span>
        <span>Dicari Anggota Penggerak Komunitas Pneumadina 2026!</span>
        <button 
          onClick={onOpenDonation}
          style={{ 
            backgroundColor: '#111827', 
            color: '#FFD600', 
            border: '1px solid #111827',
            borderRadius: '9999px',
            padding: '2px 10px',
            fontSize: '0.7rem',
            fontWeight: '900', 
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Heart size={12} color="#DC2626" fill="#DC2626" /> Open Donation QRIS &rarr;
        </button>
      </div>

      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>
        
        {/* Brand Logo */}
        <div onClick={() => { setActiveTab('beranda'); setShowMobileMenu(false); }} style={{ cursor: 'pointer' }}>
          <PneumadinaLogo size={38} />
        </div>

        {/* Desktop Search Input Bar */}
        <div className="desktop-only" style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }} />
          <input 
            type="text"
            placeholder="Cari fiksi, esai, ilustrasi, foto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 14px 8px 38px',
              fontSize: '0.85rem',
              borderRadius: '9999px',
              border: '2px solid #111827',
              backgroundColor: '#FAF8F5',
              outline: 'none',
              fontWeight: '600'
            }}
          />
        </div>

        {/* Desktop Navigation Row */}
        <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            className={`btn ${activeTab === 'beranda' ? 'btn-yellow' : 'btn-outline'}`}
            onClick={() => setActiveTab('beranda')}
            style={{ padding: '0.45rem 1rem', fontSize: '0.825rem' }}
          >
            Beranda
          </button>

          <button 
            className={`btn ${activeTab === 'berita' ? 'btn-yellow' : 'btn-outline'}`}
            onClick={() => {
              setActiveTab('berita');
              const el = document.getElementById('artikel-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{ padding: '0.45rem 1rem', fontSize: '0.825rem' }}
          >
            Karya & Artikel
          </button>

          <button 
            className={`btn ${activeTab === 'divisi' ? 'btn-yellow' : 'btn-outline'}`}
            onClick={() => {
              setActiveTab('divisi');
              const el = document.getElementById('divisi-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{ padding: '0.45rem 1rem', fontSize: '0.825rem' }}
          >
            👥 Struktur Divisi
          </button>

          <button 
            className="btn btn-outline"
            onClick={onOpenDonation}
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.825rem', borderColor: '#DC2626', color: '#DC2626' }}
          >
            <Heart size={14} color="#DC2626" fill="#DC2626" /> Open Donation
          </button>

          {/* Action Button for Member Role */}
          {isRoleMember && (
            <button 
              className="btn btn-blue"
              onClick={onOpenTerimaPublikasi}
              style={{ padding: '0.45rem 1rem', fontSize: '0.825rem' }}
            >
              <Send size={15} /> Kirim Karya
            </button>
          )}

          {/* Action Button for Author & Admin Roles */}
          {(isRoleAuthor || isRoleAdmin) && (
            <button 
              className="btn btn-yellow"
              onClick={onOpenStudio}
              style={{ padding: '0.45rem 1.1rem', fontSize: '0.825rem', boxShadow: '3px 3px 0px 0px #111827' }}
            >
              <PenSquare size={15} /> {isRoleAdmin ? 'Tulis Pengumuman' : 'Tulis Artikel'}
            </button>
          )}

          {/* Unauthenticated User: Show Login & Daftar Buttons */}
          {!currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                className="btn btn-outline"
                onClick={() => onOpenAuth('login')}
                style={{ padding: '0.45rem 1rem', fontSize: '0.825rem', backgroundColor: '#FFFFFF' }}
              >
                <LogIn size={15} /> Masuk
              </button>
              <button 
                className="btn btn-yellow"
                onClick={() => onOpenAuth('regis')}
                style={{ padding: '0.45rem 1rem', fontSize: '0.825rem', fontWeight: '900' }}
              >
                Daftar
              </button>
            </div>
          ) : (
            /* Authenticated User Profile Dropdown */
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 12px 4px 4px',
                  borderRadius: '9999px',
                  border: '2px solid #111827',
                  backgroundColor: currentUser.role_id === 1 ? '#111827' : currentUser.role_id === 2 ? '#FFD600' : '#FFFFFF',
                  color: currentUser.role_id === 1 ? '#FFFFFF' : '#111827',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  color: '#111827',
                  border: '1px solid #111827',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '900',
                  fontSize: '0.8rem'
                }}>
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
                  ) : (
                    currentUser.full_name?.charAt(0) || 'U'
                  )}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '900', lineHeight: 1 }}>
                    {currentUser.full_name || currentUser.username}
                  </div>
                  <div style={{ fontSize: '0.625rem', fontWeight: '700', opacity: 0.85, marginTop: '2px' }}>
                    {currentUser.role_name}
                  </div>
                </div>
              </button>

              {showUserMenu && (
                <div className="animate-popup-enter" style={{
                  position: 'absolute',
                  right: 0,
                  top: '44px',
                  width: '250px',
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #111827',
                  borderRadius: '12px',
                  boxShadow: '4px 4px 0px 0px #111827',
                  padding: '12px',
                  zIndex: 200
                }}>
                  <div style={{ paddingBottom: '8px', borderBottom: '1px solid #E5E7EB', marginBottom: '8px' }}>
                    <div style={{ fontWeight: '900', fontSize: '0.9rem', color: '#111827' }}>{currentUser.full_name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: '700' }}>Peran: {currentUser.role_name}</div>
                    <div style={{ fontSize: '0.725rem', color: '#6B7280' }}>✉️ {currentUser.email}</div>
                  </div>

                  {(isRoleAuthor || isRoleAdmin) && (
                    <button 
                      onClick={() => { onOpenStudio(); setShowUserMenu(false); }}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        textAlign: 'left',
                        backgroundColor: '#FFD600',
                        border: '1.5px solid #111827',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '900',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.825rem',
                        marginBottom: '6px',
                        color: '#111827'
                      }}
                    >
                      <PenSquare size={16} /> {isRoleAdmin ? '+ Tulis Pengumuman' : '+ Tulis Artikel Baru'}
                    </button>
                  )}

                  <button 
                    onClick={() => { onOpenRoleDashboard(); setShowUserMenu(false); }}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      textAlign: 'left',
                      backgroundColor: '#FFFDF5',
                      border: '1.5px solid #111827',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.825rem',
                      marginBottom: '6px',
                      color: '#111827'
                    }}
                  >
                    <LayoutDashboard size={16} color="#2563EB" /> Buka Dashboard {currentUser.role_name}
                  </button>

                  <button 
                    onClick={() => { onOpenEditProfile(); setShowUserMenu(false); }}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      textAlign: 'left',
                      backgroundColor: '#EFF6FF',
                      border: '1.5px solid #2563EB',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.825rem',
                      marginBottom: '8px',
                      color: '#2563EB'
                    }}
                  >
                    <UserCheck size={16} /> ⚙️ Edit Profil Saya
                  </button>

                  <button 
                    onClick={() => { onLogout(); setShowUserMenu(false); }}
                    style={{
                      width: '100%',
                      padding: '8px',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.8rem',
                      color: '#DC2626'
                    }}
                  >
                    <LogOut size={15} /> Keluar (Logout)
                  </button>

                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile Header Toggle Actions (< 768px) */}
        <div className="mobile-only" style={{ display: 'none', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={onOpenDonation}
            style={{
              backgroundColor: '#FFFDF5',
              border: '2px solid #DC2626',
              color: '#DC2626',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Heart size={18} fill="#DC2626" />
          </button>

          <button 
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            style={{
              backgroundColor: '#FAF8F5',
              border: '2px solid #111827',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Search size={18} />
          </button>

          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            style={{
              backgroundColor: '#FFD600',
              border: '2px solid #111827',
              borderRadius: '8px',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '2px 2px 0px 0px #111827'
            }}
          >
            {showMobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

      </div>

      {/* Mobile Expandable Search Bar */}
      {showMobileSearch && (
        <div className="mobile-only" style={{ padding: '8px 12px', borderTop: '1px solid #E5E7EB', backgroundColor: '#FAF8F5' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280' }} />
            <input 
              type="text"
              autoFocus
              placeholder="Cari fiksi, esai, ilustrasi, foto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                fontSize: '0.85rem',
                borderRadius: '9999px',
                border: '2px solid #111827',
                backgroundColor: '#FFFFFF',
                outline: 'none'
              }}
            />
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu (< 768px) */}
      {showMobileMenu && (
        <div className="mobile-only animate-popup-enter" style={{
          backgroundColor: '#FFFFFF',
          borderTop: '2px solid #111827',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
        }}>
          {currentUser && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px',
              backgroundColor: '#FFFDF5',
              borderRadius: '12px',
              border: '1.5px solid #111827',
              marginBottom: '6px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#FFD600',
                border: '1.5px solid #111827',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '900'
              }}>
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  currentUser.full_name?.charAt(0) || 'U'
                )}
              </div>
              <div>
                <div style={{ fontWeight: '900', fontSize: '0.95rem' }}>{currentUser.full_name}</div>
                <div style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: '700' }}>Peran: {currentUser.role_name}</div>
              </div>
            </div>
          )}

          <button 
            className={`btn ${activeTab === 'beranda' ? 'btn-yellow' : 'btn-outline'}`}
            onClick={() => { setActiveTab('beranda'); setShowMobileMenu(false); }}
            style={{ width: '100%', padding: '10px', justifyContent: 'flex-start' }}
          >
            🏠 Beranda
          </button>

          <button 
            className="btn btn-outline"
            onClick={() => {
              onOpenDonation();
              setShowMobileMenu(false);
            }}
            style={{ width: '100%', padding: '10px', justifyContent: 'flex-start', color: '#DC2626', borderColor: '#DC2626' }}
          >
            <Heart size={18} fill="#DC2626" /> Open Donation QRIS
          </button>

          <button 
            className="btn btn-outline"
            onClick={() => {
              setActiveTab('berita');
              setShowMobileMenu(false);
              const el = document.getElementById('artikel-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{ width: '100%', padding: '10px', justifyContent: 'flex-start' }}
          >
            📰 Karya & Artikel
          </button>

          <button 
            className="btn btn-outline"
            onClick={() => {
              setActiveTab('divisi');
              setShowMobileMenu(false);
              const el = document.getElementById('divisi-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{ width: '100%', padding: '10px', justifyContent: 'flex-start' }}
          >
            👥 Struktur Divisi
          </button>

          {(isRoleAuthor || isRoleAdmin) && (
            <button 
              className="btn btn-yellow"
              onClick={() => {
                setShowMobileMenu(false);
                onOpenStudio();
              }}
              style={{ width: '100%', padding: '10px', justifyContent: 'flex-start' }}
            >
              <PenSquare size={18} /> {isRoleAdmin ? 'Tulis Pengumuman Admin' : 'Tulis Artikel Baru'}
            </button>
          )}

          {isRoleMember && (
            <button 
              className="btn btn-blue"
              onClick={() => {
                setShowMobileMenu(false);
                onOpenTerimaPublikasi();
              }}
              style={{ width: '100%', padding: '10px', justifyContent: 'flex-start' }}
            >
              <Send size={18} /> Kirim Karya
            </button>
          )}

          {currentUser && (
            <>
              <button 
                className="btn btn-outline"
                onClick={() => { onOpenRoleDashboard(); setShowMobileMenu(false); }}
                style={{ width: '100%', padding: '10px', justifyContent: 'flex-start', color: '#2563EB' }}
              >
                <LayoutDashboard size={18} /> Buka Dashboard {currentUser.role_name}
              </button>

              <button 
                className="btn btn-outline"
                onClick={() => { onOpenEditProfile(); setShowMobileMenu(false); }}
                style={{ width: '100%', padding: '10px', justifyContent: 'flex-start', color: '#2563EB' }}
              >
                <UserCheck size={18} /> ⚙️ Edit Profil Saya
              </button>

              <button 
                className="btn btn-dark"
                onClick={() => { onLogout(); setShowMobileMenu(false); }}
                style={{ width: '100%', padding: '10px', justifyContent: 'flex-start', backgroundColor: '#DC2626', borderColor: '#111827' }}
              >
                <LogOut size={18} /> Keluar (Logout)
              </button>
            </>
          )}

          {!currentUser && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <button 
                className="btn btn-outline"
                onClick={() => { onOpenAuth('login'); setShowMobileMenu(false); }}
                style={{ flex: 1, padding: '10px', justifyContent: 'center', backgroundColor: '#FFFFFF' }}
              >
                <LogIn size={16} /> Masuk
              </button>
              <button 
                className="btn btn-yellow"
                onClick={() => { onOpenAuth('regis'); setShowMobileMenu(false); }}
                style={{ flex: 1, padding: '10px', justifyContent: 'center', fontWeight: '900' }}
              >
                Daftar Akun
              </button>
            </div>
          )}

        </div>
      )}

      {/* Style for responsive toggle displaying */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .mobile-only { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
