/**
 * Pneumadina URL & Sharing Helper Utility
 * Handles URL slugification, deep-linking route parsing, and multi-channel sharing
 */

export function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD') // remove accents
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-') // collapse dashes
    .replace(/^-+/, '') // trim - from start of text
    .replace(/-+$/, ''); // trim - from end of text
}

export function getBaseUrl() {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'https://pneumadina.web.app';
}

/**
 * Generates the canonical direct URL for an article
 */
export function getArticleUrl(post) {
  if (!post) return getBaseUrl();
  const slug = post.slug || slugify(post.title) || post.id;
  return `${getBaseUrl()}/artikel/${slug}`;
}

/**
 * Generates the canonical direct URL for a team member
 */
export function getTeamUrl(member) {
  if (!member) return `${getBaseUrl()}#divisi-section`;
  const id = member.id || slugify(member.name);
  return `${getBaseUrl()}/tim/${id}`;
}

/**
 * Parses current window URL pathname, search params, and hash to detect active route
 */
export function parseCurrentRoute() {
  if (typeof window === 'undefined') return { type: 'home' };

  const pathname = window.location.pathname.toLowerCase().replace(/\/$/, '');
  const searchParams = new URLSearchParams(window.location.search);
  const hash = window.location.hash.toLowerCase();

  // 1. Article / Post direct routes: /artikel/:slug, /post/:slug, /baca/:slug, ?artikel=:slug, ?post=:slug
  const articleMatch = pathname.match(/^\/(?:artikel|post|baca|p)\/(.+)$/);
  if (articleMatch && articleMatch[1]) {
    return { type: 'article', slugOrId: decodeURIComponent(articleMatch[1]) };
  }
  if (searchParams.has('artikel')) {
    return { type: 'article', slugOrId: searchParams.get('artikel') };
  }
  if (searchParams.has('post')) {
    return { type: 'article', slugOrId: searchParams.get('post') };
  }
  if (searchParams.has('p')) {
    return { type: 'article', slugOrId: searchParams.get('p') };
  }
  if (hash.startsWith('#artikel-')) {
    return { type: 'article', slugOrId: hash.replace('#artikel-', '') };
  }

  // 2. Team Member direct routes: /tim/:id, /struktur/:id, ?tim=:id, ?member=:id
  const teamMatch = pathname.match(/^\/(?:tim|struktur|kabinet|member)\/(.+)$/);
  if (teamMatch && teamMatch[1]) {
    return { type: 'team', memberId: decodeURIComponent(teamMatch[1]) };
  }
  if (searchParams.has('tim')) {
    return { type: 'team', memberId: searchParams.get('tim') };
  }
  if (searchParams.has('member')) {
    return { type: 'team', memberId: searchParams.get('member') };
  }
  if (hash.startsWith('#tim-')) {
    return { type: 'team', memberId: hash.replace('#tim-', '') };
  }

  // 3. Section routes
  if (pathname === '/tim' || pathname === '/struktur' || hash === '#divisi-section' || hash === '#tim') {
    return { type: 'section', sectionId: 'divisi-section' };
  }
  if (pathname === '/visi-misi' || hash === '#visi-misi') {
    return { type: 'section', sectionId: 'visi-misi-section' };
  }
  if (pathname === '/kirim-karya' || pathname === '/terima-publikasi' || pathname === '/publikasi' || searchParams.has('publikasi')) {
    return { type: 'modal', modal: 'terimaPublikasi' };
  }
  if (pathname === '/book-club' || pathname === '/buku' || searchParams.has('bookclub')) {
    return { type: 'modal', modal: 'bookClub' };
  }
  if (pathname === '/donasi' || pathname === '/qris' || searchParams.has('donasi')) {
    return { type: 'modal', modal: 'donasi' };
  }
  if (pathname === '/studio' || searchParams.has('studio')) {
    return { type: 'modal', modal: 'studio' };
  }

  return { type: 'home' };
}

/**
 * Universal Share method using Web Share API or Clipboard Fallback
 */
export async function shareContent({ title, text, url }) {
  const shareData = {
    title: title || 'Pneumadina — Komunitas & Publikasi Mahasiswa',
    text: text || `${title} — Baca selengkapnya di Blog Pneumadina`,
    url: url || getBaseUrl()
  };

  // 1. Try Native Mobile Web Share API
  if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return { success: true, method: 'native' };
    } catch (err) {
      if (err.name === 'AbortError') {
        return { success: false, aborted: true };
      }
      // Fallback to clipboard
    }
  }

  // 2. Fallback to Clipboard Copy
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(shareData.url);
      return { success: true, method: 'clipboard', url: shareData.url };
    } catch (err) {
      // Fallback legacy execCommand
    }
  }

  // 3. Fallback textarea copy
  try {
    const textarea = document.createElement('textarea');
    textarea.value = shareData.url;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return { success: true, method: 'clipboard', url: shareData.url };
  } catch (e) {
    return { success: false, error: e };
  }
}

/**
 * Social media direct share links generator
 */
export function getSocialShareLinks({ title, url, text }) {
  const encodedUrl = encodeURIComponent(url || getBaseUrl());
  const encodedTitle = encodeURIComponent(title || 'Pneumadina');
  const encodedSummary = encodeURIComponent(`${title || 'Pneumadina'}\n\n${text || ''}\n\nBaca di: ${url || getBaseUrl()}`);

  return {
    whatsapp: `https://api.whatsapp.com/send?text=${encodedSummary}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&via=pneumadina`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
  };
}
