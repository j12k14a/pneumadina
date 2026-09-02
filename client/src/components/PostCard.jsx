import React, { useState } from 'react';
import { Heart, Bookmark, Eye, Clock, MessageSquare, ArrowUpRight, Share2, Check, Edit2, Trash2 } from 'lucide-react';
import { getArticleUrl, shareContent } from '../utils/urlHelper';

export default function PostCard({ 
  post, 
  onSelectPost, 
  onLike, 
  onBookmark, 
  isLiked, 
  isBookmarked, 
  currentUser,
  showToast,
  onEdit,
  onDelete
}) {
  const [copied, setCopied] = useState(false);
  const readTimeMinutes = Math.max(2, Math.ceil((post.content?.length || 500) / 400));

  const isPostAuthorOrAdmin = currentUser && (
    currentUser.role_id === 1 ||
    currentUser.id === post.user_id ||
    (currentUser.username && post.author_username && currentUser.username.toLowerCase() === post.author_username.toLowerCase()) ||
    (currentUser.full_name && post.author_name && currentUser.full_name.toLowerCase() === post.author_name.toLowerCase()) ||
    (currentUser.email && post.author_email && currentUser.email.toLowerCase() === post.author_email.toLowerCase())
  );

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
        if (showToast) showToast('🔗 Tautan artikel berhasil disalin!');
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  return (
    <article
      onClick={() => onSelectPost(post)}
      style={{
        backgroundColor: '#FFFFFF',
        border: '3px solid #111827',
        borderRadius: '18px',
        boxShadow: '4px 4px 0px 0px #111827',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        height: '100%',
        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), boxShadow 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '8px 8px 0px 0px #111827';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '4px 4px 0px 0px #111827';
      }}
    >
      <div>
        
        {/* Cover Photo / Thumbnail */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '190px',
          overflow: 'hidden',
          backgroundColor: '#111827',
          borderBottom: '3px solid #111827'
        }}>
          <img 
            src={post.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'} 
            alt={post.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease'
            }}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80';
            }}
          />

          {/* Floating Category Pills over Cover */}
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
            zIndex: 2
          }}>
            {post.categories?.map(c => (
              <span key={c.id} className="badge badge-yellow" style={{ boxShadow: '2px 2px 0px 0px #111827', fontSize: '0.675rem' }}>
                {c.name}
              </span>
            ))}
          </div>

          {/* Author/Admin Edit Quick Badge on Card Top Right */}
          {isPostAuthorOrAdmin && onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(post);
              }}
              className="btn btn-yellow"
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                padding: '3px 8px',
                fontSize: '0.7rem',
                fontWeight: '900',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                zIndex: 3,
                boxShadow: '2px 2px 0px 0px #111827'
              }}
              title="Edit Artikel Ini di Studio"
            >
              <Edit2 size={12} /> Edit
            </button>
          )}

          <div style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            backgroundColor: '#111827',
            color: '#FFD600',
            fontSize: '0.7rem',
            fontWeight: '800',
            padding: '2px 7px',
            borderRadius: '6px',
            border: '1px solid #FFD600',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Clock size={12} /> {readTimeMinutes} mnt
          </div>
        </div>

        {/* Card Main Body */}
        <div style={{ padding: '1.15rem' }}>
          
          {/* Author Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: '#FFD600',
              border: '1.5px solid #111827',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900',
              fontSize: '0.8rem',
              color: '#111827',
              boxShadow: '1.5px 1.5px 0px 0px #111827'
            }}>
              {post.author_name?.charAt(0) || 'D'}
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '900', color: '#111827' }}>
                {post.author_name}
              </div>
              <div style={{ fontSize: '0.675rem', color: '#6B7280' }}>
                {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-serif" style={{
            fontSize: '1.15rem',
            fontWeight: '900',
            color: '#111827',
            lineHeight: '1.3',
            marginBottom: '8px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {post.title}
          </h3>

          {/* Excerpt */}
          <p style={{
            fontSize: '0.825rem',
            color: '#4B5563',
            lineHeight: '1.5',
            marginBottom: '10px',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {post.content}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
              {post.tags.slice(0, 3).map(t => (
                <span key={t.id} style={{
                  fontSize: '0.65rem',
                  fontWeight: '800',
                  padding: '2px 7px',
                  backgroundColor: '#FAF8F5',
                  color: '#2563EB',
                  border: '1px solid #2563EB',
                  borderRadius: '9999px'
                }}>
                  #{t.name}
                </span>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Card Actions Footer Bar */}
      <div style={{
        padding: '8px 1.15rem',
        backgroundColor: '#FAF8F5',
        borderTop: '2px solid #111827',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            title="Suka Artikel"
            onClick={(e) => { e.stopPropagation(); onLike(post.id); }}
            className={`btn ${isLiked ? 'btn-yellow' : 'btn-outline'}`}
            style={{ padding: '3px 8px', fontSize: '0.75rem' }}
          >
            <Heart size={13} fill={isLiked ? '#DC2626' : 'none'} color={isLiked ? '#DC2626' : '#111827'} />
            {post.likes_count || 0}
          </button>

          <button
            type="button"
            title="Simpan Bookmark"
            onClick={(e) => { e.stopPropagation(); onBookmark(post.id); }}
            className={`btn ${isBookmarked ? 'btn-yellow' : 'btn-outline'}`}
            style={{ padding: '3px 8px', fontSize: '0.75rem' }}
          >
            <Bookmark size={13} fill={isBookmarked ? '#111827' : 'none'} />
          </button>

          <button
            type="button"
            title="Bagikan Tautan Artikel"
            onClick={handleQuickShare}
            className={`btn ${copied ? 'btn-yellow' : 'btn-outline'}`}
            style={{ padding: '3px 8px', fontSize: '0.75rem' }}
          >
            {copied ? <Check size={13} /> : <Share2 size={13} />}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {isPostAuthorOrAdmin && onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(post);
              }}
              className="btn btn-yellow"
              style={{
                padding: '3px 8px',
                fontSize: '0.725rem',
                fontWeight: '800',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px'
              }}
              title="Edit Artikel"
            >
              <Edit2 size={12} /> Edit
            </button>
          )}

          {isPostAuthorOrAdmin && onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(post.id, post.title);
              }}
              className="btn btn-outline"
              style={{
                padding: '3px 6px',
                fontSize: '0.725rem',
                color: '#DC2626',
                borderColor: '#DC2626'
              }}
              title="Hapus Artikel"
            >
              <Trash2 size={12} />
            </button>
          )}

          <div style={{ fontSize: '0.775rem', fontWeight: '800', color: '#2563EB', display: 'flex', alignItems: 'center', gap: '2px' }}>
            Baca <ArrowUpRight size={15} />
          </div>
        </div>
      </div>

    </article>
  );
}
