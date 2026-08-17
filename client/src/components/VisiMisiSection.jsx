import React from 'react';
import { Compass, Eye, Target, HeartHandshake, ShieldCheck, Scale, BookOpen, Sparkles, Feather } from 'lucide-react';

export default function VisiMisiSection() {
  return (
    <section style={{ margin: '2rem 0 1.5rem 0' }} className="animate-fade-in">
      
      {/* Outer Card Container with Pneumadina Yellow Grid Border */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '3px solid #111827',
        borderRadius: '20px',
        boxShadow: '6px 6px 0px 0px #111827',
        overflow: 'hidden'
      }}>
        
        {/* Header Bar - Responsive Yellow Theme */}
        <div style={{
          backgroundColor: '#FFD600',
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.45) 1.5px, transparent 1.5px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.45) 1.5px, transparent 1.5px)
          `,
          backgroundSize: '20px 20px',
          padding: 'clamp(1rem, 4vw, 1.5rem) clamp(1rem, 4vw, 2rem)',
          borderBottom: '3px solid #111827',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <span className="badge badge-dark" style={{ fontSize: '0.65rem' }}>GAGASAN, VISI & MISI</span>
              <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>KOMUNITAS PNEUMADINA</span>
            </div>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', fontWeight: '900', color: '#111827', lineHeight: 1.1 }}>
              Gagasan & Haluan Perjuangan
            </h2>
          </div>

          <div style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #111827',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontWeight: '800',
            fontSize: '0.8rem',
            color: '#2563EB',
            boxShadow: '2px 2px 0px 0px #111827',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Sparkles size={16} color="#2563EB" />
            <span>Lintas SARA, Demokrasi & Humaniora</span>
          </div>
        </div>

        {/* Inner Content Container */}
        <div style={{ padding: 'clamp(1rem, 4vw, 2rem)' }}>
          
          {/* Main Manifesto Banner */}
          <div style={{
            backgroundColor: '#FFFDF7',
            border: '2px solid #111827',
            borderRadius: '16px',
            padding: 'clamp(1rem, 3.5vw, 1.5rem)',
            marginBottom: '1.5rem',
            boxShadow: '3px 3px 0px 0px #111827'
          }}>
            <h3 style={{ fontSize: 'clamp(1.1rem, 3vw, 1.25rem)', fontWeight: '900', color: '#111827', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={20} color="#2563EB" />
              <span>Gagasan Utama Pneumadina</span>
            </h3>
            <p style={{ fontSize: 'clamp(0.875rem, 2vw, 1.05rem)', lineHeight: '1.65', color: '#1F2937' }}>
              <strong>Pneumadina</strong> (diambil dari kata <em>Pneuma</em> yang berarti napas, roh kebebasan, dan daya hidup) berdiri sebagai wacana publik dan komunitas independen yang mengayomi seluruh kawan tanpa memandang keanekaragaman latar belakang Suku, Agama, Ras, dan Antargolongan (SARA). Kami berkomitmen memperjuangkan kebebasan berpikir, toleransi antar-iman, keadilan sosial, dan tradisi berliterasi kritis.
            </p>
          </div>

          {/* Vision & Mission 3 Pillars Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            
            {/* Pillar 1: Pluralisme & Lintas SARA */}
            <div style={{
              backgroundColor: '#FAF8F5',
              border: '2px solid #111827',
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#FFD600',
                  border: '2px solid #111827',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px',
                  boxShadow: '2px 2px 0px 0px #111827'
                }}>
                  <HeartHandshake size={20} color="#111827" />
                </div>
                <h4 className="font-serif" style={{ fontSize: '1.15rem', fontWeight: '800', color: '#111827', marginBottom: '6px' }}>
                  1. Pluralisme & Kehidupan Lintas SARA
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#4B5563', lineHeight: '1.55' }}>
                  Menyediakan ruang aman untuk merayakan kebhinnekaan, dialog lintas iman/SARA, menghapus prasangka, serta merajut keharmonisan sosial secara gotong royong.
                </p>
              </div>
              <div style={{ marginTop: '12px', fontSize: '0.75rem', fontWeight: '800', color: '#2563EB' }}>
                ✓ Dialog Interreligius & Kebudayaan
              </div>
            </div>

            {/* Pillar 2: Demokrasi & Pasifisme */}
            <div style={{
              backgroundColor: '#FAF8F5',
              border: '2px solid #111827',
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#EFF6FF',
                  border: '2px solid #2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px',
                  boxShadow: '2px 2px 0px 0px #111827'
                }}>
                  <Scale size={20} color="#2563EB" />
                </div>
                <h4 className="font-serif" style={{ fontSize: '1.15rem', fontWeight: '800', color: '#111827', marginBottom: '6px' }}>
                  2. Demokrasi, Keadilan & Pasifisme
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#4B5563', lineHeight: '1.55' }}>
                  Menolak kekerasan (pasifisme), memperjuangkan prinsip-prinsip keadilan sipil, kesetaraan hak asasi, serta mengawal prinsip-prinsip demokrasi yang berkeadilan.
                </p>
              </div>
              <div style={{ marginTop: '12px', fontSize: '0.75rem', fontWeight: '800', color: '#2563EB' }}>
                ✓ Anti-Kekerasan & Advokasi Keadilan
              </div>
            </div>

            {/* Pillar 3: Sosial-Humaniora & Literasi */}
            <div style={{
              backgroundColor: '#FAF8F5',
              border: '2px solid #111827',
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#FFD600',
                  border: '2px solid #111827',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px',
                  boxShadow: '2px 2px 0px 0px #111827'
                }}>
                  <BookOpen size={20} color="#111827" />
                </div>
                <h4 className="font-serif" style={{ fontSize: '1.15rem', fontWeight: '800', color: '#111827', marginBottom: '6px' }}>
                  3. Literasi & Ekspresi Kebudayaan
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#4B5563', lineHeight: '1.55' }}>
                  Mendorong karya tulisan fiksi & non-fiksi, Book Club mingguan, fotografi, dan seni ilustrasi sebagai sarana penyulut daya kritis masyarakat.
                </p>
              </div>
              <div style={{ marginTop: '12px', fontSize: '0.75rem', fontWeight: '800', color: '#2563EB' }}>
                ✓ Terima Publikasi Karya & Lapak Baca
              </div>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
