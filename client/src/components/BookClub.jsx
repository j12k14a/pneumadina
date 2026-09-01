import React from 'react';
import { X, BookOpen, Calendar, MapPin, Clock, Coffee, CheckCircle, Users } from 'lucide-react';

export default function BookClub({ onClose }) {
  return (
    <div className="animate-backdrop" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(17, 24, 39, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 400,
      padding: '12px'
    }}>
      <div className="animate-popup-enter" style={{
        backgroundColor: '#FFFFFF',
        width: '100%',
        maxWidth: '760px',
        maxHeight: '92vh',
        borderRadius: '20px',
        border: '3px solid #111827',
        boxShadow: '6px 6px 0px 0px #111827',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        {/* Poster Header */}
        <div style={{
          backgroundColor: '#111827',
          color: '#FFFFFF',
          padding: 'clamp(1.2rem, 4vw, 1.75rem)',
          borderBottom: '3px solid #FFD600',
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#FFD600', letterSpacing: '0.08em' }}>
              PARAMADINA LITERASI • @PNEUMADINA
            </div>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.8rem, 6vw, 2.5rem)', fontWeight: '900', color: '#FFFFFF', lineHeight: 1.1, marginTop: '4px' }}>
              BOOK CLUB
            </h2>
            <p style={{ fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)', color: '#D1D5DB', marginTop: '6px', maxWidth: '520px' }}>
              Ruang bebas berekspresi, membaca bersama, dan mengkaji karya pemikiran sosial-humaniora & filsafat.
            </p>
          </div>

          <button 
            onClick={onClose}
            style={{
              backgroundColor: '#FFD600',
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

        {/* Schedule & Info Content */}
        <div style={{ padding: 'clamp(1.2rem, 4vw, 1.75rem)', overflowY: 'auto', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Key Info Cards Grid - Fluid Auto Fit */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            
            <div style={{
              backgroundColor: '#FFFDF7',
              border: '2px solid #111827',
              borderRadius: '14px',
              padding: '14px',
              boxShadow: '3px 3px 0px 0px #111827'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', color: '#2563EB', marginBottom: '4px', fontSize: '0.85rem' }}>
                <Clock size={16} />
                <span>WAKTU PELAKSANAAN</span>
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '900', color: '#111827' }}>
                Setiap Hari Kamis Sore
              </div>
              <div style={{ fontSize: '0.8rem', color: '#4B5563', marginTop: '2px' }}>
                Pukul 15:30 - 17:00 W.I.B.
              </div>
            </div>

            <div style={{
              backgroundColor: '#FFFDF7',
              border: '2px solid #111827',
              borderRadius: '14px',
              padding: '14px',
              boxShadow: '3px 3px 0px 0px #111827'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', color: '#2563EB', marginBottom: '4px', fontSize: '0.85rem' }}>
                <MapPin size={16} />
                <span>LOKASI KEGIATAN</span>
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '900', color: '#111827' }}>
                Kampus Cipayung
              </div>
              <div style={{ fontSize: '0.8rem', color: '#4B5563', marginTop: '2px' }}>
                Universitas Paramadina & Sesi Hybrid Online
              </div>
            </div>

          </div>

          {/* Special Feature Banner */}
          <div style={{
            backgroundColor: '#FFD600',
            border: '2px solid #111827',
            borderRadius: '14px',
            padding: '16px',
            boxShadow: '3px 3px 0px 0px #111827',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '2px solid #111827',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Coffee size={20} color="#111827" />
            </div>
            <div style={{ flexGrow: 1, minWidth: '200px' }}>
              <div style={{ fontWeight: '900', fontSize: '0.95rem', color: '#111827' }}>
                FORMAT RESMI: @JAKARTABOOKPARTY & LAPAK BACA BUKU GRATIS
              </div>
              <div style={{ fontSize: '0.8rem', color: '#1F2937', marginTop: '2px', lineHeight: '1.4' }}>
                Sesi dibagi menjadi <strong>30 menit membaca hening</strong> dan <strong>30 menit mengulas dalam lingkaran kecil</strong> (maksimal 5 orang). Penanggung Jawab: <strong>Diaz & Tim Redaksi</strong>, berkolaborasi dengan HIMA Paramasophia.
              </div>
            </div>
          </div>

          {/* Discussion Topics */}
          <div>
            <h4 style={{ fontWeight: '800', fontSize: '0.875rem', marginBottom: '8px' }}>Pilar Diskusi & Kajian Proker:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {[
                '📖 Selasar Literasi (Format @JakartaBookParty)',
                '🤝 MAJEMUK (Dialog Lintas SARA)',
                '🔬 KKP (Sains Non-Hegemonik)',
                '📜 Tata Cara Persidangan & Kongres',
                '🎨 PneuMaGazine (Zine Tridaya)',
                '🌱 Ekosentrisme & Kosmosentrisme'
              ].map((topic, i) => (
                <span key={i} className="badge badge-yellow" style={{ fontSize: '0.725rem', padding: '4px 10px' }}>
                  ✓ {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px', flexWrap: 'wrap' }}>
            <button className="btn btn-outline" onClick={onClose} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              Tutup
            </button>
            <a 
              href="https://instagram.com/pneumadina" 
              target="_blank" 
              rel="noreferrer"
              className="btn btn-yellow"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <Users size={16} /> Gabung Diskusi Instagram
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
