import React from 'react';
import { Send, BookOpen, Sparkles, ArrowRight, Flame } from 'lucide-react';

export default function HeroBanner({ onOpenTerimaPublikasi, onOpenBookClub }) {
  return (
    <section className="container" style={{ margin: '1rem auto 1rem auto' }}>
      
      {/* Main Grid Wrapper - Responsive Breakdown for 320px - 360px Mobile screens */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem',
        alignItems: 'stretch'
      }}>
        
        {/* Left Column: Big Pneumadina Poster Banner */}
        <div style={{
          backgroundColor: '#FFD600',
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.45) 2px, transparent 2px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.45) 2px, transparent 2px)
          `,
          backgroundSize: '24px 24px',
          border: '3.5px solid #111827',
          borderRadius: '24px',
          padding: 'clamp(1rem, 4vw, 2.25rem)',
          boxShadow: '6px 6px 0px 0px #111827',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
              <span className="badge badge-dark" style={{ boxShadow: '2px 2px 0px 0px #000', fontSize: '0.675rem', padding: '3px 8px' }}>
                <Sparkles size={12} color="#FFD600" /> KOMUNITAS LINTAS SARA
              </span>
              <span className="badge badge-blue" style={{ boxShadow: '2px 2px 0px 0px #111827', fontSize: '0.675rem', padding: '3px 8px' }}>
                <Flame size={12} color="#2563EB" /> EST. 2026
              </span>
            </div>

            <h1 className="font-serif hero-title" style={{
              fontSize: 'clamp(2rem, 7vw, 3.5rem)',
              fontWeight: '900',
              color: '#111827',
              lineHeight: '1.05',
              letterSpacing: '-0.02em',
              marginBottom: '1rem'
            }}>
              Pneumadina
            </h1>

            <p style={{
              fontSize: 'clamp(0.875rem, 2.5vw, 1.1rem)',
              fontWeight: '600',
              color: '#111827',
              lineHeight: '1.55',
              maxWidth: '580px',
              marginBottom: '1.5rem'
            }}>
              Bergerak di bidang <strong>pluralisme</strong>, <strong>demokrasi</strong>, <strong>pasifisme</strong>, dan <strong>sosial-humaniora</strong>. Pneumadina mengayomi para kawan lintas SARA untuk berekspresi, berdiskusi, dan merayakan karya.
            </p>

            {/* Live Stats Pill Bar (Fluid Wrap for Narrow Screens like Galaxy Z Fold 344px) */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '1.5rem',
              padding: '8px 12px',
              backgroundColor: '#FFFFFF',
              border: '2px solid #111827',
              borderRadius: '14px',
              boxShadow: '3px 3px 0px 0px #111827'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.775rem', fontWeight: '800' }}>
                <span style={{ color: '#2563EB' }}>📚</span> 7 Artikel Terbit
              </div>
              <span style={{ color: '#9CA3AF' }}>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.775rem', fontWeight: '800' }}>
                <span style={{ color: '#2563EB' }}>✍️</span> 3 Author Aktif
              </div>
              <span style={{ color: '#9CA3AF' }}>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.775rem', fontWeight: '800' }}>
                <span style={{ color: '#2563EB' }}>☕</span> Kamis Book Club
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <button 
              className="btn btn-dark"
              onClick={onOpenTerimaPublikasi}
              style={{ padding: '0.7rem 1.2rem', fontSize: '0.85rem', flexGrow: 1, minWidth: '140px', justifyContent: 'center' }}
            >
              <Send size={16} /> Kirim Publikasi Karya
            </button>

            <button 
              className="btn btn-blue"
              onClick={onOpenBookClub}
              style={{ padding: '0.7rem 1.2rem', fontSize: '0.85rem', flexGrow: 1, minWidth: '140px', justifyContent: 'center' }}
            >
              <BookOpen size={16} /> Ikuti Book Club Mingguan
            </button>
          </div>

        </div>

        {/* Right Column: Book Club Flyer & Publication Announcement */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Card 1: Book Club Poster */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '3.5px solid #111827',
            borderRadius: '20px',
            padding: 'clamp(1rem, 4vw, 1.5rem)',
            boxShadow: '6px 6px 0px 0px #111827',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flexGrow: 1
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '4px' }}>
                <span className="badge badge-yellow" style={{ boxShadow: '2px 2px 0px 0px #111827', fontSize: '0.65rem' }}>BOOK CLUB WEEKLY</span>
                <span style={{ fontSize: '0.725rem', fontWeight: '800', color: '#2563EB' }}>SETIAP KAMIS SORE</span>
              </div>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: '900', color: '#111827', marginBottom: '6px' }}>
                Paramadina Literasi x Pneumadina
              </h3>
              <p style={{ fontSize: '0.825rem', color: '#4B5563', lineHeight: '1.5', marginBottom: '14px' }}>
                Lapak baca & diskusi terbuka seputar filsafat, sains, fiksi, dan isu sosial-humaniora.
              </p>
            </div>
            <button 
              className="btn btn-outline" 
              onClick={onOpenBookClub}
              style={{ width: '100%', padding: '0.6rem', fontSize: '0.825rem', justifyContent: 'center' }}
            >
              Jadwal & Tempat &rarr;
            </button>
          </div>

          {/* Card 2: Open Submission Flyer */}
          <div style={{
            backgroundColor: '#2563EB',
            color: '#FFFFFF',
            border: '3.5px solid #111827',
            borderRadius: '20px',
            padding: 'clamp(1rem, 4vw, 1.5rem)',
            boxShadow: '6px 6px 0px 0px #111827',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flexGrow: 1
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '4px' }}>
                <span className="badge badge-yellow" style={{ boxShadow: '2px 2px 0px 0px #111827', fontSize: '0.65rem' }}>OPEN SUBMISSION</span>
                <span style={{ fontSize: '0.725rem', fontWeight: '800', color: '#FFD600' }}>GRATIS</span>
              </div>
              <h3 className="font-serif" style={{ fontSize: '1.25rem', fontWeight: '900', marginBottom: '6px' }}>
                Terima Publikasi Karya
              </h3>
              <p style={{ fontSize: '0.825rem', opacity: 0.9, lineHeight: '1.5', marginBottom: '14px' }}>
                Kirim esai, cerita fiksi, desain ilustrasi, atau karya fotografi Anda untuk diterbitkan di blog Pneumadina.
              </p>
            </div>
            <button 
              className="btn btn-yellow" 
              onClick={onOpenTerimaPublikasi}
              style={{ width: '100%', padding: '0.6rem', fontSize: '0.825rem', justifyContent: 'center' }}
            >
              Kirim Karya Anda <ArrowRight size={15} />
            </button>
          </div>

        </div>

      </div>

    </section>
  );
}
