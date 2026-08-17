import React from 'react';
import { Heart, Bookmark, Eye, Clock, MessageSquare, ArrowUpRight } from 'lucide-react';

export default function PostCard({ post, onSelectPost, onLike, onBookmark, isLiked, isBookmarked, currentUser }) {
  const readTimeMinutes = Math.max(2, Math.ceil((post.content?.length || 500) / 400));

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
          height: '200px',
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
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80';
            }}
          />

          {/* Floating Category Pills over Cover */}
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
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

          <div style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            backgroundColor: '#111827',
            color: '#FFD600',
            fontSize: '0.7rem',
            fontWeight: '800',
            padding: '3px 8px',
            borderRadius: '6px',
            border: '1px solid #FFD600',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Clock size={12} /> {readTimeMinutes} mnt baca
          </div>
        </div>

        {/* Card Main Body */}
        <div style={{ padding: '1.25rem' }}>
          
          {/* Author Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#FFD600',
              border: '1.5px solid #111827',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900',
              fontSize: '0.85rem',
              color: '#111827',
              boxShadow: '1.5px 1.5px 0px 0px #111827'
            }}>
              {post.author_name?.charAt(0) || 'D'}
            </div>
            <div>
              <div style={{ fontSize: '0.825rem', fontWeight: '900', color: '#111827' }}>
                {post.author_name}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>
                {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-serif" style={{
            fontSize: '1.2rem',
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
            fontSize: '0.85rem',
            color: '#4B5563',
            lineHeight: '1.55',
            marginBottom: '12px',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {post.content}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
              {post.tags.slice(0, 3).map(t => (
                <span key={t.id} style={{
                  fontSize: '0.675rem',
                  fontWeight: '800',
                  padding: '2px 8px',
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
        padding: '10px 1.25rem',
        backgroundColor: '#FAF8F5',
        borderTop: '2px solid #111827',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onLike(post.id); }}
            className={`btn ${isLiked ? 'btn-yellow' : 'btn-outline'}`}
            style={{ padding: '4px 10px', fontSize: '0.775rem' }}
          >
            <Heart size={14} fill={isLiked ? '#DC2626' : 'none'} color={isLiked ? '#DC2626' : '#111827'} />
            {post.likes_count || 0}
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onBookmark(post.id); }}
            className={`btn ${isBookmarked ? 'btn-yellow' : 'btn-outline'}`}
            style={{ padding: '4px 10px', fontSize: '0.775rem' }}
          >
            <Bookmark size={14} fill={isBookmarked ? '#111827' : 'none'} />
          </button>
        </div>

        <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#2563EB', display: 'flex', alignItems: 'center', gap: '2px' }}>
          Baca <ArrowUpRight size={16} />
        </div>
      </div>

    </article>
  );
}
