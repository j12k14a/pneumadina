import React, { useState } from 'react';
import { Users, Maximize2, X, Sparkles, Award } from 'lucide-react';

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
  // BPH
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
  // LITBANG
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
  // PDD
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
  // KADERISASI
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
  // REDAKSI
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

export default function TeamSection() {
  const [activeDivision, setActiveDivision] = useState('all');
  const [selectedPreview, setSelectedPreview] = useState(null);

  const filteredMembers = activeDivision === 'all'
    ? TEAM_MEMBERS
    : TEAM_MEMBERS.filter(m => m.divisionId === activeDivision);

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
        padding: 'clamp(1.25rem, 4vw, 2.25rem)',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          borderBottom: '2.5px solid #111827',
          paddingBottom: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
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
                14 PENGGERAK
              </span>
            </div>
            <h2 className="font-serif" style={{
              fontSize: 'clamp(1.4rem, 4vw, 2rem)',
              fontWeight: '900',
              color: '#111827',
              letterSpacing: '-0.5px'
            }}>
              Divisi & Struktur Tim Pneumadina
            </h2>
            <p style={{ color: '#4B5563', fontSize: '0.9rem', maxWidth: '650px', fontWeight: '600', marginTop: '4px' }}>
              Mengenal rekan-rekan pengurus Pneumadina yang mendedikasikan waktu, narasi, dan gagasan untuk merawat ekosistem literasi, wacana kritis, dan karya visual.
            </p>
          </div>

          <a 
            href="https://instagram.com/pneumadina" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-outline"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.825rem',
              padding: '8px 16px',
              backgroundColor: '#FAF8F5'
            }}
          >
            <InstagramIcon size={16} color="#E1306C" /> @pneumadina di Instagram &rarr;
          </a>
        </div>

        {/* Division Filter Tabs */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '900', color: '#111827', marginRight: '4px' }}>
            PILIH DIVISI:
          </span>
          {TEAM_DIVISIONS.map(div => {
            const isSelected = activeDivision === div.id;
            return (
              <button
                key={div.id}
                onClick={() => setActiveDivision(div.id)}
                className={`btn ${isSelected ? 'btn-yellow' : 'btn-outline'}`}
                style={{
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: isSelected ? '3px 3px 0px 0px #111827' : 'none'
                }}
              >
                <span>{div.icon}</span>
                <span>{div.name}</span>
                <span style={{
                  backgroundColor: isSelected ? '#111827' : '#E5E7EB',
                  color: isSelected ? '#FFD600' : '#111827',
                  padding: '1px 6px',
                  borderRadius: '9999px',
                  fontSize: '0.7rem',
                  fontWeight: '900'
                }}>
                  {div.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Team Members */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '1.5rem'
      }}>
        {filteredMembers.map((member, idx) => {
          const divBadge = getDivisionBadgeColor(member.divisionId);
          return (
            <div
              key={member.id}
              className="animate-card-pop"
              style={{
                animationDelay: `${idx * 0.04}s`,
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '2.5px solid #111827',
                boxShadow: '5px 5px 0px 0px #111827',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '7px 7px 0px 0px #111827';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.boxShadow = '5px 5px 0px 0px #111827';
              }}
              onClick={() => setSelectedPreview(member)}
            >
              {/* Member Poster Image Container */}
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
                  alt={`${member.name} - ${member.role} (${member.divisionName})`}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.03)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1.0)'}
                />

                {/* Floating Division Pill */}
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
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px'
                }}>
                  {member.divisionId.toUpperCase()}
                </div>

                {/* Expand Overlay Button */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(17, 24, 39, 0.85)',
                  color: '#FFD600',
                  border: '1.5px solid #FFD600',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(4px)',
                  boxShadow: '2px 2px 0px 0px #111827'
                }}>
                  <Maximize2 size={15} />
                </div>

                {/* Role Ribbon on bottom of image */}
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '12px',
                  right: '12px',
                  backgroundColor: member.isLeader ? '#FFD600' : '#FFFFFF',
                  color: '#111827',
                  border: '2px solid #111827',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontWeight: '900',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '3px 3px 0px 0px #111827'
                }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {member.isLeader && <Award size={13} color="#111827" />}
                    {member.role}
                  </span>
                  <span style={{ fontSize: '0.65rem', opacity: 0.8, textTransform: 'uppercase' }}>
                    {member.divisionName}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div style={{
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                justifyContent: 'space-between',
                gap: '8px'
              }}>
                <div>
                  <h3 className="font-serif" style={{
                    fontSize: '1.25rem',
                    fontWeight: '900',
                    color: '#111827',
                    marginBottom: '2px'
                  }}>
                    {member.name}
                  </h3>
                  <p style={{
                    fontSize: '0.8rem',
                    color: '#4B5563',
                    lineHeight: '1.4',
                    fontWeight: '500'
                  }}>
                    {member.desc}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '8px',
                  borderTop: '1px dashed #E5E7EB',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: '#6B7280'
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

      {/* Lightbox Modal for Photo Preview */}
      {selectedPreview && (
        <div
          className="animate-backdrop"
          onClick={() => setSelectedPreview(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(17, 24, 39, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 600,
            padding: '16px'
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
              maxHeight: '92vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Modal Header */}
            <div style={{
              backgroundColor: '#FFD600',
              padding: '12px 18px',
              borderBottom: '3px solid #111827',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span className="badge badge-dark" style={{ fontSize: '0.625rem', marginBottom: '2px' }}>
                  DIVISI {selectedPreview.divisionId.toUpperCase()} • PNEUMADINA
                </span>
                <h3 className="font-serif" style={{ fontSize: '1.2rem', fontWeight: '900', color: '#111827' }}>
                  {selectedPreview.name} — {selectedPreview.role}
                </h3>
              </div>

              <button
                onClick={() => setSelectedPreview(null)}
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

            {/* Modal Image Display */}
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
                borderRadius: '14px',
                border: '2.5px solid #111827',
                boxShadow: '4px 4px 0px 0px #111827',
                overflow: 'hidden',
                maxHeight: '62vh',
                backgroundColor: '#111827'
              }}>
                <img
                  src={selectedPreview.image}
                  alt={selectedPreview.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '62vh',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              </div>

              <div style={{
                width: '100%',
                backgroundColor: '#FFFFFF',
                border: '2px solid #111827',
                borderRadius: '12px',
                padding: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <div>
                  <div style={{ fontWeight: '900', fontSize: '0.95rem', color: '#111827' }}>
                    {selectedPreview.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: '600' }}>
                    {selectedPreview.role} • {selectedPreview.divisionName}
                  </div>
                </div>

                <a
                  href="https://instagram.com/pneumadina"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-yellow"
                  style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                >
                  <InstagramIcon size={14} /> Kunjungi Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
