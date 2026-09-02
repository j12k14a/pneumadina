/**
 * Pneumadina Smart PDF Scanner & Article Auto-Extractor
 * Extracts text, title, author, abstract, headings, tables, category, and tags from uploaded PDFs.
 */

import { slugify } from './urlHelper';

/**
 * Load PDF.js dynamically from CDN if not already loaded in window
 */
export async function loadPdfJs() {
  if (typeof window === 'undefined') return null;
  if (window.pdfjsLib) return window.pdfjsLib;

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(window.pdfjsLib);
      } else {
        reject(new Error('PDF.js failed to initialize'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load PDF.js library'));
    document.head.appendChild(script);
  });
}

/**
 * Extract raw text per page from PDF File or ArrayBuffer
 */
export async function extractTextFromPdf(fileOrBuffer) {
  let arrayBuffer;
  if (fileOrBuffer instanceof File || fileOrBuffer instanceof Blob) {
    arrayBuffer = await fileOrBuffer.arrayBuffer();
  } else {
    arrayBuffer = fileOrBuffer;
  }

  try {
    const pdfjs = await loadPdfJs();
    if (pdfjs) {
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      const pages = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Group items into lines based on Y coordinate
        const linesMap = new Map();
        for (const item of textContent.items) {
          const y = Math.round(item.transform[5]);
          if (!linesMap.has(y)) {
            linesMap.set(y, []);
          }
          linesMap.get(y).push(item.str);
        }

        // Sort descending by Y coordinate (top to bottom)
        const sortedY = Array.from(linesMap.keys()).sort((a, b) => b - a);
        const pageLines = sortedY.map(y => linesMap.get(y).join(' ').trim()).filter(l => l.length > 0);
        pages.push({
          pageNumber: i,
          text: pageLines.join('\n')
        });
      }

      return { success: true, numPages, pages };
    }
  } catch (err) {
    console.warn('PDF.js parsing failed, using fallback stream extractor:', err);
  }

  // Fallback: Pure browser binary text stream extraction
  return extractPdfFallback(arrayBuffer);
}

/**
 * Fallback binary text stream parser when CDN is offline
 */
function extractPdfFallback(buffer) {
  const bytes = new Uint8Array(buffer);
  let rawStr = '';
  const len = bytes.length;
  for (let i = 0; i < len; i++) {
    if (bytes[i] >= 32 && bytes[i] <= 126) {
      rawStr += String.fromCharCode(bytes[i]);
    } else if (bytes[i] === 10 || bytes[i] === 13) {
      rawStr += '\n';
    }
  }

  // Extract parentheses-enclosed string blocks
  const matches = rawStr.match(/\(([^()]{2,})\)/g) || [];
  const text = matches.map(m => m.slice(1, -1)).join(' ');

  return {
    success: true,
    numPages: 1,
    pages: [{ pageNumber: 1, text }]
  };
}

/**
 * Intelligent Article Structure Analyzer & Auto-Generator
 * Transforms parsed PDF pages into complete article fields (Title, Author, Abstract, Headings, Tags, Category, Content)
 */
export function analyzeAndFormatPdfArticle(pdfResult, fileName = '') {
  const allPageTexts = pdfResult.pages.map(p => p.text);
  const fullRawText = allPageTexts.join('\n\n');

  // 1. Clean and normalize all words and lines
  const words = fullRawText.split(/\s+/).filter(w => w.trim().length > 0);
  const normalizedText = words.join(' ');

  // 2. Detect Title
  let title = '';
  const firstPage = allPageTexts[0] || '';
  const firstLines = firstPage.split('\n').map(l => l.trim()).filter(l => l.length > 3);

  // Look for academic title patterns on Page 1 before "Abstract" or "Author"
  const abstractIdx = normalizedText.toLowerCase().indexOf('abstract');
  if (abstractIdx > 0) {
    const headerBlock = normalizedText.substring(0, abstractIdx).trim();
    const titleCandidates = headerBlock.split(/by\s+|author:|department|university|shafa|diandra|jawsyan/i);
    if (titleCandidates[0] && titleCandidates[0].trim().length > 10) {
      title = titleCandidates[0].trim();
    }
  }

  if (!title && firstLines.length > 0) {
    title = firstLines.slice(0, 2).join(' ');
  }

  if (!title) {
    title = fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
  }

  title = title.replace(/^#+\s*/, '').trim();

  // 3. Detect Author & Affiliation
  let authorName = '';
  let authorAffiliation = '';
  let authorEmail = '';

  const emailMatch = normalizedText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
  if (emailMatch) {
    authorEmail = emailMatch[1];
  }

  if (/shafa|jasmine/i.test(normalizedText) || /shafa|jasmine/i.test(fileName)) {
    authorName = 'Shafa Nur Jasmine';
    authorAffiliation = 'Department of International Relations, Paramadina University';
  } else if (/diandra/i.test(normalizedText)) {
    authorName = 'Diandra Paramadina';
    authorAffiliation = 'Divisi Litbang Pneumadina';
  } else if (/jawsyan/i.test(normalizedText)) {
    authorName = 'Admin Jawsyan Tampan';
    authorAffiliation = 'Divisi Litbang Pneumadina';
  } else if (/tsaqilah/i.test(normalizedText)) {
    authorName = 'Tsaqilah Paramadina';
    authorAffiliation = 'Divisi Litbang Pneumadina';
  } else if (/mariam/i.test(normalizedText)) {
    authorName = 'Mariam Paramadina';
    authorAffiliation = 'Divisi Litbang Pneumadina';
  }

  // 4. Detect Abstract & Keywords
  let abstractText = '';
  let keywords = [];

  const abstractMatch = normalizedText.match(/abstract\s*:?\s*(.+?)(?:keywords\s*:|introduction\b|1\.\s*introduction)/i);
  if (abstractMatch && abstractMatch[1]) {
    abstractText = abstractMatch[1].trim();
  }

  const keywordsMatch = normalizedText.match(/keywords\s*:?\s*([^.\n]+)/i);
  if (keywordsMatch && keywordsMatch[1]) {
    keywords = keywordsMatch[1].split(/[,;]/).map(k => k.trim().replace(/^#/, '')).filter(k => k.length > 1);
  }

  // 5. Generate Smart Tags
  const detectedTags = new Set(keywords);
  const textLower = normalizedText.toLowerCase();

  const tagKeywords = [
    { tag: 'NatunaSea', check: 'natuna' },
    { tag: 'MaritimeSecurity', check: 'maritime' },
    { tag: 'Deterrence', check: 'deterrence' },
    { tag: 'InternationalRelations', check: 'international relations' },
    { tag: 'UNCLOS', check: 'unclos' },
    { tag: 'Sovereignty', check: 'sovereignty' },
    { tag: 'Paramadina', check: 'paramadina' },
    { tag: 'Research', check: 'research' },
    { tag: 'AcademicPaper', check: 'paper' },
    { tag: 'Redaksi', check: 'redaksi' },
    { tag: 'Pluralisme', check: 'pluralisme' },
    { tag: 'Demokrasi', check: 'demokrasi' },
    { tag: 'Pasifisme', check: 'pasifisme' }
  ];

  for (const item of tagKeywords) {
    if (textLower.includes(item.check)) {
      detectedTags.add(item.tag);
    }
  }

  // 6. Format Content into Beautiful Structured Academic Markdown
  let formattedContent = normalizedText;

  // Format Abstract Box
  if (abstractText) {
    const kwText = Array.from(detectedTags).slice(0, 6).map(t => `#${t}`).join(' ');
    formattedContent = formattedContent.replace(
      new RegExp(`abstract\\s*:?\\s*${escapeRegExp(abstractText.substring(0, 50))}`, 'i'),
      `### Abstract\n\n> ${abstractText}\n\n**Keywords:** ${kwText}\n\n---\n\n`
    );
  }

  // Format Headings
  const majorSections = [
    'INTRODUCTION',
    'LITERATURE REVIEW',
    'THEORETICAL FRAMEWORK',
    'RESEARCH METHODOLOGY',
    'RESEARCH METHOD',
    'RESULTS AND DISCUSSION',
    'FINDINGS AND DISCUSSION',
    'DISCUSSION',
    'CONCLUSION',
    'CONCLUSION AND POLICY RECOMMENDATIONS',
    'POLICY RECOMMENDATIONS',
    'REFERENCES',
    'BIBLIOGRAPHY'
  ];

  for (const sec of majorSections) {
    const reg = new RegExp(`\\b(${sec})\\b`, 'gi');
    formattedContent = formattedContent.replace(reg, '\n\n## $1\n\n');
  }

  const subSections = [
    'Background',
    'Problem Formulation',
    'Research Objectives',
    'Significance of the Study',
    'Theoretical Framework',
    'Research Design',
    'Data Sources',
    'Data Analysis Techniques',
    'Maritime Security Threats',
    'Institutional Coordination',
    'Strategic Policy Recommendations'
  ];

  for (const sub of subSections) {
    const reg = new RegExp(`\\b(${sub})\\b`, 'gi');
    formattedContent = formattedContent.replace(reg, '\n\n### $1\n\n');
  }

  // Clean Paragraphs (sentences grouping)
  const sentences = formattedContent.split(/(?<=[.!?])\s+(?=[A-Z0-9])/).map(s => s.trim()).filter(s => s.length > 0);
  const cleanParagraphs = [];
  let tempP = [];

  for (const s of sentences) {
    if (s.startsWith('#')) {
      if (tempP.length > 0) {
        cleanParagraphs.push(tempP.join(' '));
        tempP = [];
      }
      cleanParagraphs.push(s);
    } else {
      tempP.push(s);
      if (tempP.length >= 3 || tempP.join(' ').length > 350) {
        cleanParagraphs.push(tempP.join(' '));
        tempP = [];
      }
    }
  }
  if (tempP.length > 0) {
    cleanParagraphs.push(tempP.join(' '));
  }

  let finalMarkdown = cleanParagraphs.join('\n\n').trim();

  // Format References into numbered list
  const refIndex = finalMarkdown.search(/##\s+(?:References|Bibliography)/i);
  if (refIndex !== -1) {
    const bodyPart = finalMarkdown.substring(0, refIndex);
    const refPart = finalMarkdown.substring(refIndex);
    const refMatch = refPart.match(/##\s+(?:References|Bibliography)\s+([\s\S]+)/i);
    if (refMatch && refMatch[1]) {
      const rawRefs = refMatch[1].split(/(?=[A-Z][a-zA-Z\s.,&-]+?\(\d{4}[a-z]?\))/);
      const cleanRefList = rawRefs.map(r => r.trim()).filter(r => r.length > 15);
      let numberedRefText = '\n\n## References\n\n';
      cleanRefList.forEach((r, idx) => {
        numberedRefText += `${idx + 1}. ${r}\n\n`;
      });
      finalMarkdown = bodyPart.trim() + numberedRefText;
    }
  }

  // 7. Estimate Read Time & Word Count
  const wordCount = words.length;
  const readTimeMinutes = Math.max(3, Math.ceil(wordCount / 200));

  // 8. Auto-Suggested Category
  let categorySlug = 'non-fiksi';
  if (textLower.includes('cerpen') || textLower.includes('puisi') || textLower.includes('novel')) {
    categorySlug = 'fiksi';
  } else if (textLower.includes('desain') || textLower.includes('visual') || textLower.includes('poster')) {
    categorySlug = 'desain';
  } else if (textLower.includes('foto') || textLower.includes('lensa') || textLower.includes('dokumentasi')) {
    categorySlug = 'fotografi';
  }

  return {
    title: title || 'Artikel Ilmiah Redaksi Pneumadina',
    slug: slugify(title) || 'artikel-ilmiah-redaksi-pneumadina',
    author_name: authorName || 'Shafa Nur Jasmine',
    author_email: authorEmail || 'shafa.jasmine@students.paramadina.ac.id',
    author_bio: authorAffiliation || 'Editorial Division of Pneumadina',
    category: categorySlug,
    tags: Array.from(detectedTags).slice(0, 8),
    content: finalMarkdown,
    readTimeMinutes,
    wordCount,
    numPages: pdfResult.numPages,
    abstract: abstractText
  };
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
