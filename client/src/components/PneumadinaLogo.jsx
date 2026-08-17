import React from 'react';

export default function PneumadinaLogo({ size = 48, showText = true }) {
  return (
    <div className="logo-container" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
      <div 
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#FFD600',
          border: '2px solid #111827',
          boxShadow: '2px 2px 0px 0px #111827',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Right Half White Grid Overlay */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            backgroundImage: `
              linear-gradient(to right, #FFFFFF 2px, transparent 2px),
              linear-gradient(to bottom, #FFFFFF 2px, transparent 2px)
            `,
            backgroundSize: `${size / 4}px ${size / 4}px`,
            borderLeft: '2px solid #FFFFFF'
          }}
        />

        {/* Logo Text: Pneuma + dina white circle badge */}
        <div 
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: '900',
            color: '#000000',
            fontSize: `${size * 0.32}px`,
            letterSpacing: '-0.03em',
            userSelect: 'none'
          }}
        >
          <span>Pneuma</span>
          
          {/* White circle badge for 'dina' */}
          <div
            style={{
              width: `${size * 0.35}px`,
              height: `${size * 0.35}px`,
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '-4px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
            }}
          >
            <span
              style={{
                writingMode: 'vertical-rl',
                textOrientation: 'upright',
                fontSize: `${size * 0.12}px`,
                fontWeight: '900',
                color: '#000000',
                letterSpacing: '-0.1em',
                lineHeight: 1
              }}
            >
              dina
            </span>
          </div>
        </div>
      </div>

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
            marginTop: '2px'
          }}>
            Komunitas & Publikasi
          </span>
        </div>
      )}
    </div>
  );
}
