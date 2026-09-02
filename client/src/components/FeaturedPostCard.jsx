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
      className="animate-card-pop"
      style={{
        backgroundColor: '#FFFFFF',
        border: '3.5px solid #111827',
        borderRadius: '24px',
        boxShadow: '8px 8px 0px 0px #111827',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        marginBottom: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '0'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '12px 12px 0px 0px #111827';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '8px 8px 0px 0px #111827';
      }}
    >
      {/* Featured Cover Image Banner */}
      <div style={{ position: 'relative', minHeight: '260px', maxHeight: '380px', overflow: 'hidden', backgroundColor: '#111827' }}>
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
          top: '16px',
          left: '16px',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          <span className="badge badge-yellow" style={{ boxShadow: '2px 2px 0px 0px #111827', fontSize: '0.75rem', padding: '6px 12px' }}>
            <Sparkles size={14} color="#111827" /> EDITOR'S PICK / UTAMA
          </span>
          {post.categories?.map(c => (
            <span key={c.id} className="badge badge-dark" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
              {c.name}
            </span>
          ))}
        </div>
      </div>

      {/* Featured Content Details */}
      <div style={{
        padding: 'clamp(1.25rem, 3.5vw, 2.25rem)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#FFFDF7'
      }}>
        <div>
          {/* Author Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#FFD600',
              border: '2px solid #111827',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900',
              fontSize: '0.95rem',
              color: '#111827',
              boxShadow: '2px 2px 0px 0px #111827'
            }}>
              {post.author_name?.charAt(0) || 'D'}
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '900', color: '#111827' }}>
                {post.author_name}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📅 {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span>•</span>
                <span>📖 5 mnt baca</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="font-serif" style={{
            fontSize: 'clamp(1.3rem, 3.5vw, 2rem)',
            fontWeight: '900',
            color: '#111827',
            lineHeight: '1.2',
            letterSpacing: '-0.02em',
            marginBottom: '1rem'
          }}>
            {post.title}
          </h2>

          {/* Excerpt */}
          <p style={{
            fontSize: 'clamp(0.875rem, 2vw, 1rem)',
            color: '#374151',
            lineHeight: '1.65',
            marginBottom: '1.5rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {post.content}
          </p>
        </div>

        {/* Footer Actions Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '1rem',
          borderTop: '2px solid #E5E7EB',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); onLike(post.id); }}
              className={`btn ${isLiked ? 'btn-yellow' : 'btn-outline'}`}
              style={{ padding: '6px 12px', fontSize: '0.825rem' }}
            >
              <Heart size={15} fill={isLiked ? '#DC2626' : 'none'} color={isLiked ? '#DC2626' : '#111827'} />
              {post.likes_count || 0}
            </button>

            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); onBookmark(post.id); }}
              className={`btn ${isBookmarked ? 'btn-yellow' : 'btn-outline'}`}
              style={{ padding: '6px 12px', fontSize: '0.825rem' }}
            >
              <Bookmark size={15} fill={isBookmarked ? '#111827' : 'none'} />
              {isBookmarked ? 'Saved' : 'Save'}
            </button>

            <button 
              type="button"
              title="Bagikan Tautan Artikel Utama"
              onClick={handleQuickShare}
              className={`btn ${copied ? 'btn-yellow' : 'btn-outline'}`}
              style={{ padding: '6px 12px', fontSize: '0.825rem' }}
            >
              {copied ? <Check size={15} /> : <Share2 size={15} />}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
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
                style={{ padding: '6px 12px', fontSize: '0.825rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                title="Edit Artikel Utama"
              >
                <Edit2 size={14} /> Edit
              </button>
            )}

            <button 
              type="button"
              className="btn btn-dark"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              Baca Gagasan Selengkapnya <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
