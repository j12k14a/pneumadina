import React, { useState, useEffect } from 'react';
import { Users, Maximize2, X, Sparkles, Award, Share2, Grid, List, LayoutGrid, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { getTeamUrl, shareContent, getSocialShareLinks } from '../utils/urlHelper';

const InstagramIcon = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export const TEAM_DIVISIONS = [
  { id: 'all', name: 'Semua Divisi', count: 14, icon: '👥' },
  { id: 'bph', name: 'BPH', fullName: 'Badan Pengurus Harian', count: 3, icon: '🏛️', color: '#FFD600', textColor: '#111827' },
  { id: 'litbang', name: 'Litbang', fullName: 'Penelitian & Pengembangan', count: 4, icon: '🔬', color: '#2563EB', textColor: '#FFFFFF' },
  { id: 'pdd', name: 'PDD', fullName: 'Publikasi Desain Dokumentasi', count: 2, icon: '🎨', color: '#D946EF', textColor: '#FFFFFF' },
  { id: 'kaderisasi', name: 'Kaderisasi', fullName: 'Kaderisasi & Pembinaan', count: 1, icon: '🌱', color: '#059669', textColor: '#FFFFFF' },
  { id: 'redaksi', name: 'Redaksi', fullName: 'Redaksi Editorial', count: 4, icon: '✍️', color: '#EA580C', textColor: '#FFFFFF' },
];

export const TEAM_MEMBERS = [
  // BARIS 1: BPH (3 orang) + KADERISASI (Djordhy, 1 orang di sebelah kanan Sheiza)
  {
    id: 'bram',
    name: 'Bram',
    role: 'Ketua Umum',
    isLeader: true,
    divisionId: 'bph',
    divisionName: 'Badan Pengurus Harian',
    image: '/team/bph-ketua-umum-bram.png',
    instagram: '@pneumadina',
    desc: 'Memimpin koordinasi dan arah strategis pergerakan literasi Pneumadina.'
  },
  {
    id: 'aldi',
    name: 'Aldi',
    role: 'Wakil Ketua Umum',
    isLeader: true,
    divisionId: 'bph',
    divisionName: 'Badan Pengurus Harian',
    image: '/team/bph-wakil-ketua-umum-aldi.png',
    instagram: '@pneumadina',
    desc: 'Mendampingi kepemimpinan dan sinkronisasi program kerja antar divisi.'
  },
  {
    id: 'sheiza',
    name: 'Sheiza',
    role: 'Sekretaris',
    isLeader: false,
    divisionId: 'bph',
    divisionName: 'Badan Pengurus Harian',
    image: '/team/bph-sekretaris-sheiza.png',
    instagram: '@pneumadina',
    desc: 'Mengelola administrasi persuratan, notulensi, dan tata kelola organisasi.'
  },
  {
    id: 'djordhy',
    name: 'Djordhy',
    role: 'Ketua Divisi',
    isLeader: true,
    divisionId: 'kaderisasi',
    divisionName: 'Kaderisasi',
    image: '/team/kaderisasi-ketua-djordhy.png',
    instagram: '@pneumadina',
    desc: 'Mengembangkan potensi anggota, perekrutan, dan pembinaan kultur komunitas.'
  },

  // BARIS 2: LITBANG (Diandra di samping kiri Jawsyan, Mariam, Tsaqilah)
  {
    id: 'diandra',
    name: 'Diandra',
    role: 'Ketua Divisi',
    isLeader: true,
    divisionId: 'litbang',
    divisionName: 'Penelitian & Pengembangan',
    image: '/team/litbang-ketua-diandra.png',
    instagram: '@pneumadina',
    desc: 'Mengawal riset tema, analisis wacana, dan inovasi pengembangan komunitas.'
  },
  {
    id: 'jawsyan',
    name: 'Jawsyan',
    role: 'Anggota',
    isLeader: false,
    divisionId: 'litbang',
    divisionName: 'Penelitian & Pengembangan',
    image: '/team/litbang-anggota-jawsyan.png',
    instagram: '@pneumadina',
    desc: 'Riset teknologi, pengembangan platform digital, dan kajian literasi kritis.'
  },
  {
    id: 'mariam',
    name: 'Mariam',
    role: 'Anggota',
    isLeader: false,
    divisionId: 'litbang',
    divisionName: 'Penelitian & Pengembangan',
    image: '/team/litbang-anggota-mariam.png',
    instagram: '@pneumadina',
    desc: 'Eksplorasi literatur kontemporer, kurasi bacaan, dan kajian sosial.'
  },
  {
    id: 'tsaqilah',
    name: 'Tsaqilah',
    role: 'Anggota',
    isLeader: false,
    divisionId: 'litbang',
    divisionName: 'Penelitian & Pengembangan',
    image: '/team/litbang-anggota-tsaqilah.png',
    instagram: '@pneumadina',
    desc: 'Analisa gagasan kritis, pengumpulan data karya, dan riset pembaca.'
  },

  // BARIS 3: PDD (Hilda di samping kiri Joefunny) + REDAKSI (Diaz, Reza)
  {
    id: 'hilda',
    name: 'Hilda',
    role: 'Ketua Divisi',
    isLeader: true,
    divisionId: 'pdd',
    divisionName: 'Publikasi Desain Dokumentasi',
    image: '/team/pdd-ketua-hilda.png',
    instagram: '@pneumadina',
    desc: 'Menjaga standar estetika visual, branding, dan publikasi multimedia.'
  },
  {
    id: 'joefunny',
    name: 'Joefunny',
    role: 'Anggota',
    isLeader: false,
    divisionId: 'pdd',
    divisionName: 'Publikasi Desain Dokumentasi',
    image: '/team/pdd-anggota-joefunny.png',
    instagram: '@pneumadina',
    desc: 'Dokumentasi kegiatan, desain poster kreatif, dan tata visual karya.'
  },
  {
    id: 'diaz',
    name: 'Diaz',
    role: 'Ketua Divisi',
    isLeader: true,
    divisionId: 'redaksi',
    divisionName: 'Redaksi',
    image: '/team/redaksi-ketua-diaz.png',
    instagram: '@pneumadina',
    desc: 'Mengkoordinasikan proses kurasi naskah, editorial, dan jadwal terbit karya.'
  },
  {
    id: 'reza',
    name: 'Reza',
    role: 'Anggota',
    isLeader: false,
    divisionId: 'redaksi',
    divisionName: 'Redaksi',
    image: '/team/redaksi-anggota-reza.png',
    instagram: '@pneumadina',
    desc: 'Penyuntingan naskah esai, fiksi, dan pemeriksaan akurasi wacana.'
  },

  // BARIS 4: REDAKSI LANJUTAN (Jasmine, Ayra)
  {
    id: 'jasmine',
    name: 'Jasmine',
    role: 'Anggota',
    isLeader: false,
    divisionId: 'redaksi',
    divisionName: 'Redaksi',
    image: '/team/redaksi-anggota-jasmine.png',
    instagram: '@pneumadina',
    desc: 'Kurasi tulisan sastra, puisi, dan interaksi dengan para kontributor.'
  },
  {
    id: 'ayra',
    name: 'Ayra',
    role: 'Anggota',
    isLeader: false,
    divisionId: 'redaksi',
    divisionName: 'Redaksi',
    image: '/team/redaksi-anggota-ayra.png',
    instagram: '@pneumadina',
    desc: 'Editorial non-fiksi, tata bahasa naratif, dan komunikasi penulis.'
  }
];

export default function TeamSection({ 
  teamMembers = [], 
  onRefreshTeam,
  selectedMember = null,
  onSelectMember,
  onClosePreview,
  showToast
}) {
  const [activeDivision, setActiveDivision] = useState('all');
  const [internalPreview, setInternalPreview] = useState(null);
  const [viewMode, setViewMode] = useState('grid-2'); // 'grid-2' (Kompak 2 Kolom) | 'list' (Daftar List) | 'grid-1' (Poster Besar)
  const [shareToastMember, setShareToastMember] = useState(null);

  // Active preview member (controlled via props or internal)
  const currentPreview = selectedMember !== undefined && selectedMember !== null ? selectedMember : internalPreview;

  const rawMembers = (teamMembers && teamMembers.length > 0) ? teamMembers : TEAM_MEMBERS;
  
  const normalizedMembers = rawMembers.map(m => ({
    id: m.id || m.member_id,
    name: m.name,
    role: m.role,
    isLeader: m.is_leader === 1 || m.is_leader === true || m.isLeader === true,
    divisionId: m.division_id || m.divisionId || 'bph',
    divisionName: m.division_name || m.divisionName || 'Pneumadina',
    image: m.image,
    instagram: m.instagram || '@pneumadina',
    desc: m.bio || m.desc || 'Penggerak literasi dan komunitas Pneumadina.'
  }));

  const dynamicDivisions = [
    { id: 'all', name: 'Semua Divisi', count: normalizedMembers.length, icon: '👥' },
    { id: 'bph', name: 'BPH', fullName: 'Badan Pengurus Harian', count: normalizedMembers.filter(m => m.divisionId === 'bph').length, icon: '🏛️', color: '#FFD600', textColor: '#111827' },
    { id: 'litbang', name: 'Litbang', fullName: 'Penelitian & Pengembangan', count: normalizedMembers.filter(m => m.divisionId === 'litbang').length, icon: '🔬', color: '#2563EB', textColor: '#FFFFFF' },
    { id: 'pdd', name: 'PDD', fullName: 'Publikasi Desain Dokumentasi', count: normalizedMembers.filter(m => m.divisionId === 'pdd').length, icon: '🎨', color: '#D946EF', textColor: '#FFFFFF' },
    { id: 'kaderisasi', name: 'Kaderisasi', fullName: 'Kaderisasi & Pembinaan', count: normalizedMembers.filter(m => m.divisionId === 'kaderisasi').length, icon: '🌱', color: '#059669', textColor: '#FFFFFF' },
    { id: 'redaksi', name: 'Redaksi', fullName: 'Redaksi Editorial', count: normalizedMembers.filter(m => m.divisionId === 'redaksi').length, icon: '✍️', color: '#EA580C', textColor: '#FFFFFF' },
  ];

  const filteredMembers = activeDivision === 'all'
    ? normalizedMembers
    : normalizedMembers.filter(m => m.divisionId === activeDivision);

  const getDivisionBadgeColor = (divId) => {
    switch (divId) {
      case 'bph': return { bg: '#FFD600', text: '#111827', border: '#111827' };
      case 'litbang': return { bg: '#DBEAFE', text: '#1E40AF', border: '#1E40AF' };
      case 'pdd': return { bg: '#FCE7F3', text: '#9D174D', border: '#9D174D' };
      case 'kaderisasi': return { bg: '#D1FAE5', text: '#065F46', border: '#065F46' };
      case 'redaksi': return { bg: '#FFEDD5', text: '#9A3412', border: '#9A3412' };
      default: return { bg: '#F3F4F6', text: '#111827', border: '#111827' };
    }
  };

  const handleOpenMember = (member) => {
    if (onSelectMember) {
      onSelectMember(member);
    } else {
      setInternalPreview(member);
    }
  };

  const handleCloseMember = () => {
    if (onClosePreview) {
      onClosePreview();
    } else {
      setInternalPreview(null);
    }
  };

  const handleShareMember = async (e, member) => {
    e?.stopPropagation();
    const shareUrl = getTeamUrl(member);
    const title = `${member.name} (${member.role}) — Tim Pneumadina`;
    const text = `Kenalan dengan ${member.name} sebagai ${member.role} Divisi ${member.divisionName} di Komunitas Pneumadina.`;

    const res = await shareContent({ title, text, url: shareUrl });
    if (res.success) {
      if (res.method === 'clipboard') {
        setShareToastMember(member.id);
        if (showToast) {
          showToast(`🔗 Tautan profil ${member.name} berhasil disalin!`);
        }
        setTimeout(() => setShareToastMember(null), 2500);
      }
    }
  };

  // Navigate through members inside modal
  const handleNextMember = () => {
    if (!currentPreview) return;
    const currentIndex = normalizedMembers.findIndex(m => m.id === currentPreview.id);
    const nextIndex = (currentIndex + 1) % normalizedMembers.length;
    handleOpenMember(normalizedMembers[nextIndex]);
  };

  const handlePrevMember = () => {
    if (!currentPreview) return;
    const currentIndex = normalizedMembers.findIndex(m => m.id === currentPreview.id);
    const prevIndex = (currentIndex - 1 + normalizedMembers.length) % normalizedMembers.length;
    handleOpenMember(normalizedMembers[prevIndex]);
  };

  return (
    <section id="divisi-section" style={{
      marginTop: '3.5rem',
      marginBottom: '2rem',
      scrollMarginTop: '90px'
    }}>
      {/* Header Container with Neo-Brutalism Box */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '3px solid #111827',
        borderRadius: '20px',
        boxShadow: '6px 6px 0px 0px #111827',
        padding: 'clamp(1rem, 3.5vw, 2rem)',
        marginBottom: '1.75rem'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          borderBottom: '2.5px solid #111827',
          paddingBottom: '1.25rem',
          marginBottom: '1.25rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span className="badge badge-dark" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem' }}>
                <Users size={13} color="#FFD600" /> KABINET & KEPENGURUSAN
              </span>
              <span style={{
                backgroundColor: '#FFD600',
                color: '#111827',
                fontSize: '0.7rem',
                fontWeight: '900',
                padding: '2px 8px',
                borderRadius: '9999px',
                border: '1.5px solid #111827'
              }}>
                {normalizedMembers.length} PENGGERAK
              </span>
            </div>
            <h2 className="font-serif" style={{
              fontSize: 'clamp(1.3rem, 4vw, 2rem)',
              fontWeight: '900',
              color: '#111827',
              letterSpacing: '-0.5px'
            }}>
              Divisi & Struktur Tim Pneumadina
            </h2>
            <p style={{ color: '#4B5563', fontSize: '0.875rem', maxWidth: '650px', fontWeight: '600', marginTop: '4px' }}>
              Mengenal rekan-rekan pengurus Pneumadina yang mendedikasikan waktu, narasi, dan gagasan untuk merawat ekosistem literasi, wacana kritis, dan karya visual.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <a 
              href="https://instagram.com/pneumadina" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                padding: '7px 14px',
                backgroundColor: '#FAF8F5'
              }}
            >
              <InstagramIcon size={15} color="#E1306C" /> @pneumadina di Instagram &rarr;
            </a>
          </div>
        </div>

        {/* Division Filter Tabs & View Mode Switcher */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Division Pills */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#111827', marginRight: '2px' }}>
              DIVISI:
            </span>
            {dynamicDivisions.map(div => {
              const isSelected = activeDivision === div.id;
              return (
                <button
                  key={div.id}
                  onClick={() => setActiveDivision(div.id)}
                  className={`btn ${isSelected ? 'btn-yellow' : 'btn-outline'}`}
                  style={{
                    padding: '5px 12px',
                    fontSize: '0.775rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: isSelected ? '2.5px 2.5px 0px 0px #111827' : 'none'
                  }}
                >
                  <span>{div.icon}</span>
                  <span>{div.name}</span>
                  <span style={{
                    backgroundColor: isSelected ? '#111827' : '#E5E7EB',
                    color: isSelected ? '#FFD600' : '#111827',
                    padding: '1px 5px',
                    borderRadius: '9999px',
                    fontSize: '0.65rem',
                    fontWeight: '900'
                  }}>
                    {div.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View Mode Switcher (Grid 2 Kolom vs List vs Poster) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#F3F4F6',
            border: '2px solid #111827',
            borderRadius: '9999px',
            padding: '3px',
            gap: '2px'
          }}>
            <button
              onClick={() => setViewMode('grid-2')}
              title="Tampilan Grid 2 Kolom (Kompak)"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: viewMode === 'grid-2' ? '#111827' : 'transparent',
                color: viewMode === 'grid-2' ? '#FFD600' : '#4B5563',
                fontSize: '0.75rem',
                fontWeight: '800',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <LayoutGrid size={13} />
              <span className="hide-on-very-small">Kompak 2 Kolom</span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              title="Tampilan Daftar Horizontal"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: viewMode === 'list' ? '#111827' : 'transparent',
                color: viewMode === 'list' ? '#FFD600' : '#4B5563',
                fontSize: '0.75rem',
                fontWeight: '800',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <List size={13} />
              <span className="hide-on-very-small">Daftar Rapi</span>
            </button>

            <button
              onClick={() => setViewMode('grid-1')}
              title="Tampilan Poster Besar"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: viewMode === 'grid-1' ? '#111827' : 'transparent',
                color: viewMode === 'grid-1' ? '#FFD600' : '#4B5563',
                fontSize: '0.75rem',
                fontWeight: '800',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Grid size={13} />
              <span className="hide-on-very-small">Poster Besar</span>
            </button>
          </div>
        </div>
      </div>

      {/* TEAM MEMBERS DISPLAY BASED ON VIEW MODE */}

      {/* MODE 1: GRID 2 KOLOM (DEFAULT RESPONSIVE - Sangat Pas di Layar HP & Desktop) */}
      {viewMode === 'grid-2' && (
        <div className="team-grid-2col" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: 'clamp(10px, 2.5vw, 1.25rem)'
        }}>
          {filteredMembers.map((member, idx) => {
            const divBadge = getDivisionBadgeColor(member.divisionId);
            const isCopied = shareToastMember === member.id;
            return (
              <div
                key={member.id}
                className="animate-card-pop team-card-compact"
                style={{
                  animationDelay: `${idx * 0.02}s`,
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '2.5px solid #111827',
                  boxShadow: '4px 4px 0px 0px #111827',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onClick={() => handleOpenMember(member)}
              >
                {/* Poster Photo Container with Compact Aspect Ratio */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1 / 1',
                  backgroundColor: '#111827',
                  overflow: 'hidden',
                  borderBottom: '2px solid #111827'
                }}>
                  <img
                    src={member.image}
                    alt={`${member.name} - ${member.role}`}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center top',
                      display: 'block',
                      transition: 'transform 0.3s ease'
                    }}
                  />

                  {/* Division Badge Pill */}
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    backgroundColor: divBadge.bg,
                    color: divBadge.text,
                    border: `1.5px solid ${divBadge.border}`,
                    padding: '2px 7px',
                    borderRadius: '9999px',
                    fontSize: '0.65rem',
                    fontWeight: '900',
                    boxShadow: '1.5px 1.5px 0px 0px #111827',
                    textTransform: 'uppercase'
                  }}>
                    {member.divisionId.toUpperCase()}
                  </div>

                  {/* Quick Share Button on Top-Right */}
                  <button
                    type="button"
                    title="Bagikan Profil Pengurus Ini"
                    onClick={(e) => handleShareMember(e, member)}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: isCopied ? '#059669' : 'rgba(17, 24, 39, 0.88)',
                      color: isCopied ? '#FFFFFF' : '#FFD600',
                      border: '1.5px solid #FFD600',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(4px)',
                      cursor: 'pointer',
                      zIndex: 2,
                      boxShadow: '1.5px 1.5px 0px 0px #111827',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isCopied ? <Check size={14} /> : <Share2 size={13} />}
                  </button>
                </div>

                {/* Card Body */}
                <div style={{
                  padding: '10px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  flexGrow: 1,
                  gap: '6px'
                }}>
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '4px',
                      marginBottom: '2px'
                    }}>
                      <h3 className="font-serif" style={{
                        fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
                        fontWeight: '900',
                        color: '#111827',
                        margin: 0,
                        lineHeight: 1.2
                      }}>
                        {member.name}
                      </h3>

                      {member.isLeader && (
                        <span title="Pimpinan Divisi" style={{ color: '#EAB308', display: 'flex', alignItems: 'center' }}>
                          <Award size={14} />
                        </span>
                      )}
                    </div>

                    <div style={{
                      display: 'inline-block',
                      backgroundColor: member.isLeader ? '#FFD600' : '#F3F4F6',
                      color: '#111827',
                      border: '1px solid #111827',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      fontWeight: '800',
                      fontSize: '0.675rem',
                      marginBottom: '4px'
                    }}>
                      {member.role}
                    </div>

                    <div style={{
                      fontSize: '0.7rem',
                      color: '#2563EB',
                      fontWeight: '700',
                      lineHeight: 1.2
                    }}>
                      Divisi {member.divisionName}
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '6px',
                    borderTop: '1px dashed #E5E7EB',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    color: '#6B7280'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#111827' }}>
                      <InstagramIcon size={12} color="#E1306C" /> {member.instagram}
                    </span>
                    <span style={{ color: '#2563EB', fontWeight: '800' }}>
                      Detail &rarr;
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODE 2: LIST DAFTAR RAPI (Horizontal Card - Sangat Rapi di HP) */}
      {viewMode === 'list' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '12px'
        }}>
          {filteredMembers.map((member, idx) => {
            const divBadge = getDivisionBadgeColor(member.divisionId);
            const isCopied = shareToastMember === member.id;
            return (
              <div
                key={member.id}
                className="animate-card-pop"
                style={{
                  animationDelay: `${idx * 0.02}s`,
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: '2.5px solid #111827',
                  boxShadow: '3px 3px 0px 0px #111827',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease'
                }}
                onClick={() => handleOpenMember(member)}
              >
                {/* Square Avatar Photo */}
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '12px',
                  border: '2px solid #111827',
                  overflow: 'hidden',
                  flexShrink: 0,
                  backgroundColor: '#111827',
                  boxShadow: '2px 2px 0px 0px #111827'
                }}>
                  <img
                    src={member.image}
                    alt={member.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Info Text */}
                <div style={{ flexGrow: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <h3 className="font-serif" style={{ fontSize: '1rem', fontWeight: '900', color: '#111827', margin: 0 }}>
                      {member.name}
                    </h3>
                    <span style={{
                      backgroundColor: divBadge.bg,
                      color: divBadge.text,
                      border: `1px solid ${divBadge.border}`,
                      padding: '1px 5px',
                      borderRadius: '4px',
                      fontSize: '0.625rem',
                      fontWeight: '800'
                    }}>
                      {member.divisionId.toUpperCase()}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#111827', marginTop: '2px' }}>
                    {member.role} • <span style={{ color: '#2563EB' }}>{member.divisionName}</span>
                  </div>

                  <p style={{ fontSize: '0.725rem', color: '#6B7280', margin: '2px 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {member.desc}
                  </p>
                </div>

                {/* Share Button */}
                <button
                  type="button"
                  title="Bagikan Profil"
                  onClick={(e) => handleShareMember(e, member)}
                  style={{
                    backgroundColor: isCopied ? '#059669' : '#FAF8F5',
                    color: isCopied ? '#FFFFFF' : '#111827',
                    border: '1.5px solid #111827',
                    borderRadius: '8px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    boxShadow: '1.5px 1.5px 0px 0px #111827'
                  }}
                >
                  {isCopied ? <Check size={14} /> : <Share2 size={14} />}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* MODE 3: GRID 1 KOLOM / POSTER PENUH (Bagi yang Ingin Melihat Poster Berukuran Besar) */}
      {viewMode === 'grid-1' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredMembers.map((member, idx) => {
            const divBadge = getDivisionBadgeColor(member.divisionId);
            const isCopied = shareToastMember === member.id;
            return (
              <div
                key={member.id}
                className="animate-card-pop"
                style={{
                  animationDelay: `${idx * 0.03}s`,
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: '2.5px solid #111827',
                  boxShadow: '5px 5px 0px 0px #111827',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer'
                }}
                onClick={() => handleOpenMember(member)}
              >
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '4 / 5',
                  backgroundColor: '#111827',
                  overflow: 'hidden',
                  borderBottom: '2.5px solid #111827'
                }}>
                  <img
                    src={member.image}
                    alt={member.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: divBadge.bg,
                    color: divBadge.text,
                    border: `1.5px solid ${divBadge.border}`,
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    fontSize: '0.725rem',
                    fontWeight: '900',
                    boxShadow: '2px 2px 0px 0px #111827',
                    textTransform: 'uppercase'
                  }}>
                    {member.divisionId.toUpperCase()}
                  </div>

                  <button
                    type="button"
                    title="Bagikan Profil"
                    onClick={(e) => handleShareMember(e, member)}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: isCopied ? '#059669' : 'rgba(17, 24, 39, 0.85)',
                      color: isCopied ? '#FFFFFF' : '#FFD600',
                      border: '1.5px solid #FFD600',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 2,
                      boxShadow: '2px 2px 0px 0px #111827'
                    }}
                  >
                    {isCopied ? <Check size={16} /> : <Share2 size={15} />}
                  </button>
                </div>

                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 className="font-serif" style={{ fontSize: '1.3rem', fontWeight: '900', color: '#111827', margin: 0 }}>
                      {member.name}
                    </h3>
                    <span style={{
                      backgroundColor: member.isLeader ? '#FFD600' : '#F3F4F6',
                      color: '#111827',
                      border: '1.5px solid #111827',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontWeight: '800',
                      fontSize: '0.7rem'
                    }}>
                      {member.role}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.775rem', fontWeight: '800', color: '#2563EB' }}>
                    Divisi {member.divisionName}
                  </div>

                  <p style={{ fontSize: '0.8rem', color: '#4B5563', lineHeight: '1.4' }}>
                    {member.desc}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '8px',
                    borderTop: '1px dashed #E5E7EB',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    marginTop: 'auto'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#111827' }}>
                      <InstagramIcon size={13} color="#E1306C" /> {member.instagram}
                    </span>
                    <span style={{ color: '#2563EB', fontWeight: '800' }}>
                      Lihat Foto &rarr;
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIGHTBOX MODAL PREVIEW DETAIL ANGGOTA TIM + SHARE BUTTON & DEEP LINK */}
      {currentPreview && (
        <div
          className="animate-backdrop"
          onClick={handleCloseMember}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(17, 24, 39, 0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 600,
            padding: '12px'
          }}
        >
          <div
            className="animate-popup-enter"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '3.5px solid #111827',
              boxShadow: '8px 8px 0px 0px #111827',
              maxWidth: '520px',
              width: '100%',
              maxHeight: '94vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            {/* Modal Header */}
            <div style={{
              backgroundColor: '#FFD600',
              padding: '12px 16px',
              borderBottom: '3px solid #111827',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px'
            }}>
              <div>
                <span className="badge badge-dark" style={{ fontSize: '0.625rem', marginBottom: '2px' }}>
                  DIVISI {currentPreview.divisionId.toUpperCase()} • PNEUMADINA
                </span>
                <h3 className="font-serif" style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.35rem)', fontWeight: '900', color: '#111827' }}>
                  {currentPreview.name} — {currentPreview.role}
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={handleCloseMember}
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
                    fontWeight: '900'
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Poster Image Display with Navigation Arrows */}
            <div style={{
              padding: '14px',
              backgroundColor: '#FAF8F5',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                position: 'relative',
                borderRadius: '14px',
                border: '2.5px solid #111827',
                boxShadow: '4px 4px 0px 0px #111827',
                overflow: 'hidden',
                maxHeight: '52vh',
                backgroundColor: '#111827',
                width: '100%',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <img
                  src={currentPreview.image}
                  alt={currentPreview.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '52vh',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />

                {/* Left/Right Member Quick Navigation */}
                <button
                  type="button"
                  onClick={handlePrevMember}
                  title="Anggota Sebelumnya"
                  style={{
                    position: 'absolute',
                    left: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '2px solid #111827',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '2px 2px 0px 0px #111827'
                  }}
                >
                  <ChevronLeft size={18} color="#111827" />
                </button>

                <button
                  type="button"
                  onClick={handleNextMember}
                  title="Anggota Berikutnya"
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '2px solid #111827',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '2px 2px 0px 0px #111827'
                  }}
                >
                  <ChevronRight size={18} color="#111827" />
                </button>
              </div>

              {/* Detail Info Card */}
              <div style={{
                width: '100%',
                backgroundColor: '#FFFFFF',
                border: '2px solid #111827',
                borderRadius: '14px',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                  <div>
                    <div style={{ fontWeight: '900', fontSize: '1.05rem', color: '#111827' }}>
                      {currentPreview.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#2563EB', fontWeight: '800' }}>
                      {currentPreview.role} • Divisi {currentPreview.divisionName}
                    </div>
                  </div>

                  {/* Share Profile Button */}
                  <button
                    type="button"
                    onClick={(e) => handleShareMember(e, currentPreview)}
                    className="btn btn-yellow"
                    style={{ fontSize: '0.775rem', padding: '6px 12px' }}
                  >
                    <Share2 size={14} />
                    {shareToastMember === currentPreview.id ? 'Tautan Disalin!' : 'Bagikan Profil'}
                  </button>
                </div>

                <p style={{
                  fontSize: '0.825rem',
                  color: '#4B5563',
                  lineHeight: '1.5',
                  margin: '4px 0',
                  borderTop: '1px dashed #E5E7EB',
                  paddingTop: '6px'
                }}>
                  {currentPreview.desc}
                </p>

                {/* Direct Link indicator */}
                <div style={{
                  backgroundColor: '#FAF8F5',
                  border: '1.5px solid #E5E7EB',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.725rem',
                  color: '#6B7280'
                }}>
                  <span style={{ fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>
                    {getTeamUrl(currentPreview)}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleShareMember(e, currentPreview)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#2563EB',
                      fontWeight: '800',
                      cursor: 'pointer',
                      fontSize: '0.725rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Salin Link
                  </button>
                </div>

                {/* Instagram Profile Action */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '4px' }}>
                  <a
                    href="https://instagram.com/pneumadina"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                  >
                    <InstagramIcon size={14} color="#E1306C" /> Kunjungi Instagram @pneumadina &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
