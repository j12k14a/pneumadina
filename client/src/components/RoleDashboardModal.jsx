import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, PenSquare, Users, FileText, Bookmark, Heart, Send, CheckCircle, Trash2, Check, XCircle, Clock, ExternalLink, Eye, Image as ImageIcon, Plus, Edit2, Upload, Award } from 'lucide-react';
import PostCard from './PostCard';

const DIVISION_CONFIG = {
  bph: { name: 'BPH', fullName: 'Badan Pengurus Harian', color: '#B45309', textColor: '#111827' },
  litbang: { name: 'Litbang', fullName: 'Penelitian & Pengembangan', color: '#1D4ED8', textColor: '#FFFFFF' },
  pdd: { name: 'PDD', fullName: 'Publikasi Desain Dokumentasi', color: '#A21CAF', textColor: '#FFFFFF' },
  kaderisasi: { name: 'Kaderisasi', fullName: 'Kaderisasi & Pembinaan', color: '#047857', textColor: '#FFFFFF' },
  redaksi: { name: 'Redaksi', fullName: 'Redaksi Editorial', color: '#C2410C', textColor: '#FFFFFF' },
};

export default function RoleDashboardModal({ 
  currentUser, 
  onClose, 
  allPosts, 
  users, 
  categories, 
  tags, 
  teamMembers = [], 
  onRefreshTeam, 
  onRefreshData, 
  onOpenStudio, 
  onOpenTerimaPublikasi, 
  onSelectPost, 
  onLike, 
  onBookmark, 
  likedIds, 
  bookmarkedIds 
}) {
  const [activeTab, setActiveTab] = useState(currentUser?.role_id === 1 ? 'submissions' : currentUser?.role_id === 2 ? 'my-posts' : 'bookmarks');
  const [submissionList, setSubmissionList] = useState([]);
  const [selectedSubForReview, setSelectedSubForReview] = useState(null);

  // Team Management State
  const [localTeam, setLocalTeam] = useState(teamMembers);
  const [teamFilter, setTeamFilter] = useState('all');
  const [teamSearch, setTeamSearch] = useState('');
  const [editingMember, setEditingMember] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  
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

  useEffect(() => {
    if (teamMembers && teamMembers.length > 0) {
      setLocalTeam(teamMembers);
    } else {
      fetchTeamData();
    }
  }, [teamMembers]);

  const fetchTeamData = async () => {
    try {
      const res = await fetch('/api/team');
      const data = await res.json();
      if (data.success) {
        setLocalTeam(data.data);
        if (onRefreshTeam) onRefreshTeam();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePhotoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const res = await fetch('/api/team/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, base64: event.target.result })
        });
        const contentType = res.headers.get('content-type');
        if (res.ok && contentType && contentType.includes('application/json')) {
          const data = await res.json();
          if (data.success) {
            setEditingMember(prev => ({ ...prev, image: data.url }));
            setMsg('📸 Foto berhasil diunggah!');
            setTimeout(() => setMsg(''), 2500);
            return;
          }
        }
        throw new Error('API offline');
      } catch (err) {
        // Fallback langsung menggunakan Data URL gambar lokal
        setEditingMember(prev => ({ ...prev, image: event.target.result }));
        setMsg('📸 Foto berhasil dipasang!');
        setTimeout(() => setMsg(''), 2500);
      } finally {
        setUploadingPhoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveMember = async (e) => {
    e.preventDefault();
    if (!editingMember.name || !editingMember.role || !editingMember.division_id) {
      alert('Nama, peran, dan divisi wajib diisi!');
      return;
    }
    setLoadingAction(true);
    const isEdit = !!editingMember.id;
    try {
      const url = isEdit ? `/api/team/${editingMember.id}` : '/api/team';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingMember)
      });
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          setMsg(isEdit ? '✅ Data anggota berhasil diperbarui!' : '🎉 Anggota baru berhasil ditambahkan!');
          setEditingMember(null);
          fetchTeamData();
          setTimeout(() => setMsg(''), 3000);
          return;
        }
      }
      throw new Error('API offline');
    } catch (err) {
      // Fallback update state & localStorage
      let updated;
      if (isEdit) {
        updated = localTeam.map(m => m.id === editingMember.id ? { ...m, ...editingMember } : m);
      } else {
        const newM = { ...editingMember, id: Date.now() };
        updated = [...localTeam, newM];
      }
      setLocalTeam(updated);
      try {
        localStorage.setItem('pneumadina_team_members', JSON.stringify(updated));
      } catch (e) {}
      setMsg(isEdit ? '✅ Data anggota berhasil diperbarui!' : '🎉 Anggota baru berhasil ditambahkan!');
      setEditingMember(null);
      if (onRefreshTeam) onRefreshTeam();
      setTimeout(() => setMsg(''), 3000);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDeleteMember = async (memberId, memberName) => {
    if (!window.confirm(`Hapus ${memberName} dari daftar pengurus Pneumadina?`)) return;
    try {
      const res = await fetch(`/api/team/${memberId}`, { method: 'DELETE' });
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          setMsg('Anggota berhasil dihapus.');
          fetchTeamData();
          setTimeout(() => setMsg(''), 2500);
          return;
        }
      }
      throw new Error('API offline');
    } catch (err) {
      const updated = localTeam.filter(m => m.id !== memberId);
      setLocalTeam(updated);
      try {
        localStorage.setItem('pneumadina_team_members', JSON.stringify(updated));
      } catch (e) {}
      setMsg('Anggota berhasil dihapus.');
      if (onRefreshTeam) onRefreshTeam();
      setTimeout(() => setMsg(''), 2500);
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

              <button 
                onClick={() => setActiveTab('team')}
                style={{
                  padding: '10px 16px',
                  border: 'none',
                  borderBottom: activeTab === 'team' ? '3px solid #FFD600' : 'none',
                  backgroundColor: activeTab === 'team' ? '#FFFFFF' : 'transparent',
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
                <Users size={15} color="#059669" /> Kelola Tim & Divisi ({localTeam.length})
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

          {/* TAB: Admin Kelola Tim & Divisi */}
          {activeTab === 'team' && isRoleAdmin && (
            <div>
              {/* Header with Search & Add Button */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#111827', margin: 0 }}>
                    👥 Kelola Struktur Tim & Rekrutmen Divisi
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#4B5563', margin: '4px 0 0 0', fontWeight: '600' }}>
                    Tambah anggota baru, perbarui poster foto, jabatan, bio, atau hapus anggota pengurus.
                  </p>
                </div>

                <button
                  className="btn btn-yellow"
                  onClick={() => setEditingMember({
                    name: '',
                    role: 'Anggota',
                    is_leader: 0,
                    division_id: 'bph',
                    division_name: 'Badan Pengurus Harian',
                    image: '/team/bph-ketua-umum-bram.png',
                    instagram: '@pneumadina',
                    bio: ''
                  })}
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.825rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '3px 3px 0px 0px #111827'
                  }}
                >
                  <Plus size={16} /> + Tambah Anggota / Rekrutmen Baru
                </button>
              </div>

              {/* Filters & Search */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
                marginBottom: '16px',
                backgroundColor: '#FAF8F5',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1.5px solid #111827'
              }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {['all', 'bph', 'litbang', 'pdd', 'kaderisasi', 'redaksi'].map(dId => (
                    <button
                      key={dId}
                      onClick={() => setTeamFilter(dId)}
                      className={`btn ${teamFilter === dId ? 'btn-yellow' : 'btn-outline'}`}
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    >
                      {dId === 'all' ? 'Semua Divisi' : dId.toUpperCase()} (
                        {dId === 'all' 
                          ? localTeam.length 
                          : localTeam.filter(m => (m.division_id || m.divisionId) === dId).length}
                      )
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Cari anggota / jabatan..."
                  value={teamSearch}
                  onChange={(e) => setTeamSearch(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #111827',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    width: '200px'
                  }}
                />
              </div>

              {/* Team Members Grid Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '14px',
                maxHeight: '52vh',
                overflowY: 'auto',
                paddingRight: '4px'
              }}>
                {localTeam
                  .filter(m => teamFilter === 'all' || (m.division_id || m.divisionId) === teamFilter)
                  .filter(m => !teamSearch || m.name.toLowerCase().includes(teamSearch.toLowerCase()) || m.role.toLowerCase().includes(teamSearch.toLowerCase()))
                  .map(member => {
                    const divInfo = DIVISION_CONFIG[member.division_id || member.divisionId] || { name: 'Divisi', color: '#111827' };
                    return (
                      <div
                        key={member.id}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '2px solid #111827',
                          borderRadius: '12px',
                          boxShadow: '3px 3px 0px 0px #111827',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div style={{ display: 'flex', gap: '10px', padding: '10px', alignItems: 'center' }}>
                          <img
                            src={member.image}
                            alt={member.name}
                            style={{
                              width: '56px',
                              height: '56px',
                              borderRadius: '8px',
                              border: '1.5px solid #111827',
                              objectFit: 'cover',
                              backgroundColor: '#111827',
                              flexShrink: 0
                            }}
                          />
                          <div style={{ flexGrow: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                              <span style={{ fontWeight: '900', fontSize: '0.95rem', color: '#111827' }}>
                                {member.name}
                              </span>
                              {(member.is_leader === 1 || member.isLeader) && (
                                <span style={{
                                  backgroundColor: '#FFD600',
                                  border: '1px solid #111827',
                                  borderRadius: '4px',
                                  padding: '1px 5px',
                                  fontSize: '0.625rem',
                                  fontWeight: '900',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '2px'
                                }}>
                                  <Award size={10} /> Ketua
                                </span>
                              )}
                            </div>

                            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: divInfo.color, marginTop: '2px' }}>
                              {member.role} • {divInfo.name}
                            </div>

                            <div style={{ fontSize: '0.7rem', color: '#6B7280', marginTop: '2px' }}>
                              {member.instagram || '@pneumadina'}
                            </div>
                          </div>
                        </div>

                        {member.bio && (
                          <div style={{
                            padding: '0 10px 8px 10px',
                            fontSize: '0.725rem',
                            color: '#4B5563',
                            lineHeight: '1.3',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {member.bio}
                          </div>
                        )}

                        <div style={{
                          display: 'flex',
                          borderTop: '1px solid #E5E7EB',
                          backgroundColor: '#FAF8F5'
                        }}>
                          <button
                            onClick={() => setEditingMember({
                              ...member,
                              is_leader: member.is_leader === 1 || member.isLeader ? 1 : 0
                            })}
                            style={{
                              flex: 1,
                              padding: '8px',
                              border: 'none',
                              borderRight: '1px solid #E5E7EB',
                              backgroundColor: 'transparent',
                              fontWeight: '800',
                              fontSize: '0.75rem',
                              color: '#2563EB',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px'
                            }}
                          >
                            <Edit2 size={13} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteMember(member.id, member.name)}
                            style={{
                              flex: 1,
                              padding: '8px',
                              border: 'none',
                              backgroundColor: 'transparent',
                              fontWeight: '800',
                              fontSize: '0.75rem',
                              color: '#DC2626',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px'
                            }}
                          >
                            <Trash2 size={13} /> Hapus
                          </button>
                        </div>
                      </div>
                    );
                  })}
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

      {/* ADD / EDIT TEAM MEMBER MODAL (CENTERED VIEWPORT) */}
      {editingMember && (
        <div
          className="animate-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(17, 24, 39, 0.8)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '16px'
          }}
          onClick={() => setEditingMember(null)}
        >
          <div
            className="animate-popup-enter"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              border: '3px solid #111827',
              boxShadow: '8px 8px 0px 0px #111827',
              width: '100%',
              maxWidth: '580px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              margin: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '2px solid #111827', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#111827', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{editingMember.id ? '✏️' : '✨'}</span>
                <span>{editingMember.id ? 'Edit Data Anggota Pengurus' : 'Tambah Anggota / Rekrutmen Baru'}</span>
              </h3>
              <button
                onClick={() => setEditingMember(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveMember} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Name & Role */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', marginBottom: '5px' }}>
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bram, Nadia..."
                    value={editingMember.name || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '2px solid #111827',
                      fontWeight: '700',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', marginBottom: '5px' }}>
                    Jabatan / Peran *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ketua Divisi / Anggota / Sekretaris..."
                    value={editingMember.role || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '2px solid #111827',
                      fontWeight: '700',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              </div>

              {/* Division & Is Leader */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', alignItems: 'center' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', marginBottom: '5px' }}>
                    Divisi *
                  </label>
                  <select
                    value={editingMember.division_id || 'bph'}
                    onChange={(e) => {
                      const divId = e.target.value;
                      const divName = DIVISION_CONFIG[divId]?.fullName || divId.toUpperCase();
                      setEditingMember({ ...editingMember, division_id: divId, division_name: divName });
                    }}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '2px solid #111827',
                      fontWeight: '700',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="bph">🏛️ BPH (Badan Pengurus Harian)</option>
                    <option value="litbang">🔬 Litbang (Penelitian & Pengembangan)</option>
                    <option value="pdd">🎨 PDD (Publikasi Desain Dokumentasi)</option>
                    <option value="kaderisasi">🌱 Kaderisasi (Kaderisasi & Pembinaan)</option>
                    <option value="redaksi">✍️ Redaksi (Redaksi Editorial)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', marginBottom: '5px' }}>
                    Status Kepemimpinan
                  </label>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '9px 12px',
                    backgroundColor: editingMember.is_leader ? '#FFFBEB' : '#F9FAFB',
                    border: '2px solid #111827',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '0.8rem'
                  }}>
                    <input
                      type="checkbox"
                      checked={!!editingMember.is_leader}
                      onChange={(e) => setEditingMember({ ...editingMember, is_leader: e.target.checked ? 1 : 0 })}
                    />
                    <span>⭐ Ketua / Pimpinan Divisi</span>
                  </label>
                </div>
              </div>

              {/* Instagram Handle */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', marginBottom: '5px' }}>
                  Username Instagram
                </label>
                <input
                  type="text"
                  placeholder="@pneumadina atau @username_pribadi"
                  value={editingMember.instagram || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, instagram: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '2px solid #111827',
                    fontWeight: '700',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              {/* Image URL & File Upload */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', marginBottom: '5px' }}>
                  Foto Poster / Avatar Anggota
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Path: /team/bph-ketua-umum-bram.png atau URL eksternal"
                    value={editingMember.image || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, image: e.target.value })}
                    style={{
                      flex: 1,
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '2px solid #111827',
                      fontWeight: '600',
                      fontSize: '0.85rem'
                    }}
                  />

                  <label className="btn btn-outline" style={{
                    padding: '9px 14px',
                    fontSize: '0.785rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap'
                  }}>
                    <Upload size={15} />
                    <span>{uploadingPhoto ? 'Mengunggah...' : '📁 Unggah Foto'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handlePhotoFileChange}
                      disabled={uploadingPhoto}
                    />
                  </label>
                </div>

                {/* Image Preview Box */}
                {editingMember.image && (
                  <div style={{
                    marginTop: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px',
                    backgroundColor: '#FAF8F5',
                    borderRadius: '10px',
                    border: '1.5px dashed #111827'
                  }}>
                    <img
                      src={editingMember.image}
                      alt="Pratinjau"
                      style={{
                        width: '52px',
                        height: '62px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        border: '1.5px solid #111827',
                        backgroundColor: '#111827'
                      }}
                    />
                    <div style={{ fontSize: '0.775rem', color: '#4B5563', fontWeight: '600' }}>
                      Pratinjau foto pengurus saat ini
                    </div>
                  </div>
                )}
              </div>

              {/* Bio / Ringkasan Deskripsi */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', marginBottom: '5px' }}>
                  Bio / Ringkasan Peran di Pneumadina
                </label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan fokus riset, peran, atau kontribusi anggota ini di divisi..."
                  value={editingMember.bio || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '2px solid #111827',
                    fontWeight: '500',
                    fontSize: '0.825rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Submit / Cancel Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setEditingMember(null)}
                  style={{ padding: '9px 18px', fontSize: '0.85rem' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-yellow"
                  disabled={loadingAction}
                  style={{
                    padding: '9px 22px',
                    fontSize: '0.85rem',
                    boxShadow: '3px 3px 0px 0px #111827'
                  }}
                >
                  {loadingAction ? 'Menyimpan...' : (editingMember.id ? '💾 Simpan Perubahan' : '✨ Tambahkan Anggota')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
