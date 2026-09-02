import React from 'react';
import { Heart, QrCode, Sparkles, X, Globe, BookOpen } from 'lucide-react';

export default function DonationModal({ onClose }) {
  return (
    <div className="animate-backdrop" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(17, 24, 39, 0.8)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div className="animate-popup-enter" style={{
        backgroundColor: '#FFFFFF',
        border: '3.5px solid #111827',
        borderRadius: '24px',
        maxWidth: '560px',
        width: '100%',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: '8px 8px 0px 0px #FFD600',
        padding: 'clamp(1.25rem, 4vw, 2rem)',
        position: 'relative',
        color: '#111827'
      }}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '16px',
            top: '16px',
            backgroundColor: '#FFD600',
            border: '2px solid #111827',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '2px 2px 0px 0px #111827',
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>

        {/* Top Header Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <span className="badge badge-yellow" style={{ boxShadow: '2px 2px 0px 0px #111827' }}>
            <Heart size={14} color="#DC2626" fill="#DC2626" /> DUKUNG PNEUMADINA
          </span>
          <span className="badge badge-dark">
            <Sparkles size={13} color="#FFD600" /> OPEN DONATION 100% TRANSPARAN
          </span>
        </div>

        <h2 className="font-serif" style={{ fontSize: 'clamp(1.4rem, 5vw, 2rem)', fontWeight: '900', lineHeight: '1.15', marginBottom: '8px' }}>
          Gotong Royong & Donasi Pengembangan Komunitas
        </h2>

        <p style={{ fontSize: '0.875rem', color: '#4B5563', lineHeight: '1.5', marginBottom: '1.25rem' }}>
          Dukungan Anda membantu operasional website, penyediaan buku lapak baca Paramadina Literasi, serta apresiasi publikasi tulisan kawan-kawan lintas SARA.
        </p>

        {/* Impact Transparency Pillars */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '8px',
          marginBottom: '1.25rem'
        }}>
          <div style={{ backgroundColor: '#FFFDF5', border: '1.5px solid #111827', padding: '8px 10px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '800' }}>
            🌐 Operasional Server & Domain (<code>pneumadina.web.app</code>)
          </div>
          <div style={{ backgroundColor: '#EFF6FF', border: '1.5px solid #2563EB', padding: '8px 10px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '800', color: '#2563EB' }}>
            📖 Buku & Lapak Baca Paramadina Literasi
          </div>
          <div style={{ backgroundColor: '#F0FDF4', border: '1.5px solid #16A34A', padding: '8px 10px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '800', color: '#16A34A' }}>
            ✍️ Dukungan Penerbitan Penulis Lintas SARA
          </div>
        </div>

        {/* QRIS Container Box */}
        <div style={{
          backgroundColor: '#FFD600',
          border: '3px solid #111827',
          borderRadius: '20px',
          padding: '16px',
          textAlign: 'center',
          marginBottom: '1.25rem',
          boxShadow: '4px 4px 0px 0px #111827'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#111827', color: '#FFD600', padding: '5px 14px', borderRadius: '9999px', fontSize: '0.775rem', fontWeight: '900', marginBottom: '14px' }}>
            <QrCode size={15} /> SCAN QRIS BEBAS BIAYA ADMIN
          </div>

          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '10px',
            borderRadius: '16px',
            border: '2.5px solid #111827',
            display: 'inline-block',
            maxWidth: '290px',
            width: '100%',
            boxShadow: '4px 4px 0px 0px #111827',
            marginBottom: '12px'
          }}>
            <img 
              src="/qris-pneumadina.png?v=2" 
              alt="QRIS Donasi Pneumadina - Muhammad Rayan Bramantyo" 
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '10px' }} 
            />
          </div>

          <div style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #111827',
            borderRadius: '12px',
            padding: '8px 12px',
            maxWidth: '360px',
            margin: '0 auto 10px auto',
            fontSize: '0.775rem',
            color: '#111827',
            fontWeight: '700'
          }}>
            <div><strong>Nama Merchant:</strong> MUHAMMAD RAYAN BRAMANTYO, EDUKASI</div>
            <div style={{ color: '#4B5563', fontSize: '0.7rem' }}>NMID: ID1026554120893</div>
          </div>

          <p style={{ fontSize: '0.775rem', fontWeight: '700', color: '#111827', margin: 0 }}>
            Bisa di-scan via <strong>GoPay, OVO, ShopeePay, DANA, BCA Mobile, Livin' Mandiri, BRImo</strong>, dan seluruh aplikasi M-Banking & E-Wallet berlogo QRIS / GPN.
          </p>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button className="btn btn-dark" onClick={onClose} style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}>
            Terimakasih Atas Dukungan Kawan-Kawan 💛
          </button>
        </div>

      </div>
    </div>
  );
}
