import React from 'react';
import { BookOpen, ExternalLink, Bookmark, Quote, Link2, Table, CheckCircle2 } from 'lucide-react';

export default function ArticleContentRenderer({ 
  content, 
  fontSize = 16, 
  theme = 'light' 
}) {
  if (!content) return null;

  const isDark = theme === 'dark';
  const isSepia = theme === 'sepia';

  const themeColors = {
    light: {
      text: '#1F2937',
      heading: '#111827',
      h2Accent: '#FFD600',
      abstractBg: '#FFFDF5',
      abstractBorder: '#111827',
      refBg: '#F9FAFB',
      refBorder: '#E5E7EB',
      link: '#2563EB',
      codeBg: '#F3F4F6',
      tableHeaderBg: '#111827',
      tableHeaderText: '#FFD600',
      tableBorder: '#111827',
      tableStripe: '#F9FAFB'
    },
    sepia: {
      text: '#433422',
      heading: '#2C1810',
      h2Accent: '#D97706',
      abstractBg: '#F4E8C1',
      abstractBorder: '#2C1810',
      refBg: '#EFE3BA',
      refBorder: '#D7C797',
      link: '#92400E',
      codeBg: '#EFE3BA',
      tableHeaderBg: '#2C1810',
      tableHeaderText: '#FDE68A',
      tableBorder: '#2C1810',
      tableStripe: '#EFE3BA'
    },
    dark: {
      text: '#E2E8F0',
      heading: '#F8FAFC',
      h2Accent: '#FFD600',
      abstractBg: '#1E293B',
      abstractBorder: '#475569',
      refBg: '#1E293B',
      refBorder: '#334155',
      link: '#60A5FA',
      codeBg: '#334155',
      tableHeaderBg: '#0F172A',
      tableHeaderText: '#FFD600',
      tableBorder: '#475569',
      tableStripe: '#1E293B'
    }
  };

  const colors = themeColors[theme] || themeColors.light;

  // Split into raw blocks (by double newline)
  const rawBlocks = content.split(/\n\n+/);

  let inReferences = false;

  return (
    <div className="article-rendered-body" style={{
      fontSize: `${fontSize}px`,
      lineHeight: '1.85',
      color: colors.text,
      transition: 'color 0.2s, font-size 0.15s'
    }}>
      {rawBlocks.map((block, idx) => {
        let trimmed = block.trim();
        if (!trimmed) return null;

        // Skip redundant top headers if they duplicate modal/page title & author
        if (
          trimmed.startsWith('# ') &&
          (trimmed.toLowerCase().includes('strengthening sovereignty') || trimmed.toLowerCase().includes('artikel ilmiah'))
        ) {
          return null;
        }
        if (
          trimmed.startsWith('**Author:**') ||
          trimmed.startsWith('**Affiliation:**') ||
          trimmed.startsWith('**Division:**') ||
          trimmed.startsWith('**Email:**') ||
          trimmed.startsWith('**Penulis:**')
        ) {
          return null;
        }

        // Table Block Detection (Markdown Table `| col1 | col2 |`)
        if (trimmed.includes('|') && trimmed.includes('\n|')) {
          return renderTableBlock(trimmed, idx, colors, fontSize, isDark);
        }

        // Check if entering References Section
        if (
          trimmed.startsWith('## References') || 
          trimmed.startsWith('## 6. References') || 
          trimmed.startsWith('## DAFTAR PUSTAKA') ||
          trimmed.toLowerCase() === '## references'
        ) {
          inReferences = true;
          return (
            <div key={idx} style={{ marginTop: '3rem', marginBottom: '1.5rem', borderTop: `2.5px solid ${colors.abstractBorder}`, paddingTop: '1.75rem' }}>
              <h2 className="font-serif" style={{
                fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
                fontWeight: '900',
                color: colors.heading,
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Link2 size={22} color="#2563EB" /> References & Bibliography
              </h2>
              <p style={{ fontSize: '0.85rem', color: isDark ? '#94A3B8' : '#6B7280', marginBottom: '1.25rem' }}>
                Sumber rujukan primer, traktat hukum internasional, dan jurnal akademik bereputasi:
              </p>
            </div>
          );
        }

        // H1 Heading
        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={idx} className="font-serif" style={{
              fontSize: 'clamp(1.4rem, 4vw, 2rem)',
              fontWeight: '900',
              color: colors.heading,
              lineHeight: '1.25',
              marginTop: '1.75rem',
              marginBottom: '1rem',
              letterSpacing: '-0.3px'
            }}>
              {trimmed.replace(/^#\s+/, '')}
            </h1>
          );
        }

        // H2 Section Heading
        if (trimmed.startsWith('## ')) {
          inReferences = false;
          return (
            <h2 key={idx} className="font-serif" style={{
              fontSize: 'clamp(1.2rem, 3.5vw, 1.6rem)',
              fontWeight: '900',
              color: colors.heading,
              lineHeight: '1.3',
              marginTop: '2.5rem',
              marginBottom: '1rem',
              borderLeft: `5px solid ${colors.h2Accent}`,
              paddingLeft: '14px'
            }}>
              {trimmed.replace(/^##\s+/, '')}
            </h2>
          );
        }

        // H3 Subheading
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} style={{
              fontSize: 'clamp(1.05rem, 2.5vw, 1.25rem)',
              fontWeight: '800',
              color: '#2563EB',
              lineHeight: '1.35',
              marginTop: '1.75rem',
              marginBottom: '0.75rem'
            }}>
              {trimmed.replace(/^###\s+/, '')}
            </h3>
          );
        }

        // Blockquote / Abstract
        if (trimmed.startsWith('> ') || trimmed.toLowerCase().startsWith('abstract')) {
          const cleanQuote = trimmed.replace(/^>\s*/, '');
          return (
            <div key={idx} style={{
              backgroundColor: colors.abstractBg,
              border: `2px solid ${colors.abstractBorder}`,
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              margin: '1.75rem 0',
              boxShadow: isDark ? 'none' : `4px 4px 0px 0px ${colors.abstractBorder}`
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '900',
                fontSize: '0.85rem',
                color: colors.heading,
                marginBottom: '10px'
              }}>
                <BookOpen size={18} color="#2563EB" />
                <span>ABSTRAK & IKHTISAR AKADEMIK</span>
              </div>
              <div style={{
                fontSize: `${fontSize}px`,
                lineHeight: '1.85',
                color: colors.text,
                fontStyle: 'italic',
                textAlign: 'justify'
              }}>
                {renderInlineFormatted(cleanQuote, colors)}
              </div>
            </div>
          );
        }

        // Horizontal Rule
        if (trimmed === '---') {
          return (
            <hr key={idx} style={{
              border: 'none',
              borderTop: `2px dashed ${isDark ? '#475569' : '#D1D5DB'}`,
              margin: '2rem 0'
            }} />
          );
        }

        // Bullet list points (`• ` or `- `)
        if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const lines = trimmed.split('\n');
          return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '1.25rem 0' }}>
              {lines.map((line, lIdx) => {
                const lTrim = line.trim().replace(/^[•\-*]\s*/, '');
                if (!lTrim) return null;
                return (
                  <div key={lIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{
                      color: '#2563EB',
                      fontWeight: '900',
                      fontSize: '1.2rem',
                      lineHeight: '1',
                      marginTop: '4px'
                    }}>
                      •
                    </span>
                    <div style={{ flexGrow: 1, textAlign: 'justify', lineHeight: '1.85' }}>
                      {renderInlineFormatted(lTrim, colors)}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }

        // If in References section or starts with number
        if (inReferences || /^\d+\.\s+/.test(trimmed)) {
          const lines = trimmed.split('\n');
          return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1rem' }}>
              {lines.map((line, lIdx) => {
                const lTrim = line.trim();
                if (!lTrim) return null;
                const matchNum = lTrim.match(/^(\d+)\.\s+(.+)$/);
                const num = matchNum ? matchNum[1] : (lIdx + 1);
                const refContent = matchNum ? matchNum[2] : lTrim;

                return (
                  <div key={lIdx} style={{
                    backgroundColor: colors.refBg,
                    border: `1.5px solid ${colors.refBorder}`,
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    fontSize: `${Math.max(13, fontSize - 2)}px`,
                    lineHeight: '1.65'
                  }}>
                    <span style={{
                      backgroundColor: '#FFD600',
                      color: '#111827',
                      fontWeight: '900',
                      fontSize: '0.75rem',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      border: '1.5px solid #111827',
                      marginTop: '2px'
                    }}>
                      {num}
                    </span>
                    <div style={{ flexGrow: 1, wordBreak: 'break-word' }}>
                      {renderInlineFormatted(refContent, colors)}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }

        // Regular Paragraph
        return (
          <p key={idx} style={{
            marginBottom: '1.35rem',
            textAlign: 'justify',
            lineHeight: '1.85'
          }}>
            {renderInlineFormatted(trimmed, colors)}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Render Markdown Table into styled HTML Table
 */
function renderTableBlock(blockText, key, colors, fontSize, isDark) {
  const lines = blockText.split('\n').map(l => l.trim()).filter(l => l.length > 0 && l.startsWith('|'));
  if (lines.length < 2) return null;

  const headerLine = lines[0];
  const headers = headerLine.split('|').map(h => h.trim()).filter((h, i, arr) => i > 0 && i < arr.length - 1);

  // Rows (skip index 1 if it's separator `|---|---|`)
  const startIndex = lines[1].includes('---') ? 2 : 1;
  const rows = lines.slice(startIndex).map(line => {
    return line.split('|').map(c => c.trim()).filter((c, i, arr) => i > 0 && i < arr.length - 1);
  });

  return (
    <div key={key} style={{
      margin: '2rem 0',
      overflowX: 'auto',
      borderRadius: '14px',
      border: `2px solid ${colors.tableBorder}`,
      boxShadow: isDark ? 'none' : `4px 4px 0px 0px ${colors.tableBorder}`
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: `${Math.max(12, fontSize - 2)}px`,
        textAlign: 'left'
      }}>
        <thead>
          <tr style={{ backgroundColor: colors.tableHeaderBg, color: colors.tableHeaderText }}>
            {headers.map((h, hIdx) => (
              <th key={hIdx} style={{
                padding: '12px 16px',
                fontWeight: '900',
                borderBottom: `2px solid ${colors.tableBorder}`,
                letterSpacing: '0.3px',
                fontSize: '0.85rem'
              }}>
                {renderInlineFormatted(h, colors)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rIdx) => (
            <tr 
              key={rIdx} 
              style={{ 
                backgroundColor: rIdx % 2 === 0 ? 'transparent' : colors.tableStripe,
                borderBottom: rIdx === rows.length - 1 ? 'none' : `1px solid ${colors.refBorder}`
              }}
            >
              {row.map((cell, cIdx) => (
                <td key={cIdx} style={{
                  padding: '12px 16px',
                  verticalAlign: 'top',
                  lineHeight: '1.65'
                }}>
                  {renderInlineFormatted(cell, colors)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Render inline markdown formatting (**bold**, *italic*, `code`, [link](url), <url>)
 */
function renderInlineFormatted(text, colors) {
  if (!text) return null;

  const parts = [];
  const regex = /(\[[^\]]+\]\([^)]+\)|<https?:\/\/[^>]+>|https?:\/\/[^\s)]+|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  
  let lastIndex = 0;
  let match;
  let keyIdx = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const token = match[0];

    // Markdown Link [Label](url)
    if (token.startsWith('[') && token.includes('](')) {
      const linkMatch = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        parts.push(
          <a
            key={keyIdx++}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: colors.link,
              fontWeight: '700',
              textDecoration: 'underline',
              wordBreak: 'break-all'
            }}
          >
            {linkMatch[1]}
          </a>
        );
      }
    } 
    // Tagged URL <http://...>
    else if (token.startsWith('<') && token.endsWith('>')) {
      const url = token.slice(1, -1);
      parts.push(
        <a
          key={keyIdx++}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: colors.link,
            fontWeight: '700',
            textDecoration: 'underline',
            wordBreak: 'break-all'
          }}
        >
          {url}
        </a>
      );
    }
    // Plain URL
    else if (token.startsWith('http://') || token.startsWith('https://')) {
      parts.push(
        <a
          key={keyIdx++}
          href={token}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: colors.link,
            fontWeight: '700',
            textDecoration: 'underline',
            wordBreak: 'break-all'
          }}
        >
          {token}
        </a>
      );
    }
    // Bold **text**
    else if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={keyIdx++} style={{ fontWeight: '800', color: colors.heading }}>
          {token.slice(2, -2)}
        </strong>
      );
    }
    // Italic *text*
    else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={keyIdx++} style={{ fontStyle: 'italic' }}>
          {token.slice(1, -1)}
        </em>
      );
    }
    // Code `text`
    else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={keyIdx++}
          style={{
            backgroundColor: colors.codeBg,
            padding: '2px 6px',
            borderRadius: '6px',
            fontSize: '0.9em',
            fontFamily: 'monospace',
            color: colors.heading,
            border: `1px solid ${colors.refBorder}`
          }}
        >
          {token.slice(1, -1)}
        </code>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}
