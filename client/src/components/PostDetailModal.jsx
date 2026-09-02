import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Bookmark, 
  Share2, 
  MessageSquare, 
  Send, 
  Calendar, 
  User, 
  Tag, 
  Check, 
  Sparkles, 
  Copy, 
  ExternalLink,
  BookOpen,
  FileText,
  Edit2
} from 'lucide-react';
import { getArticleUrl, shareContent, getSocialShareLinks } from '../utils/urlHelper';
import ArticleContentRenderer from './ArticleContentRenderer';

export default function PostDetailModal({ 
  post, 
  onClose, 
  onLike, 
  onBookmark, 
  isLiked, 
  isBookmarked, 
  currentUser, 
  onAddComment,
  showToast,
  onOpenFullPage,
  onEditPost
}) {
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [copiedToast, setCopiedToast] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  if (!post) return null;

  const articleUrl = getArticleUrl(post);
  const isLongArticle = (post.content?.length || 0) > 2500;
  const readTimeMinutes = Math.max(2, Math.ceil((post.content?.length || 1000) / 450));

  const socialLinks = getSocialShareLinks({
    title: post.title,
    url: articleUrl,
    text: post.content?.substring(0, 140) + '...'
  });

  const handleShare = async () => {
    const res = await shareContent({
      title: post.title,
      text: `${post.title} — Baca di Blog Komunitas Pneumadina`,
      url: articleUrl
    });

    if (res.success) {
      if (res.method === 'clipboard') {
        setCopiedToast(true);
        if (showToast) showToast('🔗 Tautan spesifik artikel berhasil disalin!');
        setTimeout(() => setCopiedToast(false), 3000);
      }
    } else if (!res.aborted) {
      setShowShareMenu(true);
    }
  };

  const handleCopyDirectLink = async (e) => {
    e?.stopPropagation();
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopiedToast(true);
      if (showToast) showToast('🔗 Tautan artikel berhasil disalin ke clipboard!');
      setTimeout(() => setCopiedToast(false), 3000);
    } catch (err) {
      // Fallback
    }
  };

  const handleSendComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(post.id, commentText.trim());
    setCommentText('');
  };

  const handleSendReply = (parentId) => {
    if (!replyText.trim()) return;
    onAddComment(post.id, replyText.trim(), parentId);
    setReplyText('');
    setActiveReplyId(null);
  };

  return (
    <div className="animate-backdrop" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(17, 24, 39, 0.88)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 500,
      padding: '8px'
    }}>
      <div className="animate-popup-enter" style={{
        backgroundColor: '#FFFFFF',
        width: '100%',
        maxWidth: '860px',
        maxHeight: '94vh',
        borderRadius: '20px',
        border: '3.5px solid #111827',
        boxShadow: '8px 8px 0px 0px #111827',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        {/* Modal Header */}
        <div style={{
          padding: 'clamp(0.85rem, 3.5vw, 1.35rem)',
          backgroundColor: '#FFD600',
          borderBottom: '3px solid #111827',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '4px' }}>
              {post.categories?.map(c => (
                <span key={c.id} className="badge badge-dark" style={{ fontSize: '0.65rem' }}>
                  {c.name}
                </span>
              ))}
              {isLongArticle && (
                <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>
                  <FileText size={11} /> Paper Ilmiah ({readTimeMinutes} min)
                </span>
              )}
            </div>

            <h2 className="font-serif" style={{ fontSize: 'clamp(1.2rem, 4.5vw, 1.75rem)', fontWeight: '900', color: '#111827', lineHeight: 1.15 }}>
              {post.title}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px', fontSize: '0.75rem', color: '#111827', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: '800' }}>✍️ Penulis: {post.author_name}</span>
              <span>•</span>
              <span>📅 {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {onOpenFullPage && (
              <button
                onClick={() => {
                  onClose();
                  onOpenFullPage(post);
                }}
                className="btn btn-outline"
                style={{
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  backgroundColor: '#FFFFFF',
                  fontWeight: '900'
                }}
                title="Buka Halaman Khusus / Mode Baca Penuh"
              >
                <BookOpen size={13} /> <span className="hide-on-very-small">Halaman Khusus</span>
              </button>
            )}

            <button 
              onClick={onClose}
              style={{
                backgroundColor: '#FFFFFF',
                color: '#111827',
                border: '2px solid #111827',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
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
        </div>

        {/* Modal Scrollable Article Body */}
        <div style={{ padding: 'clamp(0.85rem, 3.5vw, 1.5rem)', overflowY: 'auto', flexGrow: 1 }}>
          
          {/* Long Article Banner Notification */}
          {isLongArticle && (
            <div style={{
              backgroundColor: '#EFF6FF',
              border: '2px solid #2563EB',
              borderRadius: '12px',
              padding: '10px 14px',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              flexWrap: 'wrap'
            }}>
              <div style={{ fontSize: '0.8rem', color: '#1E40AF', fontWeight: '700' }}>
                📑 Ini adalah artikel ilmiah panjang (~{readTimeMinutes} menit baca). Ingin pengalaman membaca dengan daftar isi, kontrol ukuran teks, dan mode fokus?
              </div>
              {onOpenFullPage && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenFullPage(post);
                  }}
                  className="btn btn-blue"
                  style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                >
                  <BookOpen size={13} /> Buka Halaman Baca Penuh
                </button>
              )}
            </div>
          )}

          {/* Author / Admin Edit Banner */}
          {currentUser && (
            currentUser.role_id === 1 || 
            currentUser.id === post.user_id || 
            (currentUser.username && post.author_username && currentUser.username.toLowerCase() === post.author_username.toLowerCase()) ||
            (currentUser.full_name && post.author_name && currentUser.full_name.toLowerCase() === post.author_name.toLowerCase())
          ) && onEditPost && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#FEF3C7',
              border: '2px solid #B45309',
              borderRadius: '12px',
              padding: '8px 14px',
              marginBottom: '1.25rem',
              gap: '10px',
              flexWrap: 'wrap'
            }}>
              <div style={{ fontSize: '0.8rem', color: '#92400E', fontWeight: '800' }}>
                ✏️ Anda adalah penulis artikel ini ({post.author_name || currentUser.full_name}). Ingin memperbarui naskah atau tabel?
              </div>
              <button
                onClick={() => {
                  onClose();
                  onEditPost(post);
                }}
                className="btn btn-yellow"
                style={{ padding: '4px 12px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <Edit2 size={13} /> Edit Artikel di Studio
              </button>
            </div>
          )}

          {/* Cover Photo / Thumbnail */}
          {post.thumbnail && (
            <div style={{
              marginBottom: '1.25rem',
              borderRadius: '14px',
              overflow: 'hidden',
              border: '2.5px solid #111827',
              maxHeight: '320px',
              backgroundColor: '#111827'
            }}>
              <img 
                src={post.thumbnail} 
                alt={post.title} 
                style={{ width: '100%', height: '100%', maxHeight: '320px', objectFit: 'cover' }}
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          )}

          {/* Canonical Direct Link Banner */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            backgroundColor: '#FFFDF5',
            border: '2px solid #111827',
            borderRadius: '10px',
            padding: '8px 12px',
            marginBottom: '1.25rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#4B5563', overflow: 'hidden' }}>
              <span style={{ fontWeight: '800', color: '#111827', flexShrink: 0 }}>🔗 Tautan Langsung:</span>
              <span style={{ 
                fontFamily: 'monospace', 
                fontSize: '0.725rem', 
                color: '#2563EB', 
                textOverflow: 'ellipsis', 
                overflow: 'hidden', 
                whiteSpace: 'nowrap',
                maxWidth: '280px' 
              }}>
                {articleUrl}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={handleCopyDirectLink}
                className="btn btn-outline"
                style={{ padding: '3px 8px', fontSize: '0.7rem', backgroundColor: '#FFFFFF' }}
                title="Salin Link Langsung"
              >
                {copiedToast ? <><Check size={12} /> Tersalin!</> : <><Copy size={12} /> Salin Link</>}
              </button>

              <button
                onClick={handleShare}
                className="btn btn-yellow"
                style={{ padding: '3px 10px', fontSize: '0.7rem' }}
                title="Bagikan ke WhatsApp/Sosmed"
              >
                <Share2 size={12} /> Bagikan
              </button>
            </div>
          </div>

          {/* Social Share Menu */}
          {showShareMenu && (
            <div className="animate-popup-enter" style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #111827',
              borderRadius: '12px',
              padding: '10px 14px',
              marginBottom: '1.25rem',
              boxShadow: '3px 3px 0px 0px #111827'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '800', marginBottom: '8px', color: '#111827' }}>
                KIRIM CEPAT KE MEDIA SOSIAL:
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
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
          )}

          {/* Article Text Content (Rich Typography & Structured References) */}
          <div style={{ marginBottom: '2rem' }}>
            <ArticleContentRenderer content={post.content} fontSize={16} theme="light" />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.5rem', paddingTop: '1rem', borderTop: '1.5px dashed #E5E7EB' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#6B7280', alignSelf: 'center', marginRight: '4px' }}>
                TAGS:
              </span>
              {post.tags.map(t => (
                <span key={t.id || t.name} style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  padding: '2px 8px',
                  backgroundColor: '#F3F4F6',
                  color: '#374151',
                  borderRadius: '6px',
                  border: '1px solid #D1D5DB'
                }}>
                  #{t.name}
                </span>
              ))}
            </div>
          )}

          {/* Action Row: Like, Bookmark, Share */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            backgroundColor: '#F9FAFB',
            borderRadius: '12px',
            border: '2px solid #111827',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => onLike(post.id)}
                className={`btn ${isLiked ? 'btn-yellow' : 'btn-outline'}`}
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                <Heart size={15} fill={isLiked ? '#DC2626' : 'none'} color={isLiked ? '#DC2626' : '#111827'} />
                {post.likes_count || 0} Suka
              </button>

              <button
                onClick={() => onBookmark(post.id)}
                className={`btn ${isBookmarked ? 'btn-yellow' : 'btn-outline'}`}
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                <Bookmark size={15} fill={isBookmarked ? '#111827' : 'none'} />
                {isBookmarked ? 'Tersimpan' : 'Simpan'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              {onOpenFullPage && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenFullPage(post);
                  }}
                  className="btn btn-outline"
                  style={{ padding: '6px 14px', fontSize: '0.8rem', backgroundColor: '#FFFFFF' }}
                >
                  <BookOpen size={14} /> Baca Lengkap
                </button>
              )}

              <button
                onClick={handleShare}
                className="btn btn-yellow"
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              >
                <Share2 size={14} /> {copiedToast ? 'Tersalin!' : 'Bagikan'}
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '900', color: '#111827', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={16} color="#2563EB" /> Tanggapan ({post.comments?.length || 0})
            </h3>

            {/* Input Comment */}
            {currentUser ? (
              <form onSubmit={handleSendComment} style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    required
                    placeholder="Tulis tanggapan / refleksi Anda..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: '2px solid #111827',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                  <button type="submit" className="btn btn-yellow" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                    <Send size={14} /> Kirim
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ padding: '8px 12px', backgroundColor: '#EFF6FF', borderRadius: '8px', border: '1.5px solid #2563EB', marginBottom: '1rem', fontSize: '0.8rem' }}>
                💡 Silakan masuk untuk ikut berdiskusi dan memberikan komentar.
              </div>
            )}

            {/* Comment List */}
            {post.comments && post.comments.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {post.comments.map(c => (
                  <div key={c.id} style={{
                    backgroundColor: '#F9FAFB',
                    border: '1.5px solid #E5E7EB',
                    borderRadius: '10px',
                    padding: '10px 12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '800', fontSize: '0.8rem', color: '#111827' }}>
                        {c.author_name || c.user_name || 'Pembaca'}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: '#6B7280' }}>
                        {new Date(c.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#374151', margin: 0 }}>
                      {c.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem', color: '#6B7280', fontSize: '0.8rem' }}>
                Belum ada tanggapan. Jadilah yang pertama berkomentar!
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
