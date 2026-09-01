import React from 'react';

export default function PneumadinaLogo({ size = 44, showText = true }) {
  return (
    <div className="logo-container" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
      <img
        src="/logo.png"
        alt="Pneumadina Logo"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '10px',
          border: '2.5px solid #111827',
          boxShadow: '2.5px 2.5px 0px 0px #111827',
          objectFit: 'cover',
          flexShrink: 0,
          backgroundColor: '#FFD600'
        }}
      />

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ 
            fontSize: '1.35rem', 
            fontWeight: '900', 
            letterSpacing: '-0.03em', 
            color: '#111827',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            lineHeight: 1
          }}>
            Pneumadina
          </span>
          <span style={{ 
            fontSize: '0.7rem', 
            fontWeight: '700', 
            letterSpacing: '0.08em', 
            textTransform: 'uppercase',
            color: '#2563EB',
            marginTop: '3px'
          }}>
            Komunitas & Publikasi
          </span>
        </div>
      )}
    </div>
  );
}
