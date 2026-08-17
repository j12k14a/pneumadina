import React, { useState } from 'react';
import { Heart, QrCode, Copy, CheckCircle2, Sparkles, X, ShieldCheck, Globe, BookOpen } from 'lucide-react';

export default function DonationModal({ onClose }) {
  const [copiedAccount, setCopiedAccount] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 3000);
  };

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
            🌐 Operasional Server & Domain (`pneumadina.is-a.dev`)
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
          borderRadius: '18px',
          padding: '16px',
          textAlign: 'center',
          marginBottom: '1.25rem',
          boxShadow: '4px 4px 0px 0px #111827'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#111827', color: '#FFD600', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '900', marginBottom: '12px' }}>
            <QrCode size={14} /> SCAN QRIS BEBAS BIAYA ADMIN
          </div>

          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '12px',
            borderRadius: '14px',
            border: '2px solid #111827',
            display: 'inline-block',
            maxWidth: '240px',
            boxShadow: '3px 3px 0px 0px #111827',
            marginBottom: '8px'
          }}>
            <img 
              src="/qris-pneumadina.png" 
              alt="QRIS Donasi Pneumadina" 
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }} 
            />
          </div>

          <p style={{ fontSize: '0.775rem', fontWeight: '700', color: '#111827' }}>
            Bisa di-scan via <strong>GoPay, OVO, ShopeePay, DANA, BCA, Mandiri, BRI</strong>, dan seluruh aplikasi M-Banking & E-Wallet berlogo QRIS.
          </p>
        </div>

        {/* Alternative Bank Transfer Info */}
        <div style={{
          backgroundColor: '#FAF8F5',
          border: '2px solid #111827',
          borderRadius: '14px',
          padding: '12px 16px',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#6B7280' }}>TRANSFER REKENING BANK BCA</div>
            <div style={{ fontSize: '1rem', fontWeight: '900', color: '#111827' }}>8410-9238-41</div>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#2563EB' }}>a.n. Pneumadina Komunitas Penggerak</div>
          </div>

          <button 
            onClick={() => handleCopy('8410923841')}
            className={`btn ${copiedAccount ? 'btn-yellow' : 'btn-outline'}`}
            style={{ padding: '6px 14px', fontSize: '0.775rem' }}
          >
            {copiedAccount ? <CheckCircle2 size={14} color="#059669" /> : <Copy size={14} />}
            {copiedAccount ? 'Tersalin!' : 'Salin Rekening'}
          </button>
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
