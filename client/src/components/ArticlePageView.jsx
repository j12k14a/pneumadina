import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Bookmark, 
  Share2, 
  Download, 
  BookOpen, 
  Clock, 
  Calendar, 
  User, 
  MessageSquare, 
  Send, 
  Check, 
  Copy, 
  Sparkles, 
  List, 
  Type, 
  Sun, 
  Moon, 
  FileText,
  ChevronUp
} from 'lucide-react';
import { getArticleUrl, shareContent, getSocialShareLinks } from '../utils/urlHelper';

export default function ArticlePageView({
  post,
  onBack,
  onLike,
  onBookmark,
  isLiked,
  isBookmarked,
  currentUser,
  onAddComment,
  showToast
}) {
  const [fontSize, setFontSize] = useState(17); // 15px - 22px
  const [readingTheme, setReadingTheme] = useState('light'); // 'light' | 'sepia' | 'dark'
  const [commentText, setCommentText] = useState('');
  const [copiedToast, setCopiedToast] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showToc, setShowToc] = useState(false);
  const [activeHeading, setActiveHeading] = useState('');

  const articleUrl = getArticleUrl(post);
  const readTimeMinutes = Math.max(3, Math.ceil((post.content?.length || 2000) / 450));
  
  const socialLinks = getSocialShareLinks({
    title: post.title,
    url: articleUrl,
    text: post.content?.substring(0, 160) + '...'
  });

  // Calculate Reading Progress on scroll
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setReadingProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parse Headings for Table of Contents (TOC)
  const headings = [];
  if (post.content) {
    const lines = post.content.split('\n');
    lines.forEach((line, idx) => {
      const h2Match = line.match(/^##\s+(.+)$/);
      const h3Match = line.match(/^###\s+(.+)$/);
      if (h2Match) {
        headings.push({ id: `sec-${idx}`, level: 2, title: h2Match[1].replace(/[*_#]/g, '').trim() });
      } else if (h3Match) {
        headings.push({ id: `sec-${idx}`, level: 3, title: h3Match[1].replace(/[*_#]/g, '').trim() });
      }
    });
  }

  const handleShare = async () => {
    const res = await shareContent({
      title: post.title,
      text: `${post.title} — Baca di Blog Pneumadina`,
      url: articleUrl
    });

    if (res.success) {
      if (res.method === 'clipboard') {
        setCopiedToast(true);
        if (showToast) showToast('🔗 Tautan artikel berhasil disalin ke clipboard!');
        setTimeout(() => setCopiedToast(false), 3000);
      }
    }
  };

  const handleSendComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(post.id, commentText.trim());
    setCommentText('');
  };

  const scrollToSection = (title) => {
    setShowToc(false);
    const elements = document.querySelectorAll('h2, h3, h4');
    for (const el of elements) {
      if (el.textContent.toLowerCase().includes(title.toLowerCase())) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      }
    }
  };

  const themeStyles = {
    light: {
      bg: '#FAF8F5',
      surface: '#FFFFFF',
      text: '#1F2937',
      heading: '#111827',
      border: '#111827',
      muted: '#6B7280'
    },
    sepia: {
      bg: '#FBF0D9',
      surface: '#F4E8C1',
      text: '#433422',
      heading: '#2C1810',
      border: '#2C1810',
      muted: '#7C6F5A'
    },
    dark: {
      bg: '#0F172A',
      surface: '#1E293B',
      text: '#E2E8F0',
      heading: '#F8FAFC',
      border: '#F8FAFC',
      muted: '#94A3B8'
    }
  };

  const currentTheme = themeStyles[readingTheme] || themeStyles.light;

  // Custom Markdown Line Renderer
  const renderMarkdownContent = (rawText) => {
    if (!rawText) return null;

    const blocks = rawText.split('\n\n');
    return blocks.map((block, idx) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      // H1 / Title
      if (trimmed.startsWith('# ')) {
        return (
          <h1 key={idx} className="font-serif" style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            fontWeight: '900',
            color: currentTheme.heading,
            lineHeight: '1.2',
            margin: '2rem 0 1rem 0',
            borderBottom: `2px solid ${currentTheme.border}`,
            paddingBottom: '0.75rem'
          }}>
            {trimmed.replace(/^#\s+/, '')}
          </h1>
        );
      }

      // H2
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="font-serif" style={{
            fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)',
            fontWeight: '900',
            color: currentTheme.heading,
            lineHeight: '1.25',
            margin: '2.5rem 0 0.85rem 0',
            borderLeft: '5px solid #FFD600',
            paddingLeft: '12px'
          }}>
            {trimmed.replace(/^##\s+/, '')}
          </h2>
        );
      }

      // H3
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)',
            fontWeight: '800',
            color: '#2563EB',
            margin: '1.75rem 0 0.65rem 0'
          }}>
            {trimmed.replace(/^###\s+/, '')}
          </h3>
        );
      }

      // Blockquote / Abstract
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={idx} style={{
            backgroundColor: readingTheme === 'dark' ? '#334155' : '#FFFDF5',
            border: `2.5px solid ${currentTheme.border}`,
            borderLeft: '8px solid #FFD600',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            margin: '1.5rem 0',
            fontSize: `${fontSize}px`,
            lineHeight: '1.7',
            color: currentTheme.text,
            boxShadow: `4px 4px 0px 0px ${currentTheme.border}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '900', marginBottom: '8px', color: '#111827' }}>
              <BookOpen size={16} color="#2563EB" /> ABSTRAK AKADEMIK
            </div>
            {trimmed.replace(/^>\s+/, '')}
          </blockquote>
        );
      }

      // Horizontal Rule
      if (trimmed === '---') {
        return <hr key={idx} style={{ border: `1.5px dashed ${currentTheme.border}`, margin: '2rem 0' }} />;
      }

      // Regular Paragraph with Bold/Italic formatting
      return (
        <p key={idx} style={{
          fontSize: `${fontSize}px`,
          lineHeight: '1.8',
          color: currentTheme.text,
          marginBottom: '1.25rem',
          textAlign: 'justify'
        }}>
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: currentTheme.bg,
      color: currentTheme.text,
      transition: 'background-color 0.2s ease, color 0.2s ease'
    }}>
      
      {/* Top Fixed Reading Progress Bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '4px',
        backgroundColor: 'rgba(0,0,0,0.1)',
        zIndex: 1000
      }}>
        <div style={{
          height: '100%',
          width: `${readingProgress}%`,
          backgroundColor: '#FFD600',
          borderBottom: '1px solid #111827',
          transition: 'width 0.1s linear'
        }} />
      </div>

      {/* Floating Header Actions Bar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: currentTheme.surface,
        borderBottom: `2.5px solid ${currentTheme.border}`,
        boxShadow: `0 3px 0px 0px ${currentTheme.border}`,
        padding: '10px 16px'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          
          {/* Back Button */}
          <button
            onClick={onBack}
            className="btn btn-yellow"
            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
          >
            <ArrowLeft size={16} /> Kembali ke Beranda
          </button>

          {/* Center Reading Title Snippet */}
          <div style={{
            fontSize: '0.85rem',
            fontWeight: '900',
            color: currentTheme.heading,
            maxWidth: '380px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }} className="hide-on-very-small">
            📖 {post.title}
          </div>

          {/* Reading Controls (Font Size, Theme, Share, TOC) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            
            {/* TOC Toggle Button */}
            {headings.length > 0 && (
              <button
                onClick={() => setShowToc(!showToc)}
                className="btn btn-outline"
                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                title="Daftar Isi / Navigasi Bab"
              >
                <List size={14} /> Daftar Isi ({headings.length})
              </button>
            )}

            {/* Font Size Adjuster */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: currentTheme.bg,
              border: `1.5px solid ${currentTheme.border}`,
              borderRadius: '9999px',
              padding: '2px 6px'
            }}>
              <button
                onClick={() => setFontSize(prev => Math.max(14, prev - 1))}
                title="Perkecil Ukuran Teks"
                style={{ background: 'none', border: 'none', fontWeight: '900', fontSize: '0.8rem', cursor: 'pointer', padding: '0 4px', color: currentTheme.heading }}
              >
                A-
              </button>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', margin: '0 4px', color: currentTheme.muted }}>
                {fontSize}px
              </span>
              <button
                onClick={() => setFontSize(prev => Math.min(24, prev + 1))}
                title="Perbesar Ukuran Teks"
                style={{ background: 'none', border: 'none', fontWeight: '900', fontSize: '0.8rem', cursor: 'pointer', padding: '0 4px', color: currentTheme.heading }}
              >
                A+
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setReadingTheme(prev => prev === 'light' ? 'sepia' : prev === 'sepia' ? 'dark' : 'light')}
              className="btn btn-outline"
              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
              title="Ganti Mode Baca (Terang / Sepia / Gelap)"
            >
              {readingTheme === 'light' && <>☀️ Siang</>}
              {readingTheme === 'sepia' && <>📜 Sepia</>}
              {readingTheme === 'dark' && <>🌙 Malam</>}
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="btn btn-yellow"
              style={{ padding: '4px 12px', fontSize: '0.75rem' }}
            >
              <Share2 size={13} /> {copiedToast ? 'Tersalin!' : 'Bagikan'}
            </button>
          </div>

        </div>
      </header>

      {/* Table of Contents Popup / Drawer */}
      {showToc && headings.length > 0 && (
        <div style={{
          position: 'fixed',
          top: '60px',
          right: '16px',
          maxWidth: '340px',
          width: '90%',
          backgroundColor: currentTheme.surface,
          border: `3px solid ${currentTheme.border}`,
          borderRadius: '16px',
          boxShadow: `6px 6px 0px 0px ${currentTheme.border}`,
          padding: '14px',
          zIndex: 200,
          maxHeight: '70vh',
          overflowY: 'auto'
        }} className="animate-popup-enter">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4 style={{ fontWeight: '900', fontSize: '0.9rem', color: currentTheme.heading, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <List size={16} color="#2563EB" /> Navigasi Bab & Bagian
            </h4>
            <button
              onClick={() => setShowToc(false)}
              style={{ background: 'none', border: 'none', fontWeight: '900', fontSize: '0.9rem', cursor: 'pointer', color: currentTheme.heading }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {headings.map((h, i) => (
              <button
                key={i}
                onClick={() => scrollToSection(h.title)}
                style={{
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  fontSize: h.level === 2 ? '0.825rem' : '0.75rem',
                  fontWeight: h.level === 2 ? '800' : '600',
                  color: h.level === 2 ? '#2563EB' : currentTheme.text,
                  paddingLeft: h.level === 3 ? '16px' : '8px',
                  cursor: 'pointer',
                  borderLeft: h.level === 2 ? '2px solid #FFD600' : 'none'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.bg}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {h.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Article Content Container */}
      <main className="container" style={{ maxWidth: '880px', padding: '2.5rem 16px 4rem 16px' }}>
        
        {/* Article Meta Header Box */}
        <div style={{
          backgroundColor: currentTheme.surface,
          border: `3px solid ${currentTheme.border}`,
          borderRadius: '20px',
          boxShadow: `6px 6px 0px 0px ${currentTheme.border}`,
          padding: 'clamp(1.25rem, 4vw, 2.25rem)',
          marginBottom: '2rem'
        }}>
          
          {/* Categories & Paper Type Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <span className="badge badge-yellow" style={{ fontSize: '0.725rem' }}>
              <FileText size={13} color="#111827" /> ARTIKEL ILMIAH / ACADEMIC PAPER
            </span>
            {post.categories?.map(c => (
              <span key={c.id} className="badge badge-dark" style={{ fontSize: '0.725rem' }}>
                {c.name}
              </span>
            ))}
          </div>

          {/* Article Main Title */}
          <h1 className="font-serif" style={{
            fontSize: 'clamp(1.5rem, 4.5vw, 2.4rem)',
            fontWeight: '900',
            color: currentTheme.heading,
            lineHeight: '1.2',
            letterSpacing: '-0.5px',
            marginBottom: '1rem'
          }}>
            {post.title}
          </h1>

          {/* Author Details & Date */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            paddingTop: '12px',
            borderTop: `2px solid ${currentTheme.border}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: '#FFD600',
                border: `2px solid ${currentTheme.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '900',
                fontSize: '1.1rem',
                color: '#111827',
                boxShadow: `2px 2px 0px 0px ${currentTheme.border}`
              }}>
                {post.author_name?.charAt(0) || 'J'}
              </div>
              <div>
                <div style={{ fontWeight: '900', fontSize: '0.95rem', color: currentTheme.heading }}>
                  {post.author_name}
                </div>
                <div style={{ fontSize: '0.75rem', color: currentTheme.muted, fontWeight: '600' }}>
                  {post.author_bio || 'Redaksi Pneumadina'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.775rem', color: currentTheme.muted, fontWeight: '700' }}>
              <span>📅 {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span>•</span>
              <span>⏱️ {readTimeMinutes} menit baca</span>
            </div>
          </div>
        </div>

        {/* Article Cover Image Banner */}
        {post.thumbnail && (
          <div style={{
            borderRadius: '18px',
            border: `3px solid ${currentTheme.border}`,
            boxShadow: `6px 6px 0px 0px ${currentTheme.border}`,
            overflow: 'hidden',
            marginBottom: '2.5rem',
            maxHeight: '420px',
            backgroundColor: '#111827'
          }}>
            <img
              src={post.thumbnail}
              alt={post.title}
              style={{ width: '100%', height: '100%', maxHeight: '420px', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Long-Form Rendered Article Body */}
        <article style={{
          backgroundColor: currentTheme.surface,
          border: `3px solid ${currentTheme.border}`,
          borderRadius: '20px',
          boxShadow: `6px 6px 0px 0px ${currentTheme.border}`,
          padding: 'clamp(1.5rem, 4.5vw, 3rem)',
          marginBottom: '2.5rem'
        }}>
          {renderMarkdownContent(post.content)}

          {/* Tags Footer */}
          {post.tags && post.tags.length > 0 && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              paddingTop: '1.5rem',
              marginTop: '2rem',
              borderTop: `2px solid ${currentTheme.border}`
            }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '900', color: currentTheme.heading, marginRight: '4px' }}>
                TAGS:
              </span>
              {post.tags.map((t, idx) => (
                <span key={idx} style={{
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  padding: '3px 10px',
                  backgroundColor: '#EFF6FF',
                  color: '#2563EB',
                  border: '1.5px solid #2563EB',
                  borderRadius: '9999px'
                }}>
                  #{typeof t === 'string' ? t : t.name}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Engagement & Multi-Channel Sharing Card */}
        <div style={{
          backgroundColor: '#FFFDF5',
          border: '3px solid #111827',
          borderRadius: '18px',
          boxShadow: '5px 5px 0px 0px #111827',
          padding: '1.25rem',
          marginBottom: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => onLike(post.id)}
                className={`btn ${isLiked ? 'btn-yellow' : 'btn-outline'}`}
                style={{ padding: '6px 14px', fontSize: '0.825rem' }}
              >
                <Heart size={16} fill={isLiked ? '#DC2626' : 'none'} color={isLiked ? '#DC2626' : '#111827'} />
                {post.likes_count || 0} Suka
              </button>

              <button
                onClick={() => onBookmark(post.id)}
                className={`btn ${isBookmarked ? 'btn-yellow' : 'btn-outline'}`}
                style={{ padding: '6px 14px', fontSize: '0.825rem' }}
              >
                <Bookmark size={16} fill={isBookmarked ? '#111827' : 'none'} />
                {isBookmarked ? 'Tersimpan' : 'Bookmark'}
              </button>
            </div>

            <button
              onClick={handleShare}
              className="btn btn-yellow"
              style={{ padding: '6px 16px', fontSize: '0.825rem' }}
            >
              <Share2 size={16} /> {copiedToast ? 'Tautan Disalin!' : 'Bagikan Artikel'}
            </button>
          </div>

          {/* Social Share Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingTop: '8px', borderTop: '1px dashed #E5E7EB' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#111827' }}>BAGIKAN KE:</span>
            
            <a
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{
                backgroundColor: '#25D366',
                color: '#FFFFFF',
                border: '1.5px solid #111827',
                padding: '4px 10px',
                fontSize: '0.725rem',
                textDecoration: 'none'
              }}
            >
              WhatsApp
            </a>

            <a
              href={socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{
                backgroundColor: '#000000',
                color: '#FFFFFF',
                border: '1.5px solid #111827',
                padding: '4px 10px',
                fontSize: '0.725rem',
                textDecoration: 'none'
              }}
            >
              Twitter / X
            </a>

            <a
              href={socialLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{
                backgroundColor: '#229ED9',
                color: '#FFFFFF',
                border: '1.5px solid #111827',
                padding: '4px 10px',
                fontSize: '0.725rem',
                textDecoration: 'none'
              }}
            >
              Telegram
            </a>
          </div>
        </div>

        {/* Comments Section */}
        <section style={{
          backgroundColor: currentTheme.surface,
          border: `3px solid ${currentTheme.border}`,
          borderRadius: '20px',
          boxShadow: `6px 6px 0px 0px ${currentTheme.border}`,
          padding: 'clamp(1.25rem, 4vw, 2rem)'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: currentTheme.heading, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={20} color="#2563EB" /> Diskusi & Tanggapan Pembaca ({post.comments?.length || 0})
          </h3>

          {currentUser ? (
            <form onSubmit={handleSendComment} style={{ marginBottom: '1.5rem' }}>
              <textarea
                rows={3}
                required
                placeholder="Tulis refleksi atau analisis tanggapan Anda mengenai artikel ini..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: `2px solid ${currentTheme.border}`,
                  fontSize: '0.875rem',
                  marginBottom: '8px',
                  outline: 'none',
                  resize: 'vertical',
                  backgroundColor: currentTheme.bg,
                  color: currentTheme.text
                }}
              />
              <button type="submit" className="btn btn-yellow" style={{ padding: '6px 16px', fontSize: '0.825rem' }}>
                <Send size={15} /> Kirim Tanggapan
              </button>
            </form>
          ) : (
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#EFF6FF',
              borderRadius: '10px',
              border: '1.5px solid #2563EB',
              marginBottom: '1.5rem',
              fontSize: '0.85rem'
            }}>
              💡 Silakan <strong>masuk ke akun</strong> untuk ikut berdiskusi dan memberikan tanggapan ilmiah.
            </div>
          )}

          {/* Comments List */}
          {post.comments && post.comments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {post.comments.map(c => (
                <div key={c.id} style={{
                  backgroundColor: currentTheme.bg,
                  border: `2px solid ${currentTheme.border}`,
                  borderRadius: '12px',
                  padding: '12px 14px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ fontWeight: '800', fontSize: '0.85rem', color: currentTheme.heading }}>
                      {c.author_name || c.user_name || 'Kawan Pneumadina'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: currentTheme.muted }}>
                      {new Date(c.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: currentTheme.text, lineHeight: '1.5' }}>
                    {c.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: currentTheme.muted, fontSize: '0.85rem' }}>
              Belum ada tanggapan. Jadilah yang pertama memberikan refleksi kritis pada karya ini!
            </div>
          )}
        </section>

      </main>

    </div>
  );
}
