import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, PenSquare, Users, FileText, Bookmark, Heart, Send, CheckCircle, Trash2, Check, XCircle, Clock, ExternalLink, Eye, Image as ImageIcon } from 'lucide-react';
import PostCard from './PostCard';

export default function RoleDashboardModal({ currentUser, onClose, allPosts, users, categories, tags, onRefreshData, onOpenStudio, onOpenTerimaPublikasi, onSelectPost, onLike, onBookmark, likedIds, bookmarkedIds }) {
  const [activeTab, setActiveTab] = useState(currentUser?.role_id === 1 ? 'submissions' : currentUser?.role_id === 2 ? 'my-posts' : 'bookmarks');
  const [submissionList, setSubmissionList] = useState([]);
  const [selectedSubForReview, setSelectedSubForReview] = useState(null);
  
  // Selection states for Approval
  const [assignedAuthorId, setAssignedAuthorId] = useState(2); // Default Diandra
  const [assignedCategoryId, setAssignedCategoryId] = useState(1); // Default Pluralisme

  const [msg, setMsg] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);

  // Filter Authors from Users List
  const authorsList = users.filter(u => u.role_id === 2);

  // Fetch Submissions if Admin
  useEffect(() => {
    fetchSubmissions();
  }, [currentUser]);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/submissions');
      const data = await res.json();
      if (data.success) setSubmissionList(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Admin Approve Submission with selected Author
  const handleApproveSubmission = async (subId) => {
    setLoadingAction(true);
    try {
      const res = await fetch(`/api/submissions/${subId}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_id: assignedAuthorId,
          category_id: assignedCategoryId,
          thumbnail: selectedSubForReview?.image || ''
        })
      });
      const data = await res.json();
      if (data.success) {
        setMsg('🎉 Submisi disetujui & otomatis diterbitkan ke Blog!');
        setSelectedSubForReview(null);
        fetchSubmissions();
        if (onRefreshData) onRefreshData();
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(false);
    }
  };

  // Admin Reject Submission
  const handleRejectSubmission = async (subId) => {
    setLoadingAction(true);
    try {
      const res = await fetch(`/api/submissions/${subId}/reject`, {
        method: 'PUT'
      });
      const data = await res.json();
      if (data.success) {
        setMsg('Submisi ditolak.');
        setSelectedSubForReview(null);
        fetchSubmissions();
        setTimeout(() => setMsg(''), 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(false);
    }
  };

  // Admin Change Role Handler
  const handleChangeRole = async (userId, newRoleId) => {
    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role_id: newRoleId })
      });
      const data = await res.json();
      if (data.success) {
        setMsg('Peran pengguna berhasil diperbarui!');
        if (onRefreshData) onRefreshData();
        setTimeout(() => setMsg(''), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin Delete Post Handler
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus artikel ini?')) return;
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMsg('Artikel berhasil dihapus!');
        if (onRefreshData) onRefreshData();
        setTimeout(() => setMsg(''), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isRoleAdmin = currentUser?.role_id === 1;
  const isRoleAuthor = currentUser?.role_id === 2;
  const isRoleMember = currentUser?.role_id === 3;

  const myAuthoredPosts = allPosts.filter(p => p.user_id === currentUser?.id);
  const myBookmarkedPosts = allPosts.filter(p => bookmarkedIds.includes(p.id));
  const myLikedPosts = allPosts.filter(p => likedIds.includes(p.id));

  return (
    <div className="animate-backdrop" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(17, 24, 39, 0.8)',
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
        maxWidth: '960px',
        maxHeight: '94vh',
        borderRadius: '20px',
        border: '3px solid #111827',
        boxShadow: '6px 6px 0px 0px #111827',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        {/* Responsive Dashboard Header */}
        <div style={{
          padding: 'clamp(1rem, 4vw, 1.5rem)',
          backgroundColor: isRoleAdmin ? '#111827' : isRoleAuthor ? '#FFD600' : '#2563EB',
          color: isRoleAdmin || isRoleMember ? '#FFFFFF' : '#111827',
          borderBottom: '3px solid #111827',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '2px solid #111827',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900',
              fontSize: '1.2rem',
              color: '#111827',
              flexShrink: 0
            }}>
              {currentUser?.full_name?.charAt(0) || 'U'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <h2 className="font-serif" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', fontWeight: '900' }}>
                  Dashboard {currentUser?.role_name || 'User'}
                </h2>
                <span className={`badge ${isRoleAdmin ? 'badge-yellow' : isRoleAuthor ? 'badge-dark' : 'badge-yellow'}`} style={{ fontSize: '0.65rem' }}>
                  Role: {currentUser?.role_name}
                </span>
              </div>
              <p style={{ fontSize: '0.775rem', opacity: 0.9, marginTop: '2px' }}>
                {currentUser?.full_name} ({currentUser?.username})
              </p>
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

        {msg && (
          <div style={{ backgroundColor: '#D1FAE5', borderBottom: '1px solid #059669', color: '#065F46', padding: '10px 16px', fontWeight: '800', fontSize: '0.85rem' }}>
            ✓ {msg}
          </div>
        )}

        {/* Scrollable Horizontal Navigation Tabs Bar */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '2px solid #111827', 
          backgroundColor: '#FAF8F5', 
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          whiteSpace: 'nowrap',
          padding: '4px 8px'
        }}>
          
          {/* Admin Role Tabs */}
          {isRoleAdmin && (
            <>
              <button 
                onClick={() => setActiveTab('submissions')}
                style={{
                  padding: '10px 16px',
                  border: 'none',
                  borderBottom: activeTab === 'submissions' ? '3px solid #FFD600' : 'none',
                  backgroundColor: activeTab === 'submissions' ? '#FFFFFF' : 'transparent',
                  fontWeight: '800',
                  color: '#111827',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.825rem',
                  borderRadius: '6px'
                }}
              >
                <Send size={15} color="#2563EB" /> Review Antrean ({submissionList.filter(s => s.status === 'pending').length})
              </button>

              <button 
                onClick={() => setActiveTab('users')}
                style={{
                  padding: '10px 16px',
                  border: 'none',
                  borderBottom: activeTab === 'users' ? '3px solid #FFD600' : 'none',
                  backgroundColor: activeTab === 'users' ? '#FFFFFF' : 'transparent',
                  fontWeight: '800',
                  color: '#111827',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.825rem',
                  borderRadius: '6px'
                }}
              >
                <Users size={15} color="#2563EB" /> Kelola Pengguna ({users.length})
              </button>

              <button 
                onClick={() => setActiveTab('all-posts')}
                style={{
                  padding: '10px 16px',
                  border: 'none',
                  borderBottom: activeTab === 'all-posts' ? '3px solid #FFD600' : 'none',
                  backgroundColor: activeTab === 'all-posts' ? '#FFFFFF' : 'transparent',
                  fontWeight: '800',
                  color: '#111827',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.825rem',
                  borderRadius: '6px'
                }}
              >
                <FileText size={15} color="#2563EB" /> Moderasi / Pengumuman ({allPosts.length})
              </button>
            </>
          )}

          {/* Author Role Tabs */}
          {isRoleAuthor && (
            <>
              <button 
                onClick={() => setActiveTab('my-posts')}
                style={{
                  padding: '10px 16px',
                  border: 'none',
                  borderBottom: activeTab === 'my-posts' ? '3px solid #FFD600' : 'none',
                  backgroundColor: activeTab === 'my-posts' ? '#FFFFFF' : 'transparent',
                  fontWeight: '800',
                  color: '#111827',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.825rem',
                  borderRadius: '6px'
                }}
              >
                <FileText size={15} color="#2563EB" /> Artikel Karya Saya ({myAuthoredPosts.length})
              </button>

              <button 
                onClick={() => { onClose(); onOpenStudio(); }}
                style={{
                  padding: '10px 16px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  fontWeight: '800',
                  color: '#2563EB',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.825rem'
                }}
              >
                <PenSquare size={15} /> + Tulis Artikel Baru
              </button>
            </>
          )}

          {/* Member Role Actions */}
          {isRoleMember && (
            <button 
              onClick={() => { onClose(); onOpenTerimaPublikasi(); }}
              style={{
                padding: '10px 16px',
                border: 'none',
                backgroundColor: 'transparent',
                fontWeight: '800',
                color: '#2563EB',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.825rem'
              }}
            >
              <Send size={15} /> Kirim Karya ke Author
            </button>
          )}

          {/* Bookmark & Liked Tabs */}
          <button 
            onClick={() => setActiveTab('bookmarks')}
            style={{
              padding: '10px 16px',
              border: 'none',
              borderBottom: activeTab === 'bookmarks' ? '3px solid #FFD600' : 'none',
              backgroundColor: activeTab === 'bookmarks' ? '#FFFFFF' : 'transparent',
              fontWeight: '800',
              color: '#111827',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.825rem',
              borderRadius: '6px'
            }}
          >
            <Bookmark size={15} color="#2563EB" /> Bookmark ({myBookmarkedPosts.length})
          </button>

          <button 
            onClick={() => setActiveTab('liked')}
            style={{
              padding: '10px 16px',
              border: 'none',
              borderBottom: activeTab === 'liked' ? '3px solid #FFD600' : 'none',
              backgroundColor: activeTab === 'liked' ? '#FFFFFF' : 'transparent',
              fontWeight: '800',
              color: '#111827',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.825rem',
              borderRadius: '6px'
            }}
          >
            <Heart size={15} color="#DC2626" /> Disukai ({myLikedPosts.length})
          </button>

        </div>

        {/* Dashboard Body */}
        <div style={{ padding: 'clamp(1rem, 3.5vw, 1.5rem)', overflowY: 'auto', flexGrow: 1 }}>
          
          {/* TAB: Admin Submissions Approval Queue */}
          {activeTab === 'submissions' && isRoleAdmin && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '14px' }}>
                Review & Persetujuan Antrean Publikasi Masuk
              </h3>
              
              {submissionList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#6B7280', fontSize: '0.9rem' }}>
                  Belum ada berkas publikasi masuk.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {submissionList.map(sub => (
                    <div key={sub.id} style={{
                      backgroundColor: sub.status === 'approved' ? '#ECFDF5' : sub.status === 'rejected' ? '#FEF2F2' : '#FFFDF7',
                      border: '2px solid #111827',
                      borderRadius: '14px',
                      padding: '16px',
                      boxShadow: '3px 3px 0px 0px #111827'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' }}>
                            <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>{sub.type}</span>
                            <span className={`badge ${sub.status === 'approved' ? 'badge-yellow' : sub.status === 'rejected' ? 'badge-dark' : 'badge-yellow'}`} style={{ fontSize: '0.65rem' }}>
                              {sub.status === 'approved' ? '✓ TERBIT' : sub.status === 'rejected' ? '✕ DITOLAK' : 'PENDING REVIEW'}
                            </span>
                          </div>
                          
                          <h4 style={{ fontSize: '1.05rem', fontWeight: '900', color: '#111827' }}>{sub.title}</h4>
                          <div style={{ fontSize: '0.8rem', color: '#4B5563', marginTop: '4px' }}>
                            Pengirim: <strong>{sub.name}</strong> (✉️ {sub.email})
                          </div>
                        </div>

                        {/* Action Buttons for Admin Review */}
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <button 
                            onClick={() => setSelectedSubForReview(sub)}
                            className="btn btn-outline"
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          >
                            <Eye size={15} /> Review Detail
                          </button>

                          {sub.status === 'pending' && (
                            <button 
                              onClick={() => setSelectedSubForReview(sub)}
                              className="btn btn-yellow"
                              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                            >
                              <Check size={15} /> Setujui & Terbitkan
                            </button>
                          )}
                        </div>
                      </div>

                      {sub.summary && (
                        <div style={{
                          marginTop: '10px',
                          padding: '10px',
                          backgroundColor: '#FFFFFF',
                          borderRadius: '8px',
                          border: '1px solid #E5E7EB',
                          fontSize: '0.85rem',
                          color: '#374151'
                        }}>
                          <strong>Abstrak / Ringkasan:</strong> {sub.summary}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: Admin Manage Users (Mobile Scrollable Table) */}
          {activeTab === 'users' && isRoleAdmin && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '14px' }}>
                Daftar Pengguna Website & Pengaturan Peran
              </h3>
              
              {/* Responsive Horizontal Scroll Table Wrapper */}
              <div style={{ border: '2px solid #111827', borderRadius: '12px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead style={{ backgroundColor: '#FFD600', borderBottom: '2px solid #111827', fontWeight: '800' }}>
                    <tr>
                      <th style={{ padding: '10px' }}>ID</th>
                      <th style={{ padding: '10px' }}>Pengguna</th>
                      <th style={{ padding: '10px' }}>Email</th>
                      <th style={{ padding: '10px' }}>Artikel</th>
                      <th style={{ padding: '10px' }}>Peran Saat Ini</th>
                      <th style={{ padding: '10px' }}>Ubah Peran</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: u.id === currentUser.id ? '#FFFDF5' : '#FFFFFF' }}>
                        <td style={{ padding: '10px', fontWeight: '800' }}>#{u.id}</td>
                        <td style={{ padding: '10px' }}>
                          <div style={{ fontWeight: '800' }}>{u.full_name}</div>
                          <div style={{ fontSize: '0.725rem', color: '#6B7280' }}>@{u.username}</div>
                        </td>
                        <td style={{ padding: '10px' }}>✉️ {u.email}</td>
                        <td style={{ padding: '10px', fontWeight: '700' }}>{u.posts_count || 0}</td>
                        <td style={{ padding: '10px' }}>
                          <span className={`badge ${u.role_id === 1 ? 'badge-dark' : u.role_id === 2 ? 'badge-yellow' : 'badge-blue'}`} style={{ fontSize: '0.65rem' }}>
                            {u.role_name}
                          </span>
                        </td>
                        <td style={{ padding: '10px' }}>
                          <select 
                            value={u.role_id}
                            onChange={(e) => handleChangeRole(u.id, parseInt(e.target.value))}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              border: '1.5px solid #111827',
                              fontWeight: '700',
                              fontSize: '0.775rem'
                            }}
                          >
                            <option value={1}>1. Admin</option>
                            <option value={2}>2. Author</option>
                            <option value={3}>3. Member</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: Admin Moderasi Posts / Pengumuman */}
          {activeTab === 'all-posts' && isRoleAdmin && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>
                  Moderasi & Tulis Pengumuman Admin
                </h3>
                <button className="btn btn-yellow" onClick={() => { onClose(); onOpenStudio(); }} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                  <PenSquare size={15} /> + Tulis Pengumuman
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {allPosts.map(post => (
                  <div key={post.id} style={{
                    backgroundColor: '#FFFDF7',
                    border: '2px solid #111827',
                    borderRadius: '12px',
                    padding: '14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}>
                    <div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span className={`badge ${post.status === 'published' ? 'badge-yellow' : 'badge-dark'}`} style={{ fontSize: '0.65rem' }}>
                          {post.status}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Penulis: {post.author_name}</span>
                      </div>
                      <h4 style={{ fontSize: '1rem', fontWeight: '800', marginTop: '4px' }}>{post.title}</h4>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-outline" onClick={() => onSelectPost(post)} style={{ padding: '6px 10px', fontSize: '0.775rem' }}>
                        Lihat Artikel
                      </button>
                      <button className="btn btn-dark" onClick={() => handleDeletePost(post.id)} style={{ padding: '6px 10px', fontSize: '0.775rem', backgroundColor: '#DC2626' }}>
                        <Trash2 size={15} /> Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Author My Posts */}
          {activeTab === 'my-posts' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>
                  Karya Artikel Penulis ({myAuthoredPosts.length})
                </h3>
                <button className="btn btn-yellow" onClick={() => { onClose(); onOpenStudio(); }} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                  <PenSquare size={15} /> Tulis Artikel Baru
                </button>
              </div>

              {myAuthoredPosts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#6B7280', fontSize: '0.875rem' }}>
                  Anda belum menulis artikel. Klik "Tulis Artikel Baru" untuk mempublikasikan karya Anda!
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                  {myAuthoredPosts.map(post => (
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
              )}
            </div>
          )}

          {/* TAB: Bookmarks */}
          {activeTab === 'bookmarks' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '14px' }}>
                Koleksi Artikel Tersimpan ({myBookmarkedPosts.length})
              </h3>
              {myBookmarkedPosts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#6B7280', fontSize: '0.875rem' }}>
                  Belum ada artikel tersimpan.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                  {myBookmarkedPosts.map(post => (
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
              )}
            </div>
          )}

          {/* TAB: Liked Posts */}
          {activeTab === 'liked' && (
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '14px' }}>
                Artikel Yang Disukai ({myLikedPosts.length})
              </h3>
              {myLikedPosts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#6B7280', fontSize: '0.875rem' }}>
                  Belum ada artikel yang disukai.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                  {myLikedPosts.map(post => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onSelectPost={onSelectPost}
                      onLike={onLike}
                      onBookmark={onBookmark}
                      isLiked={true}
                      isBookmarked={bookmarkedIds.includes(post.id)}
                      currentUser={currentUser}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* DETAILED SUBMISSION REVIEW MODAL FOR ADMIN */}
      {selectedSubForReview && (
        <div className="animate-backdrop" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 500,
          padding: '10px'
        }}>
          <div className="animate-popup-enter" style={{
            backgroundColor: '#FFFFFF',
            width: '100%',
            maxWidth: '680px',
            borderRadius: '20px',
            border: '3px solid #111827',
            boxShadow: '6px 6px 0px 0px #111827',
            overflow: 'hidden',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ padding: '16px 20px', backgroundColor: '#FFD600', borderBottom: '3px solid #111827', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="badge badge-dark" style={{ fontSize: '0.65rem' }}>REVIEW DETAIL SUBMISI</span>
                <h3 className="font-serif" style={{ fontSize: '1.2rem', fontWeight: '900', color: '#111827' }}>
                  {selectedSubForReview.title}
                </h3>
              </div>
              <button onClick={() => setSelectedSubForReview(null)} style={{ background: '#FFF', border: '2px solid #111827', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: '900', flexShrink: 0 }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '20px', overflowY: 'auto', flexGrow: 1 }}>
              <div style={{ marginBottom: '14px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>Jenis: {selectedSubForReview.type}</span>
                <span className="badge badge-dark" style={{ fontSize: '0.65rem' }}>Pengirim: {selectedSubForReview.name} ({selectedSubForReview.email})</span>
              </div>

              {/* Cover Photo / Image Preview if available */}
              {selectedSubForReview.image && (
                <div style={{ marginBottom: '14px', border: '2px solid #111827', borderRadius: '12px', overflow: 'hidden' }}>
                  <img src={selectedSubForReview.image} alt="Preview Karya" style={{ width: '100%', maxHeight: '220px', objectFit: 'cover' }} />
                </div>
              )}

              <div style={{ marginBottom: '14px' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '900', color: '#111827', marginBottom: '4px' }}>ABSTRAK / RINGKASAN:</h4>
                <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: '1.6', backgroundColor: '#FAF8F5', padding: '10px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                  {selectedSubForReview.summary || 'Tidak ada ringkasan'}
                </p>
              </div>

              {/* Document Link */}
              {selectedSubForReview.link && (
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '900', color: '#111827', marginBottom: '4px' }}>LINK DOKUMEN / PORTOFOLIO:</h4>
                  <a 
                    href={selectedSubForReview.link} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 12px',
                      backgroundColor: '#EFF6FF',
                      color: '#2563EB',
                      border: '1.5.px solid #2563EB',
                      borderRadius: '8px',
                      fontWeight: '800',
                      fontSize: '0.8rem',
                      textDecoration: 'none',
                      wordBreak: 'break-all'
                    }}
                  >
                    <ExternalLink size={15} /> Buka Berkas Dokumen &rarr;
                  </a>
                </div>
              )}

              {/* APPROVAL AUTHOR SELECTION BOX */}
              {selectedSubForReview.status === 'pending' && (
                <div style={{ backgroundColor: '#FFFDF5', border: '2px solid #FFD600', padding: '14px', borderRadius: '12px', marginTop: '16px' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '900', color: '#111827', marginBottom: '6px' }}>
                    PILIH AUTHOR PENERBIT (DIANDRA / TSAQILAH / MARIAM):
                  </h4>

                  <select
                    value={assignedAuthorId}
                    onChange={(e) => setAssignedAuthorId(parseInt(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '8px',
                      border: '2px solid #111827',
                      fontWeight: '800',
                      fontSize: '0.85rem',
                      marginBottom: '10px'
                    }}
                  >
                    {authorsList.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.full_name} ({a.email})
                      </option>
                    ))}
                  </select>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => handleApproveSubmission(selectedSubForReview.id)}
                      className="btn btn-yellow"
                      disabled={loadingAction}
                      style={{ flexGrow: 1, padding: '10px', fontSize: '0.85rem' }}
                    >
                      <Check size={16} /> Setujui & Terbitkan Lewat {authorsList.find(a => a.id === assignedAuthorId)?.full_name}
                    </button>

                    <button 
                      onClick={() => handleRejectSubmission(selectedSubForReview.id)}
                      className="btn btn-outline"
                      disabled={loadingAction}
                      style={{ padding: '10px 14px', fontSize: '0.85rem', color: '#DC2626', borderColor: '#DC2626' }}
                    >
                      <XCircle size={16} /> Tolak
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
