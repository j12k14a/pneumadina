import React, { useState } from 'react';
import { Sparkles, Heart, Bookmark, ArrowRight, Clock, User, Eye, Share2, Check, Edit2 } from 'lucide-react';
import { getArticleUrl, shareContent } from '../utils/urlHelper';

export default function FeaturedPostCard({ 
  post, 
  onSelectPost, 
  onLike, 
  onBookmark, 
  isLiked, 
  isBookmarked,
  showToast,
  currentUser,
  onEdit
}) {
  const [copied, setCopied] = useState(false);
  if (!post) return null;

  const handleQuickShare = async (e) => {
    e.stopPropagation();
    const articleUrl = getArticleUrl(post);
    const res = await shareContent({
      title: post.title,
      text: `${post.title} — Baca di Blog Komunitas Pneumadina`,
      url: articleUrl
    });

    if (res.success) {
      if (res.method === 'clipboard') {
        setCopied(true);
        if (showToast) showToast('🔗 Tautan artikel utama berhasil disalin!');
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  return (
    <div 
      onClick={() => onSelectPost(post)}
      className="featured-post-card animate-card-pop"
      style={{
        backgroundColor: '#FFFFFF',
        border: '3.5px solid #111827',
        borderRadius: '24px',
        boxShadow: '6px 6px 0px 0px #111827',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        marginBottom: '2rem',
        minWidth: 0,
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '10px 10px 0px 0px #111827';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '6px 6px 0px 0px #111827';
      }}
    >
      {/* Featured Cover Image Banner */}
      <div style={{ position: 'relative', minHeight: '220px', maxHeight: '380px', overflow: 'hidden', backgroundColor: '#111827', minWidth: 0 }}>
        <img 
          src={post.thumbnail || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80'} 
          alt={post.title} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          className="featured-cover-img"
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          display: 'flex',
          gap: '6px',
          flexWrap: 'wrap',
          maxWidth: 'calc(100% - 24px)'
        }}>
          <span className="badge badge-yellow" style={{ boxShadow: '2px 2px 0px 0px #111827', fontSize: '0.7rem', padding: '4px 10px' }}>
            <Sparkles size={13} color="#111827" /> EDITOR'S PICK / UTAMA
          </span>
          {post.categories?.map(c => (
            <span key={c.id} className="badge badge-dark" style={{ fontSize: '0.7rem', padding: '4px 10px' }}>
              {c.name}
            </span>
          ))}
        </div>
      </div>

      {/* Featured Content Details */}
      <div style={{
        padding: 'clamp(1rem, 3.5vw, 2.25rem)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#FFFDF7',
        minWidth: 0,
        boxSizing: 'border-box'
      }}>
        <div>
          {/* Author Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#FFD600',
              border: '2px solid #111827',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900',
              fontSize: '0.9rem',
              color: '#111827',
              boxShadow: '2px 2px 0px 0px #111827',
              flexShrink: 0
            }}>
              {post.author_name?.charAt(0) || 'D'}
            </div>
            <div style={{ minWidth: 0, flexGrow: 1 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '900', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {post.author_name}
              </div>
              <div style={{ fontSize: '0.725rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span>📅 {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span>•</span>
                <span>📖 5 mnt baca</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="font-serif" style={{
            fontSize: 'clamp(1.2rem, 3.5vw, 1.85rem)',
            fontWeight: '900',
            color: '#111827',
            lineHeight: '1.2',
            letterSpacing: '-0.02em',
            marginBottom: '0.75rem',
            wordBreak: 'break-word',
            overflowWrap: 'break-word'
          }}>
            {post.title}
          </h2>

          {/* Excerpt */}
          <p style={{
            fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
            color: '#374151',
            lineHeight: '1.6',
            marginBottom: '1.25rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            wordBreak: 'break-word'
          }}>
            {post.content}
          </p>
        </div>

        {/* Footer Actions Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.85rem',
          borderTop: '2px solid #E5E7EB',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); onLike(post.id); }}
              className={`btn ${isLiked ? 'btn-yellow' : 'btn-outline'}`}
              style={{ padding: '5px 10px', fontSize: '0.775rem' }}
            >
              <Heart size={14} fill={isLiked ? '#DC2626' : 'none'} color={isLiked ? '#DC2626' : '#111827'} />
              {post.likes_count || 0}
            </button>

            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); onBookmark(post.id); }}
              className={`btn ${isBookmarked ? 'btn-yellow' : 'btn-outline'}`}
              style={{ padding: '5px 10px', fontSize: '0.775rem' }}
            >
              <Bookmark size={14} fill={isBookmarked ? '#111827' : 'none'} />
              {isBookmarked ? 'Saved' : 'Save'}
            </button>

            <button 
              type="button"
              title="Bagikan Tautan Artikel Utama"
              onClick={handleQuickShare}
              className={`btn ${copied ? 'btn-yellow' : 'btn-outline'}`}
              style={{ padding: '5px 10px', fontSize: '0.775rem' }}
            >
              {copied ? <Check size={14} /> : <Share2 size={14} />}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', minWidth: 0 }}>
            {currentUser && (
              currentUser.role_id === 1 ||
              currentUser.id === post.user_id ||
              (currentUser.username && post.author_username && currentUser.username.toLowerCase() === post.author_username.toLowerCase()) ||
              (currentUser.full_name && post.author_name && currentUser.full_name.toLowerCase() === post.author_name.toLowerCase()) ||
              (currentUser.email && post.author_email && currentUser.email.toLowerCase() === post.author_email.toLowerCase())
            ) && onEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(post);
                }}
                className="btn btn-yellow"
                style={{ padding: '5px 10px', fontSize: '0.775rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                title="Edit Artikel Utama"
              >
                <Edit2 size={13} /> Edit
              </button>
            )}

            <button 
              type="button"
              className="btn btn-dark"
              style={{ padding: '6px 14px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            >
              Baca Gagasan <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
