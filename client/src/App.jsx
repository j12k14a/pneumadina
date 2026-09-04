import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import KabinetCarousel from './components/KabinetCarousel';
import VisiMisiSection from './components/VisiMisiSection';
import PostCard from './components/PostCard';
import FeaturedPostCard from './components/FeaturedPostCard';
import PostDetailModal from './components/PostDetailModal';
import ArticlePageView from './components/ArticlePageView';
import TerimaPublikasi from './components/TerimaPublikasi';
import BookClub from './components/BookClub';
import Studio from './components/Studio';
import AuthModal from './components/AuthModal';
import RoleDashboardModal from './components/RoleDashboardModal';
import EditProfileModal from './components/EditProfileModal';
import DonationModal from './components/DonationModal';
import TeamSection, { TEAM_MEMBERS } from './components/TeamSection';
import PneumadinaLogo from './components/PneumadinaLogo';
import { Filter, Layers, Flame, ArrowUpDown, Send, CheckCircle2, Globe, Heart } from 'lucide-react';
import { SEED_DATA } from './data/seedData';
import { db, doc, onSnapshot, setDoc, increment, collection, getDoc } from './firebase';
import { 
  slugify, 
  getArticleUrl, 
  getTeamUrl, 
  parseCurrentRoute, 
  getBaseUrl 
} from './utils/urlHelper';

const API_BASE = '/api';
const DEFAULT_TITLE = 'Pneumadina — Komunitas & Publikasi Mahasiswa';

export default function App() {
  const [posts, setPosts] = useState(() => {
    let initialPosts = SEED_DATA.posts;
    try {
      const saved = localStorage.getItem('pneumadina_posts');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with SEED_DATA so latest pristine posts take precedence
        const seedMap = new Map(SEED_DATA.posts.map(p => [p.id, p]));
        initialPosts = parsed.map(p => {
          if (seedMap.has(p.id)) {
            return { ...seedMap.get(p.id), likes_count: p.likes_count || seedMap.get(p.id).likes_count };
          }
          return p;
        });
        // Add any new seed posts not in saved
        for (const sPost of SEED_DATA.posts) {
          if (!initialPosts.some(p => p.id === sPost.id)) {
            initialPosts.unshift(sPost);
          }
        }
      }
      const dynamicLikes = JSON.parse(localStorage.getItem('pneumadina_dynamic_likes') || '{}');
      initialPosts = initialPosts.map(p => {
        if (dynamicLikes[p.id] !== undefined) {
          return { ...p, likes_count: dynamicLikes[p.id] };
        }
        return p;
      });
    } catch {
      initialPosts = SEED_DATA.posts;
    }
    return initialPosts;
  });
  const [categories, setCategories] = useState(SEED_DATA.categories);
  const [tags, setTags] = useState(SEED_DATA.tags);
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('pneumadina_users');
      return saved ? JSON.parse(saved) : (SEED_DATA.users || []);
    } catch {
      return SEED_DATA.users || [];
    }
  });

  // Authenticated User State (Synchronized to pneumadina_user)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('pneumadina_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Filter & Sort States (Figma Specification)
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState(null);
  const [sortBy, setSortBy] = useState('terbaru'); // 'terbaru' | 'terlama' | 'terpopuler' | 'abjad'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('beranda');

  // Modals & Deep-Linked States
  const [selectedPost, setSelectedPost] = useState(null);
  const [fullPagePost, setFullPagePost] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const [showTerimaPublikasi, setShowTerimaPublikasi] = useState(false);
  const [showBookClub, setShowBookClub] = useState(false);
  const [showStudio, setShowStudio] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'regis'
  const [showRoleDashboard, setShowRoleDashboard] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);

  // Toast Feedback State
  const [toastMsg, setToastMsg] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribedToast, setSubscribedToast] = useState(false);

  // Local Likes & Bookmarks Tracking (Mendukung Like Publik / Tamu)
  const [likedIds, setLikedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('pneumadina_guest_likes');
      return saved ? JSON.parse(saved) : [1, 2];
    } catch (e) {
      return [1, 2];
    }
  });
  const [bookmarkedIds, setBookmarkedIds] = useState([1, 3]);

  // Dynamic Team Members State (Default dari SEED_DATA / TEAM_MEMBERS)
  const [teamMembers, setTeamMembers] = useState(() => {
    try {
      const saved = localStorage.getItem('pneumadina_team_members');
      return saved ? JSON.parse(saved) : (SEED_DATA.team || TEAM_MEMBERS);
    } catch {
      return SEED_DATA.team || TEAM_MEMBERS;
    }
  });

  const initialRouteResolved = useRef(false);

  const showToast = (message) => {
    setToastMsg(message);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // -------------------------------------------------------------
  // DEEP-LINKING ROUTING & BIDIRECTIONAL URL MANAGEMENT
  // -------------------------------------------------------------

  const handleSelectPost = (post, pushToHistory = true, forceFullPage = false) => {
    if (!post) return;
    const isLongArticle = (post.content?.length || 0) > 3500;
    
    if (forceFullPage || isLongArticle) {
      setFullPagePost(post);
      setSelectedPost(null);
    } else {
      setSelectedPost(post);
      setFullPagePost(null);
    }
    document.title = `${post.title} — Pneumadina`;

    if (pushToHistory) {
      const articleUrl = `/artikel/${post.slug || slugify(post.title) || post.id}`;
      try {
        window.history.pushState({ type: 'article', id: post.id, slug: post.slug }, '', articleUrl);
      } catch (e) {}
    }
  };

  const handleClosePost = (pushToHistory = true) => {
    setSelectedPost(null);
    setFullPagePost(null);
    document.title = DEFAULT_TITLE;

    if (pushToHistory) {
      try {
        window.history.pushState({ type: 'home' }, '', '/');
      } catch (e) {}
    }
  };

  const handleOpenEditPost = (post) => {
    if (!post) return;
    setEditingPost(post);
    setShowStudio(true);
  };

  const handleSelectTeamMember = (member, pushToHistory = true) => {
    if (!member) return;
    setSelectedTeamMember(member);
    document.title = `${member.name} (${member.role}) — Tim Pneumadina`;

    if (pushToHistory) {
      const teamUrl = `/tim/${member.id || slugify(member.name)}`;
      try {
        window.history.pushState({ type: 'team', id: member.id }, '', teamUrl);
      } catch (e) {}
    }
  };

  const handleCloseTeamMember = (pushToHistory = true) => {
    setSelectedTeamMember(null);
    document.title = DEFAULT_TITLE;

    if (pushToHistory) {
      try {
        window.history.pushState({ type: 'home' }, '', '/');
      } catch (e) {}
    }
  };

  const handleOpenAuth = (mode = 'login', pushToHistory = true) => {
    const targetMode = (mode === 'regis' || mode === 'register' || mode === 'daftar') ? 'regis' : 'login';
    setAuthModalMode(targetMode);
    setShowAuthModal(true);
    document.title = targetMode === 'regis' ? 'Daftar Akun Baru — Pneumadina' : 'Masuk Akun — Pneumadina';

    if (pushToHistory) {
      const authUrl = targetMode === 'regis' ? '/regis' : '/login';
      try {
        window.history.pushState({ type: 'auth', mode: targetMode }, '', authUrl);
      } catch (e) {}
    }
  };

  const handleCloseAuth = (pushToHistory = true) => {
    setShowAuthModal(false);
    document.title = DEFAULT_TITLE;

    if (pushToHistory) {
      try {
        window.history.pushState({ type: 'home' }, '', '/');
      } catch (e) {}
    }
  };

  const handleAuthModeChange = (mode) => {
    const targetMode = (mode === 'regis' || mode === 'register' || mode === 'daftar') ? 'regis' : 'login';
    setAuthModalMode(targetMode);
    document.title = targetMode === 'regis' ? 'Daftar Akun Baru — Pneumadina' : 'Masuk Akun — Pneumadina';
    const authUrl = targetMode === 'regis' ? '/regis' : '/login';
    try {
      window.history.pushState({ type: 'auth', mode: targetMode }, '', authUrl);
    } catch (e) {}
  };

  // Process incoming Route
  const applyRoute = (route, currentPosts = posts, currentTeam = teamMembers) => {
    if (!route) return;

    if (route.type === 'article' && route.slugOrId) {
      const target = decodeURIComponent(route.slugOrId).toLowerCase();
      const match = currentPosts.find(p => 
        String(p.id) === target || 
        (p.slug && p.slug.toLowerCase() === target) ||
        (p.title && slugify(p.title) === target) ||
        (p.title && p.title.toLowerCase().includes(target))
      );

      if (match) {
        if ((match.content?.length || 0) > 3500) {
          setFullPagePost(match);
          setSelectedPost(null);
        } else {
          setSelectedPost(match);
          setFullPagePost(null);
        }
        document.title = `${match.title} — Pneumadina`;
      }
    } else if (route.type === 'team' && route.memberId) {
      const target = decodeURIComponent(route.memberId).toLowerCase();
      const allMembers = (currentTeam && currentTeam.length > 0) ? currentTeam : TEAM_MEMBERS;
      const match = allMembers.find(m => 
        (m.id && m.id.toLowerCase() === target) ||
        (m.member_id && String(m.member_id).toLowerCase() === target) ||
        (m.name && slugify(m.name) === target) ||
        (m.name && m.name.toLowerCase().includes(target))
      );

      if (match) {
        setSelectedTeamMember(match);
        document.title = `${match.name} (${match.role}) — Tim Pneumadina`;
        setTimeout(() => {
          const el = document.getElementById('divisi-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    } else if (route.type === 'section' && route.sectionId) {
      setTimeout(() => {
        const el = document.getElementById(route.sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else if (route.type === 'modal') {
      if (route.modal === 'terimaPublikasi') setShowTerimaPublikasi(true);
      if (route.modal === 'bookClub') setShowBookClub(true);
      if (route.modal === 'donasi') setShowDonationModal(true);
      if (route.modal === 'studio') setShowStudio(true);
    } else if (route.type === 'auth') {
      const mode = (route.mode === 'regis' || route.mode === 'register' || route.mode === 'daftar') ? 'regis' : 'login';
      setAuthModalMode(mode);
      setShowAuthModal(true);
      document.title = mode === 'regis' ? 'Daftar Akun Baru — Pneumadina' : 'Masuk Akun — Pneumadina';
    } else if (route.type === 'home') {
      setSelectedPost(null);
      setFullPagePost(null);
      setSelectedTeamMember(null);
      setShowAuthModal(false);
      document.title = DEFAULT_TITLE;
    }
  };

  // Initial Route Detection on Mount & popstate Event Listener
  useEffect(() => {
    const route = parseCurrentRoute();
    applyRoute(route, posts, teamMembers);
    initialRouteResolved.current = true;

    const handlePopState = () => {
      const currentRoute = parseCurrentRoute();
      applyRoute(currentRoute, posts, teamMembers);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync route once posts/team members load if not resolved initially
  useEffect(() => {
    if (posts.length > 0 || teamMembers.length > 0) {
      const route = parseCurrentRoute();
      if (route.type === 'article' && !selectedPost) {
        applyRoute(route, posts, teamMembers);
      } else if (route.type === 'team' && !selectedTeamMember) {
        applyRoute(route, posts, teamMembers);
      }
    }
  }, [posts, teamMembers]);

  // -------------------------------------------------------------
  // FIRESTORE LISTENERS & API FETCHING
  // -------------------------------------------------------------

  useEffect(() => {
    fetchPosts();
    fetchCategories();
    fetchTags();
    fetchUsers();

    // Variable declarations for realtime listeners (fixed reference error)
    let unsubUsers = () => {};
    let unsubTeam = () => {};
    let unsubPosts = () => {};
    let unsubLikes = () => {};
    let unsubCategories = () => {};
    let unsubTags = () => {};

    if (db) {
      try {
        unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
          if (!snap.empty) {
            const uList = [];
            snap.forEach(d => uList.push(d.data()));
            uList.sort((a, b) => (a.id || 0) - (b.id || 0));
            setUsers(uList);
            try { localStorage.setItem('pneumadina_users', JSON.stringify(uList)); } catch (e) {}

            setCurrentUser(prevUser => {
              if (!prevUser) return null;
              const match = uList.find(u => u.id === prevUser.id || (u.email && u.email.toLowerCase() === prevUser.email?.toLowerCase()));
              if (match) {
                const updated = { ...prevUser, ...match };
                try { localStorage.setItem('pneumadina_user', JSON.stringify(updated)); } catch (e) {}
                return updated;
              }
              return prevUser;
            });
          }
        }, () => {});

        unsubTeam = onSnapshot(collection(db, 'team_members'), (snap) => {
          if (!snap.empty) {
            const tList = [];
            snap.forEach(d => tList.push(d.data()));
            tList.sort((a, b) => (a.order_index || a.id || 0) - (b.order_index || b.id || 0));
            setTeamMembers(tList);
            try { localStorage.setItem('pneumadina_team_members', JSON.stringify(tList)); } catch (e) {}
          }
        }, () => {});

        unsubPosts = onSnapshot(collection(db, 'posts'), (snap) => {
          if (!snap.empty) {
            const pList = [];
            snap.forEach(d => pList.push(d.data()));
            pList.sort((a, b) => (b.id || 0) - (a.id || 0));
            const dynamicLikes = JSON.parse(localStorage.getItem('pneumadina_dynamic_likes') || '{}');
            const updatedP = pList.map(p => {
              if (dynamicLikes[p.id] !== undefined) {
                return { ...p, likes_count: dynamicLikes[p.id] };
              }
              return p;
            });
            setPosts(updatedP);
            try { localStorage.setItem('pneumadina_posts', JSON.stringify(updatedP)); } catch (e) {}

            // Keep currently viewed post synchronized with fresh content
            setSelectedPost(curr => {
              if (!curr) return null;
              const fresh = updatedP.find(p => p.id === curr.id || (p.slug && p.slug === curr.slug));
              return fresh || curr;
            });
            setFullPagePost(curr => {
              if (!curr) return null;
              const fresh = updatedP.find(p => p.id === curr.id || (p.slug && p.slug === curr.slug));
              return fresh || curr;
            });
          }
        }, () => {});

        unsubLikes = onSnapshot(doc(db, 'stats', 'likes_counts'), (snap) => {
          if (snap.exists()) {
            const remoteCounts = snap.data() || {};
            setPosts(prevPosts => {
              const updated = prevPosts.map(p => {
                if (remoteCounts[p.id] !== undefined) {
                  return { ...p, likes_count: remoteCounts[p.id] };
                }
                return p;
              });
              try {
                localStorage.setItem('pneumadina_posts', JSON.stringify(updated));
                const currentDynamic = JSON.parse(localStorage.getItem('pneumadina_dynamic_likes') || '{}');
                Object.assign(currentDynamic, remoteCounts);
                localStorage.setItem('pneumadina_dynamic_likes', JSON.stringify(currentDynamic));
              } catch (e) {}
              return updated;
            });
          }
        }, () => {});

        unsubCategories = onSnapshot(collection(db, 'categories'), (snap) => {
          if (!snap.empty) {
            const cList = [];
            snap.forEach(d => cList.push(d.data()));
            cList.sort((a, b) => (a.id || 0) - (b.id || 0));
            setCategories(cList);
          }
        }, () => {});

        unsubTags = onSnapshot(collection(db, 'tags'), (snap) => {
          if (!snap.empty) {
            const tgList = [];
            snap.forEach(d => tgList.push(d.data()));
            tgList.sort((a, b) => (a.id || 0) - (b.id || 0));
            setTags(tgList);
          }
        }, () => {});
      } catch (e) {
        console.warn('Firestore realtime listeners notice:', e);
      }
    }

    return () => {
      unsubUsers();
      unsubTeam();
      unsubPosts();
      unsubLikes();
      unsubCategories();
      unsubTags();
    };
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await fetch(`${API_BASE}/team`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setTeamMembers(data.data);
          localStorage.setItem('pneumadina_team_members', JSON.stringify(data.data));
        }
      }
    } catch (err) {}
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_BASE}/posts`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setPosts(data.data);
          localStorage.setItem('pneumadina_posts', JSON.stringify(data.data));
        }
      }
    } catch (err) {}
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) setCategories(data.data);
      }
    } catch (err) {}
  };

  const fetchTags = async () => {
    try {
      const res = await fetch(`${API_BASE}/tags`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) setTags(data.data);
      }
    } catch (err) {}
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/users`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) setUsers(data.data);
      }
    } catch (err) {}
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('pneumadina_user', JSON.stringify(user));
    showToast(`✅ Berhasil masuk sebagai ${user.full_name || user.email} (${user.role_name})`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('pneumadina_user');
    showToast('👋 Anda telah keluar dari akun');
  };

  const handleProfileUpdated = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('pneumadina_user', JSON.stringify(updatedUser));
    fetchUsers();
    fetchPosts();
    showToast('🎉 Profil berhasil diperbarui!');
  };

  const handleLike = async (postId) => {
    const isCurrentlyLiked = likedIds.includes(postId);
    const delta = isCurrentlyLiked ? -1 : 1;

    const newLikedIds = isCurrentlyLiked 
      ? likedIds.filter(id => id !== postId) 
      : [...likedIds, postId];

    setLikedIds(newLikedIds);
    try {
      localStorage.setItem('pneumadina_guest_likes', JSON.stringify(newLikedIds));
    } catch (e) {}

    let newCount = 0;
    setPosts(prevPosts => {
      const updated = prevPosts.map(p => {
        if (p.id === postId) {
          newCount = Math.max(0, (p.likes_count || 0) + delta);
          return { ...p, likes_count: newCount };
        }
        return p;
      });
      try {
        localStorage.setItem('pneumadina_posts', JSON.stringify(updated));
        const dynamicLikes = JSON.parse(localStorage.getItem('pneumadina_dynamic_likes') || '{}');
        dynamicLikes[postId] = newCount;
        localStorage.setItem('pneumadina_dynamic_likes', JSON.stringify(dynamicLikes));
      } catch (e) {}
      return updated;
    });

    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(prev => prev ? { ...prev, likes_count: Math.max(0, (prev.likes_count || 0) + delta) } : null);
    }

    showToast(isCurrentlyLiked ? 'Like dibatalkan' : '❤️ Terima kasih! Artikel disukai');

    // Realtime Sync ke Cloud Firestore
    if (db) {
      try {
        const statsRef = doc(db, 'stats', 'likes_counts');
        await setDoc(statsRef, {
          [postId]: increment(delta)
        }, { merge: true });
      } catch (err) {}
    }

    // Sync ke backend lokal jika ada
    try {
      let guestId = localStorage.getItem('pneumadina_guest_id');
      if (!guestId) {
        guestId = 'guest_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
        localStorage.setItem('pneumadina_guest_id', guestId);
      }

      await fetch(`${API_BASE}/likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          post_id: postId, 
          user_id: currentUser ? currentUser.id : null,
          guest_id: currentUser ? null : guestId
        })
      });
    } catch (err) {}
  };

  const handleBookmark = async (postId) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    const isCurrentlyBookmarked = bookmarkedIds.includes(postId);

    setBookmarkedIds(prev => isCurrentlyBookmarked ? prev.filter(id => id !== postId) : [...prev, postId]);

    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(prev => prev ? { ...prev, bookmarks_count: Math.max(0, (prev.bookmarks_count || 0) + (isCurrentlyBookmarked ? -1 : 1)) } : null);
    }

    showToast(isCurrentlyBookmarked ? 'Bookmark dihapus' : '📌 Disimpan ke Bookmark profil Anda!');

    try {
      await fetch(`${API_BASE}/bookmarks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, user_id: currentUser.id })
      });
    } catch (err) {}
  };

  const handleAddComment = async (postId, content, parentId = null) => {
    if (!content || !content.trim()) return;

    const newComment = {
      id: Date.now(),
      post_id: postId,
      parent_id: parentId,
      user_id: currentUser ? currentUser.id : null,
      author_name: currentUser ? (currentUser.full_name || currentUser.username) : 'Pembaca Budiman (Tamu)',
      author_avatar: currentUser ? (currentUser.avatar || '/team/bph-anggota-sheiza.png') : '/team/bph-anggota-sheiza.png',
      content: content.trim(),
      created_at: new Date().toISOString()
    };

    setPosts(prev => {
      const updated = prev.map(p => {
        if (p.id === postId) {
          const currentComments = p.comments || [];
          return {
            ...p,
            comments: [...currentComments, newComment]
          };
        }
        return p;
      });
      try {
        localStorage.setItem('pneumadina_posts', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(prev => prev ? {
        ...prev,
        comments: [...(prev.comments || []), newComment]
      } : null);
    }

    if (db) {
      try {
        const postRef = doc(db, 'posts', String(postId));
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
          const pData = postSnap.data();
          const comments = pData.comments || [];
          comments.push(newComment);
          await setDoc(postRef, { comments }, { merge: true });
        }
      } catch (err) {}
    }

    try {
      fetch(`${API_BASE}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: postId,
          user_id: currentUser ? currentUser.id : null,
          author_name: newComment.author_name,
          content: newComment.content,
          parent_id: parentId
        })
      }).catch(() => {});
    } catch (e) {}

    showToast('💬 Komentar Anda berhasil dipublikasikan!');
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribedToast(true);
    setNewsletterEmail('');
    setTimeout(() => setSubscribedToast(false), 4000);
  };

  // Filter Posts
  const filteredPosts = posts.filter(post => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title?.toLowerCase().includes(q);
      const matchContent = post.content?.toLowerCase().includes(q);
      const matchAuthor = post.author_name?.toLowerCase().includes(q) || post.author_email?.toLowerCase().includes(q);
      if (!matchTitle && !matchContent && !matchAuthor) return false;
    }

    if (selectedCategory !== 'all') {
      const hasCategory = post.categories?.some(c => c.slug === selectedCategory || c.name.toLowerCase().includes(selectedCategory.toLowerCase()));
      if (!hasCategory) return false;
    }

    if (selectedTag) {
      const hasTag = post.tags?.some(t => t.name.toLowerCase() === selectedTag.toLowerCase());
      if (!hasTag) return false;
    }

    return true;
  });

  // Sort Posts Logic (Figma Specification)
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'terlama') {
      return new Date(a.created_at) - new Date(b.created_at);
    } else if (sortBy === 'terpopuler') {
      return (b.likes_count || 0) - (a.likes_count || 0);
    } else if (sortBy === 'abjad') {
      return a.title.localeCompare(b.title);
    }
    // Default: Terbaru
    return new Date(b.created_at) - new Date(a.created_at);
  });

  // Featured Post (First post or special editor's pick)
  const featuredPost = sortedPosts.length > 0 ? sortedPosts[0] : null;
  const regularPosts = sortedPosts.length > 1 ? sortedPosts.slice(1) : [];

  // Dedicated Full Page Reading View for Long-Form Articles & Direct Routes
  if (fullPagePost) {
    return (
      <ArticlePageView
        post={fullPagePost}
        onBack={() => handleClosePost()}
        onLike={handleLike}
        onBookmark={handleBookmark}
        isLiked={likedIds.includes(fullPagePost.id)}
        isBookmarked={bookmarkedIds.includes(fullPagePost.id)}
        currentUser={currentUser}
        onAddComment={handleAddComment}
        showToast={showToast}
        onEditPost={handleOpenEditPost}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#FAF8F5' }}>
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="animate-backdrop" style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#111827',
          color: '#FFD600',
          padding: '12px 20px',
          borderRadius: '12px',
          border: '2px solid #FFD600',
          boxShadow: '4px 4px 0px 0px #111827',
          fontWeight: '800',
          fontSize: '0.85rem',
          zIndex: 700
        }}>
          {toastMsg}
        </div>
      )}

      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={(mode) => handleOpenAuth(mode || 'login')}
        onOpenStudio={() => setShowStudio(true)}
        onOpenTerimaPublikasi={() => setShowTerimaPublikasi(true)}
        onOpenBookClub={() => setShowBookClub(true)}
        onOpenDonation={() => setShowDonationModal(true)}
        onOpenRoleDashboard={() => setShowRoleDashboard(true)}
        onOpenEditProfile={() => setShowEditProfile(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Hero Banner Section */}
      <HeroBanner 
        onOpenTerimaPublikasi={() => setShowTerimaPublikasi(true)}
        onOpenBookClub={() => setShowBookClub(true)}
        onOpenDonation={() => setShowDonationModal(true)}
      />

      {/* Photo Carousel Activity Kabinet Pneumadina (Figma Banner Slider) */}
      <KabinetCarousel />

      {/* Main Container */}
      <main className="container" id="artikel-section" style={{ flexGrow: 1, padding: '0 16px 2.5rem 16px' }}>
        
        {/* Gagasan Visi & Misi Section */}
        <VisiMisiSection />

        {/* Trending Tags Pill Bar Carousel */}
        {tags.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: '1.5rem 0 1rem 0',
            overflowX: 'auto',
            paddingBottom: '6px',
            WebkitOverflowScrolling: 'touch'
          }}>
            <span style={{ fontSize: '0.775rem', fontWeight: '900', color: '#111827', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
              <Flame size={14} color="#DC2626" /> TRENDING TAGS:
            </span>

            {selectedTag && (
              <button 
                onClick={() => setSelectedTag(null)}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  padding: '3px 10px',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  border: '1.5px solid #111827',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                ✕ Clear #{selectedTag}
              </button>
            )}

            {tags.map(t => {
              const isSelected = selectedTag === t.name;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTag(isSelected ? null : t.name)}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    padding: '3px 10px',
                    backgroundColor: isSelected ? '#111827' : '#FFFFFF',
                    color: isSelected ? '#FFD600' : '#111827',
                    border: '1.5px solid #111827',
                    borderRadius: '9999px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  #{t.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Category Filters Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '10px',
          paddingBottom: '0.85rem',
          borderBottom: '2.5px solid #111827'
        }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '900', textTransform: 'uppercase', color: '#111827', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Filter size={15} color="#2563EB" /> KATEGORI:
            </span>

            <button
              onClick={() => setSelectedCategory('all')}
              className={`btn ${selectedCategory === 'all' ? 'btn-yellow' : 'btn-outline'}`}
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
            >
              Semua Artikel ({posts.length})
            </button>

            {categories.map(cat => {
              const isSelected = selectedCategory === cat.slug || selectedCategory === cat.name.toLowerCase();
              const getIcon = (slug) => {
                if (slug.includes('fiksi') && !slug.includes('non')) return '📖';
                if (slug.includes('non-fiksi')) return '✍️';
                if (slug.includes('desain')) return '🎨';
                if (slug.includes('fotografi')) return '📸';
                return '🏷️';
              };
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`btn ${isSelected ? 'btn-yellow' : 'btn-outline'}`}
                  style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
                >
                  {getIcon(cat.slug)} {cat.name}
                </button>
              );
            })}
          </div>

          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#6B7280' }}>
            Menampilkan {sortedPosts.length} artikel
          </div>

        </div>

        {/* SORTING BAR (Figma Specification) */}
        <div style={{
          backgroundColor: '#FFD600',
          border: '2.5px solid #111827',
          borderRadius: '12px',
          padding: '10px 16px',
          marginBottom: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          boxShadow: '3px 3px 0px 0px #111827'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.825rem', fontWeight: '900', color: '#111827' }}>
            <ArrowUpDown size={16} color="#111827" /> URUTKAN / SORT BERITA:
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <button
              onClick={() => setSortBy('terbaru')}
              className={`btn ${sortBy === 'terbaru' ? 'btn-dark' : 'btn-outline'}`}
              style={{ padding: '4px 12px', fontSize: '0.775rem' }}
            >
              • Urutkan: Terbaru
            </button>

            <button
              onClick={() => setSortBy('terlama')}
              className={`btn ${sortBy === 'terlama' ? 'btn-dark' : 'btn-outline'}`}
              style={{ padding: '4px 12px', fontSize: '0.775rem' }}
            >
              • Urutkan: Terlama
            </button>

            <button
              onClick={() => setSortBy('terpopuler')}
              className={`btn ${sortBy === 'terpopuler' ? 'btn-dark' : 'btn-outline'}`}
              style={{ padding: '4px 12px', fontSize: '0.775rem' }}
            >
              • Urutkan: Paling Populer (Suka)
            </button>

            <button
              onClick={() => setSortBy('abjad')}
              className={`btn ${sortBy === 'abjad' ? 'btn-dark' : 'btn-outline'}`}
              style={{ padding: '4px 12px', fontSize: '0.775rem' }}
            >
              • Urutkan: Abjad (A - Z)
            </button>
          </div>
        </div>

        {/* Featured Article Card (When no active search/tag filter) */}
        {!searchQuery && !selectedTag && selectedCategory === 'all' && featuredPost && (
          <FeaturedPostCard 
            post={featuredPost}
            onSelectPost={(p) => handleSelectPost(p)}
            onLike={handleLike}
            onBookmark={handleBookmark}
            isLiked={likedIds.includes(featuredPost.id)}
            isBookmarked={bookmarkedIds.includes(featuredPost.id)}
            showToast={showToast}
            currentUser={currentUser}
            onEdit={handleOpenEditPost}
          />
        )}

        {/* Posts Grid - Responsive Multi-Column Layout */}
        {sortedPosts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '2px solid #111827',
            boxShadow: '4px 4px 0px 0px #111827'
          }}>
            <Layers size={44} style={{ margin: '0 auto 1rem auto', color: '#9CA3AF' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>Tidak ada artikel ditemukan</h3>
            <p style={{ color: '#6B7280', marginBottom: '1.25rem', fontSize: '0.9rem' }}>Coba ubah kata kunci pencarian, kategori, atau urutan sortasi.</p>
            <button className="btn btn-yellow" onClick={() => { setSelectedCategory('all'); setSelectedTag(null); setSortBy('terbaru'); setSearchQuery(''); }}>
              Reset Filter & Sort
            </button>
          </div>
        ) : (
          <div className="posts-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Show all if filtered, or show rest if featured exists */}
            {(searchQuery || selectedTag || selectedCategory !== 'all' ? sortedPosts : regularPosts).map((post, idx) => (
              <div 
                key={post.id} 
                className="animate-card-pop"
                style={{ animationDelay: `${idx * 0.04}s` }}
              >
                <PostCard
                  post={post}
                  onSelectPost={(p) => handleSelectPost(p)}
                  onLike={handleLike}
                  onBookmark={handleBookmark}
                  isLiked={likedIds.includes(post.id)}
                  isBookmarked={bookmarkedIds.includes(post.id)}
                  currentUser={currentUser}
                  showToast={showToast}
                  onEdit={handleOpenEditPost}
                />
              </div>
            ))}
          </div>
        )}

        {/* Struktur Divisi & Tim Pengurus Komunitas Pneumadina */}
        <TeamSection 
          teamMembers={teamMembers} 
          onRefreshTeam={fetchTeam}
          selectedMember={selectedTeamMember}
          onSelectMember={(m) => handleSelectTeamMember(m)}
          onClosePreview={() => handleCloseTeamMember()}
          showToast={showToast}
        />

      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#111827',
        color: '#FFFFFF',
        padding: '3rem 0 1.5rem 0',
        marginTop: '3.5rem',
        borderTop: '4px solid #FFD600'
      }}>
        <div className="container">
          
          {/* Newsletter Box */}
          <div style={{
            backgroundColor: '#FFD600',
            color: '#111827',
            borderRadius: '18px',
            border: '3px solid #FFFFFF',
            padding: '1.5rem clamp(1rem, 4vw, 2rem)',
            marginBottom: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            boxShadow: '6px 6px 0px 0px #FFFFFF'
          }}>
            <div>
              <span className="badge badge-dark" style={{ fontSize: '0.65rem', marginBottom: '4px' }}>BULETIN PNEUMADINA (100% GRATIS)</span>
              <h3 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: '900', color: '#111827' }}>
                Langganan Gratis Wacana & Esai Mingguan
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#111827', fontWeight: '600', opacity: 0.9 }}>
                Dapatkan kabar penerbitan karya terbaru dan undangan Book Club langsung ke email Anda tanpa biaya apapun.
              </p>
            </div>

            {subscribedToast ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '900', color: '#059669', backgroundColor: '#FFFFFF', padding: '8px 16px', borderRadius: '9999px', border: '2px solid #111827' }}>
                <CheckCircle2 size={18} /> Terimakasih! Email berhasil berlangganan gratis.
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '8px', flexGrow: 1, maxWidth: '440px' }}>
                <input 
                  type="email"
                  required
                  placeholder="Masukkan email Anda..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  style={{
                    flexGrow: 1,
                    padding: '10px 14px',
                    borderRadius: '9999px',
                    border: '2px solid #111827',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    outline: 'none'
                  }}
                />
                <button type="submit" className="btn btn-dark" style={{ padding: '10px 18px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                  Langganan Gratis <Send size={15} />
                </button>
              </form>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.85rem' }}>
                <img
                  src="/logo.png"
                  alt="Logo Resmi Pneumadina"
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    border: '2px solid #FFFFFF',
                    boxShadow: '3px 3px 0px 0px #FFD600',
                    objectFit: 'cover',
                    backgroundColor: '#FFD600',
                    flexShrink: 0
                  }}
                />
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: '900', color: '#FFD600', margin: 0, lineHeight: 1.1 }}>
                    Pneumadina
                  </h3>
                  <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#9CA3AF', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Komunitas & Publikasi
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '0.825rem', color: '#9CA3AF', marginTop: '0.4rem', lineHeight: '1.5' }}>
                Komunitas & Blog Jurnal Bergerak di bidang pluralisme, demokrasi, pasifisme, dan sosial-humaniora. Mengayomi para kawan lintas SARA.
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#FFD600', marginBottom: '0.75rem' }}>MENU UTAMA</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.825rem', color: '#D1D5DB' }}>
                <li style={{ cursor: 'pointer' }} onClick={() => setSelectedCategory('all')}>Beranda Artikel</li>
                <li style={{ cursor: 'pointer' }} onClick={() => {
                  const el = document.getElementById('divisi-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}>👥 Struktur Divisi & Tim</li>
                <li style={{ cursor: 'pointer' }} onClick={() => setShowTerimaPublikasi(true)}>Terima Publikasi Karya</li>
                <li style={{ cursor: 'pointer' }} onClick={() => setShowBookClub(true)}>Book Club Mingguan</li>
                <li style={{ cursor: 'pointer', color: '#FFD600', fontWeight: '800' }} onClick={() => setShowDonationModal(true)}>💛 Open Donation</li>
                <li style={{ cursor: 'pointer' }} onClick={() => currentUser ? setShowStudio(true) : setShowAuthModal(true)}>Studio Penulis</li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#FFD600', marginBottom: '0.75rem' }}>KATEGORI KARYA</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <span onClick={() => setSelectedCategory('fiksi')} style={{ fontSize: '0.725rem', fontWeight: '700', padding: '3px 8px', backgroundColor: '#1F2937', color: '#FFD600', border: '1px solid #374151', borderRadius: '4px', cursor: 'pointer' }}>📖 Fiksi</span>
                <span onClick={() => setSelectedCategory('non-fiksi')} style={{ fontSize: '0.725rem', fontWeight: '700', padding: '3px 8px', backgroundColor: '#1F2937', color: '#FFD600', border: '1px solid #374151', borderRadius: '4px', cursor: 'pointer' }}>✍️ Non-Fiksi</span>
                <span onClick={() => setSelectedCategory('desain')} style={{ fontSize: '0.725rem', fontWeight: '700', padding: '3px 8px', backgroundColor: '#1F2937', color: '#FFD600', border: '1px solid #374151', borderRadius: '4px', cursor: 'pointer' }}>🎨 Desain</span>
                <span onClick={() => setSelectedCategory('fotografi')} style={{ fontSize: '0.725rem', fontWeight: '700', padding: '3px 8px', backgroundColor: '#1F2937', color: '#FFD600', border: '1px solid #374151', borderRadius: '4px', cursor: 'pointer' }}>📸 Fotografi</span>
              </div>
            </div>

            {/* Social Media Section */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#FFD600', marginBottom: '0.75rem' }}>SOSIAL MEDIA & DUKUNGAN</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={() => setShowDonationModal(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    backgroundColor: '#FFD600',
                    color: '#111827',
                    borderRadius: '8px',
                    border: '1.5px solid #111827',
                    fontWeight: '900',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    boxShadow: '3px 3px 0px 0px #FFFFFF'
                  }}
                >
                  <Heart size={16} color="#DC2626" fill="#DC2626" /> Open Donation QRIS
                </button>

                <a 
                  href="https://www.instagram.com/pneumadina/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    backgroundColor: '#E1306C',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1.5px solid #FFFFFF',
                    fontWeight: '800',
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                    width: 'fit-content'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  Instagram @pneumadina
                </a>

                <a 
                  href="https://medium.com/@pneumadina" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    backgroundColor: '#000000',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1.5px solid #FFD600',
                    fontWeight: '800',
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                    width: 'fit-content'
                  }}
                >
                  <Globe size={16} /> Medium @pneumadina
                </a>
              </div>
            </div>

          </div>

          <div style={{
            borderTop: '1px solid #374151',
            paddingTop: '1.25rem',
            textAlign: 'center',
            fontSize: '0.775rem',
            color: '#9CA3AF'
          }}>
            &copy; 2026 Pneumadina Community Blog. Fullstack Application (pneumadina.web.app).
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {showAuthModal && (
        <AuthModal
          initialMode={authModalMode}
          onModeChange={handleAuthModeChange}
          onClose={() => handleCloseAuth()}
          onLoginSuccess={(user) => {
            handleLoginSuccess(user);
            handleCloseAuth();
          }}
        />
      )}

      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => handleClosePost()}
          onLike={handleLike}
          onBookmark={handleBookmark}
          isLiked={likedIds.includes(selectedPost.id)}
          isBookmarked={bookmarkedIds.includes(selectedPost.id)}
          currentUser={currentUser}
          onAddComment={handleAddComment}
          showToast={showToast}
          onOpenFullPage={(p) => handleSelectPost(p, true, true)}
          onEditPost={handleOpenEditPost}
        />
      )}

      {showTerimaPublikasi && (
        <TerimaPublikasi
          onClose={() => setShowTerimaPublikasi(false)}
          onSubmitSuccess={() => fetchPosts()}
        />
      )}

      {showBookClub && (
        <BookClub onClose={() => setShowBookClub(false)} />
      )}

      {showStudio && (
        <Studio
          onClose={() => { setShowStudio(false); setEditingPost(null); }}
          categories={categories}
          tags={tags}
          currentUser={currentUser}
          postToEdit={editingPost}
          onPostCreated={(newP) => { 
            fetchPosts(); 
            fetchCategories(); 
            showToast('🎉 Artikel berhasil diterbitkan!');
            if (newP && (newP.content?.length || 0) > 3000) {
              handleSelectPost(newP, true, true);
            }
          }}
          onPostUpdated={(upPost) => {
            setEditingPost(null);
            fetchPosts();
            fetchCategories();
            showToast('💾 Perubahan artikel berhasil disimpan!');
            if (fullPagePost && fullPagePost.id === upPost.id) {
              setFullPagePost(upPost);
            }
            if (selectedPost && selectedPost.id === upPost.id) {
              setSelectedPost(upPost);
            }
          }}
          onCategoryCreated={() => { fetchCategories(); showToast('🏷️ Kategori baru berhasil ditambahkan dan disinkronkan!'); }}
        />
      )}

      {showDonationModal && (
        <DonationModal onClose={() => setShowDonationModal(false)} />
      )}

      {showRoleDashboard && currentUser && (
        <RoleDashboardModal
          currentUser={currentUser}
          onClose={() => setShowRoleDashboard(false)}
          allPosts={posts}
          users={users}
          categories={categories}
          tags={tags}
          teamMembers={teamMembers}
          onRefreshTeam={fetchTeam}
          onRefreshData={() => { fetchPosts(); fetchUsers(); fetchTeam(); }}
          onOpenStudio={() => { setEditingPost(null); setShowStudio(true); }}
          onOpenTerimaPublikasi={() => setShowTerimaPublikasi(true)}
          onSelectPost={(p) => { setShowRoleDashboard(false); handleSelectPost(p); }}
          onLike={handleLike}
          onBookmark={handleBookmark}
          likedIds={likedIds}
          bookmarkedIds={bookmarkedIds}
          onEditPost={handleOpenEditPost}
          onDeletePost={() => {
            fetchPosts();
            showToast('🗑️ Artikel berhasil dihapus.');
          }}
        />
      )}

      {showEditProfile && currentUser && (
        <EditProfileModal
          currentUser={currentUser}
          onClose={() => setShowEditProfile(false)}
          onUpdateSuccess={handleProfileUpdated}
        />
      )}

    </div>
  );
}
