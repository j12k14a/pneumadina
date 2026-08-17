import React, { useState } from 'react';
import { X, Heart, Bookmark, Share2, MessageSquare, Send, Calendar, User, Tag, Check, Sparkles } from 'lucide-react';

export default function PostDetailModal({ post, onClose, onLike, onBookmark, isLiked, isBookmarked, currentUser, onAddComment }) {
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [copiedToast, setCopiedToast] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
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
      backgroundColor: 'rgba(17, 24, 39, 0.85)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 400,
      padding: '10px'
    }}>
      <div className="animate-popup-enter" style={{
        backgroundColor: '#FFFFFF',
        width: '100%',
        maxWidth: '860px',
        maxHeight: '94vh',
        borderRadius: '20px',
        border: '3px solid #111827',
        boxShadow: '6px 6px 0px 0px #111827',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        {/* Modal Header */}
        <div style={{
          padding: 'clamp(1rem, 4vw, 1.5rem)',
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
            </div>

            <h2 className="font-serif" style={{ fontSize: 'clamp(1.3rem, 5vw, 1.8rem)', fontWeight: '900', color: '#111827', lineHeight: 1.15 }}>
              {post.title}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', fontSize: '0.775rem', color: '#111827', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: '800' }}>✍️ Penulis: {post.author_name}</span>
              <span>•</span>
              <span>📅 {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

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
              fontWeight: '900',
              flexShrink: 0
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Article Body */}
        <div style={{ padding: 'clamp(1rem, 4vw, 1.75rem)', overflowY: 'auto', flexGrow: 1 }}>
          
          {/* Cover Photo / Thumbnail */}
          {post.thumbnail && (
            <div style={{
              marginBottom: '1.25rem',
              borderRadius: '14px',
              overflow: 'hidden',
              border: '2px solid #111827',
              maxHeight: '320px'
            }}>
              <img 
                src={post.thumbnail} 
                alt={post.title} 
                style={{ width: '100%', height: '100%', maxHeight: '320px', objectFit: 'cover' }}
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          )}

          {/* Article Text Content */}
          <div style={{
            fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)',
            lineHeight: '1.7',
            color: '#1F2937',
            whiteSpace: 'pre-line',
            marginBottom: '1.5rem'
          }}>
            {post.content}
          </div>

          {/* Article Tags */}
          {post.tags && post.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.5rem' }}>
              {post.tags.map(t => (
                <span key={t.id} style={{
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  padding: '3px 10px',
                  backgroundColor: '#EFF6FF',
                  color: '#2563EB',
                  border: '1.5px solid #2563EB',
                  borderRadius: '9999px'
                }}>
                  #{t.name}
                </span>
              ))}
            </div>
          )}

          {/* Engagement Buttons Bar (Like, Bookmark, Share) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px',
            backgroundColor: '#FFFDF5',
            border: '2px solid #111827',
            borderRadius: '12px',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
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
              className="btn btn-outline"
              style={{ padding: '6px 14px', fontSize: '0.825rem' }}
            >
              <Share2 size={16} /> {copiedToast ? 'Tautan Disalin!' : 'Bagikan'}
            </button>
          </div>

          {/* Comments Section */}
          <div style={{ borderTop: '2px solid #E5E7EB', paddingTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={18} color="#2563EB" /> Komentar Kawan ({post.comments?.length || 0})
            </h3>

            {/* Comment Form */}
            {currentUser ? (
              <form onSubmit={handleSendComment} style={{ marginBottom: '1.5rem' }}>
                <textarea 
                  rows={3}
                  required
                  placeholder="Tulis gagasan atau komentar tanggapan Anda..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '2px solid #111827',
                    fontSize: '0.875rem',
                    marginBottom: '8px',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
                <button type="submit" className="btn btn-yellow" style={{ padding: '6px 16px', fontSize: '0.825rem' }}>
                  <Send size={15} /> Kirim Komentar
                </button>
              </form>
            ) : (
              <div style={{ padding: '12px', backgroundColor: '#EFF6FF', borderRadius: '8px', border: '1.5px solid #2563EB', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                💡 Silakan <strong>masuk ke akun</strong> untuk menulis komentar tanggapan.
              </div>
            )}

            {/* Comments List */}
            {post.comments && post.comments.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {post.comments.map(c => (
                  <div key={c.id} style={{
                    backgroundColor: '#FAF8F5',
                    border: '1.5px solid #111827',
                    borderRadius: '10px',
                    padding: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ fontWeight: '800', fontSize: '0.85rem', color: '#111827' }}>
                        {c.user_name || 'Kawan Pneumadina'}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: '#6B7280' }}>
                        {new Date(c.created_at).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: '1.5' }}>
                      {c.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: '#6B7280', italic: 'true' }}>Belum ada komentar. Jadilah kawan pertama yang menanggapi!</p>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
