import React, { useState } from 'react';
import { X, Bookmark, FileText, User, Heart, ShieldCheck, Mail } from 'lucide-react';
import PostCard from './PostCard';

export default function UserProfileModal({ user, onClose, allPosts, bookmarkedIds, likedIds, onLike, onBookmark, onSelectPost, currentUser }) {
  const [activeTab, setActiveTab] = useState('bookmarks'); // 'bookmarks' | 'authored'

  // Filter bookmarked posts
  const bookmarkedPosts = allPosts.filter(p => bookmarkedIds.includes(p.id));
  const authoredPosts = allPosts.filter(p => p.user_id === user?.id);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(17, 24, 39, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 300,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        width: '100%',
        maxWidth: '820px',
        maxHeight: '90vh',
        borderRadius: '20px',
        border: '3px solid #111827',
        boxShadow: '8px 8px 0px 0px #111827',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        {/* Yellow Header */}
        <div style={{
          backgroundColor: '#FFD600',
          padding: '24px',
          borderBottom: '2px solid #111827',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '3px solid #111827',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900',
              fontSize: '1.6rem',
              color: '#111827',
              boxShadow: '2px 2px 0px 0px #111827'
            }}>
              {user?.full_name?.charAt(0) || 'U'}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#111827' }}>
                  {user?.full_name}
                </h2>
                <span className="badge badge-dark">{user?.role_name || 'Member'}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#1F2937', fontWeight: '600', marginTop: '2px' }}>
                @{user?.username} • {user?.email}
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #111827',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontWeight: '900'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Bio Banner */}
        <div style={{ padding: '16px 24px', backgroundColor: '#FFFDF7', borderBottom: '1.5px solid #E5E7EB', fontSize: '0.9rem', color: '#4B5563' }}>
          💬 <em>"{user?.bio || 'Anggota aktif di komunitas Pneumadina.'}"</em>
        </div>

        {/* Tabs Bar */}
        <div style={{ display: 'flex', borderBottom: '2px solid #111827', backgroundColor: '#FAF8F5' }}>
          <button 
            onClick={() => setActiveTab('bookmarks')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderBottom: activeTab === 'bookmarks' ? '3px solid #2563EB' : 'none',
              backgroundColor: activeTab === 'bookmarks' ? '#FFFFFF' : 'transparent',
              fontWeight: '800',
              color: activeTab === 'bookmarks' ? '#2563EB' : '#6B7280',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Bookmark size={18} /> Artikel Tersimpan ({bookmarkedPosts.length})
          </button>

          <button 
            onClick={() => setActiveTab('authored')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderBottom: activeTab === 'authored' ? '3px solid #2563EB' : 'none',
              backgroundColor: activeTab === 'authored' ? '#FFFFFF' : 'transparent',
              fontWeight: '800',
              color: activeTab === 'authored' ? '#2563EB' : '#6B7280',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <FileText size={18} /> Artikel Dibuat ({authoredPosts.length})
          </button>
        </div>

        {/* Content View */}
        <div style={{ padding: '24px', overflowY: 'auto', flexGrow: 1 }}>
          
          {activeTab === 'bookmarks' && (
            bookmarkedPosts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                <Bookmark size={40} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                <p style={{ fontWeight: '700' }}>Belum ada artikel tersimpan di Bookmark.</p>
                <p style={{ fontSize: '0.85rem' }}>Klik ikon pita Bookmark pada artikel mana saja untuk menyimpannya di sini.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '16px' }}>
                {bookmarkedPosts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onSelectPost={onSelectPost}
                    onLike={onLike}
                    onBookmark={onBookmark}
                    isLiked={likedIds.includes(post.id)}
                    isBookmarked={true}
                    currentUser={currentUser}
                  />
                ))}
              </div>
            )
          )}

          {activeTab === 'authored' && (
            authoredPosts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                <FileText size={40} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                <p style={{ fontWeight: '700' }}>Belum ada artikel yang ditulis.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '16px' }}>
                {authoredPosts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onSelectPost={onSelectPost}
                    onLike={onLike}
                    onBookmark={onBookmark}
                    isLiked={likedIds.includes(post.id)}
                    isBookmarked={bookmarkedIds.includes(post.id)}
                    currentUser={currentUser}
                  />
                ))}
              </div>
            )
          )}

        </div>

      </div>
    </div>
  );
}
