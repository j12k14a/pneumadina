import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Users, Camera, Calendar } from 'lucide-react';

const carouselSlides = [
  {
    id: 1,
    title: 'MEMPERINGATI HARI LAHIR PANCASILA BERSAMA PAGUYUBAN SUMARAH',
    subtitle: 'Aktivitas Diskusi & Silaturahmi Lintas Iman Komunitas Pneumadina',
    badge: 'AKTIVITAS TERBARU KABINET',
    date: '1 Juni 2026',
    location: 'Pendopo Kebudayaan, Sumarah',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1400&q=80'
  },
  {
    id: 2,
    title: 'HARI LAHIR ICRP KE-26: MERAWAT KEBERAGAMAN, MEWARISKAN PERADABAN',
    subtitle: 'Kolaborasi Pneumadina x ICRP TV dalam Advokasi Pasifisme & Hak Asasi',
    badge: 'SARASEHAN & DIALOG LINTAS SARA',
    date: '14 Juli 2026',
    location: 'Aula ICRP Jakarta',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80'
  },
  {
    id: 3,
    title: 'LAPAK BACA MINGGUAN PARAMADINA LITERASI x PNEUMADINA',
    subtitle: 'Ruang Bebas Berekspresi & Mengkaji Karya Pemikiran Sosial-Humaniora',
    badge: 'BOOK CLUB MINGGUAN',
    date: 'Setiap Kamis Sore',
    location: 'Kampus Cipayung Paramadina',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1400&q=80'
  },
  {
    id: 4,
    title: 'KABINET PENGGERAK & REDAKSI EDITORIAL PNEUMADINA 2026',
    subtitle: 'Mengayomi Seluruh Kawan Lintas SARA untuk Berekspresi dan Merayakan Karya',
    badge: 'KABINET PNEUMADINA',
    date: 'Tahun Ajaran 2026/2027',
    location: 'Paramadina & Online Hub',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80'
  }
];

export default function KabinetCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? carouselSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselSlides.length);
  };

  const activeSlide = carouselSlides[currentIndex];

  return (
    <div className="container" style={{ margin: '1rem auto 1.5rem auto' }}>
      <div style={{
        position: 'relative',
        width: '100%',
        height: 'clamp(280px, 42vw, 440px)',
        borderRadius: '24px',
        border: '3.5px solid #111827',
        boxShadow: '8px 8px 0px 0px #111827',
        overflow: 'hidden',
        backgroundColor: '#111827'
      }}>
        
        {/* Background Image with Dark Gradient Overlay */}
        <img 
          src={activeSlide.image} 
          alt={activeSlide.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'all 0.6s ease-in-out',
            filter: 'brightness(0.78)'
          }}
        />

        {/* Top Floating Badge */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          flexWrap: 'wrap',
          zIndex: 10
        }}>
          <span className="badge badge-yellow" style={{ boxShadow: '3px 3px 0px 0px #111827', fontSize: '0.75rem', padding: '6px 14px' }}>
            <Sparkles size={14} color="#111827" /> {activeSlide.badge}
          </span>
          <span className="badge badge-dark" style={{ border: '1.5px solid #FFD600', fontSize: '0.75rem', padding: '6px 14px' }}>
            📅 {activeSlide.date}
          </span>
        </div>

        {/* Bottom Banner Info Box */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          padding: 'clamp(1.25rem, 4vw, 2rem)',
          background: 'linear-gradient(to top, rgba(17, 24, 39, 0.95) 0%, rgba(17, 24, 39, 0.6) 70%, transparent 100%)',
          color: '#FFFFFF',
          zIndex: 10
        }}>
          <div style={{ maxWidth: '820px' }}>
            <h2 className="font-serif" style={{
              fontSize: 'clamp(1.3rem, 4.5vw, 2.2rem)',
              fontWeight: '900',
              color: '#FFD600',
              lineHeight: '1.15',
              letterSpacing: '-0.01em',
              marginBottom: '6px',
              textShadow: '2px 2px 0px #111827'
            }}>
              {activeSlide.title}
            </h2>

            <p style={{
              fontSize: 'clamp(0.85rem, 2.5vw, 1.05rem)',
              color: '#F3F4F6',
              fontWeight: '600',
              lineHeight: '1.5',
              marginBottom: '8px'
            }}>
              {activeSlide.subtitle}
            </p>

            <div style={{ fontSize: '0.775rem', color: '#D1D5DB', display: 'flex', alignItems: 'center', gap: '6px' }}>
              📍 <span>Lokasi: <strong>{activeSlide.location}</strong></span>
            </div>
          </div>
        </div>

        {/* Left Arrow Navigation Button */}
        <button 
          onClick={handlePrev}
          style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: '#FFD600',
            color: '#111827',
            border: '2.5px solid #111827',
            borderRadius: '50%',
            width: '42px',
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '3px 3px 0px 0px #111827',
            zIndex: 20
          }}
        >
          <ChevronLeft size={24} />
        </button>

        {/* Right Arrow Navigation Button */}
        <button 
          onClick={handleNext}
          style={{
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: '#FFD600',
            color: '#111827',
            border: '2.5px solid #111827',
            borderRadius: '50%',
            width: '42px',
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '3px 3px 0px 0px #111827',
            zIndex: 20
          }}
        >
          <ChevronRight size={24} />
        </button>

        {/* Slide Indicator Dots */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          right: '24px',
          display: 'flex',
          gap: '8px',
          zIndex: 20
        }}>
          {carouselSlides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: idx === currentIndex ? '28px' : '10px',
                height: '10px',
                borderRadius: '9999px',
                backgroundColor: idx === currentIndex ? '#FFD600' : 'rgba(255, 255, 255, 0.5)',
                border: '1.5px solid #111827',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
