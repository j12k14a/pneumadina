import re
import json
import os
import pypdf

pdf_path = 'C:/Users/user/Downloads/Jasmine_Redaksi_Artikel Ilmiah(English).pdf'
if not os.path.exists(pdf_path):
    pdf_path = '/mnt/c/Users/user/Downloads/Jasmine_Redaksi_Artikel Ilmiah(English).pdf'

reader = pypdf.PdfReader(pdf_path)
print('Total Pages:', len(reader.pages))

pages_raw = []
for idx, page in enumerate(reader.pages):
    txt = page.extract_text()
    pages_raw.append(txt)

full_raw = '\n\n'.join(pages_raw)

# Clean up words
words = full_raw.split()
text = ' '.join(words)

# 1. Extract Abstract
abstract = ""
abs_m = re.search(r'ABSTRACT\s+(.*?)\s+(?:Keywords?:|INTRODUCTION)', text, re.DOTALL | re.IGNORECASE)
if abs_m:
    abstract = abs_m.group(1).strip()

# 2. Extract Keywords
keywords = []
kw_m = re.search(r'Keywords?:\s*(.*?)\s+(?:INTRODUCTION|1\.\s*INTRODUCTION)', text, re.DOTALL | re.IGNORECASE)
if kw_m:
    kw_str = kw_m.group(1).strip()
    keywords = [k.strip() for k in re.split(r'[,;]', kw_str) if k.strip()]

# 3. Locate References
ref_idx = text.rfind('REFERENCES')
if ref_idx == -1:
    ref_idx = text.rfind('References')

body_text = text[:ref_idx] if ref_idx != -1 else text
references_text = text[ref_idx + len('REFERENCES'):] if ref_idx != -1 else ""

# Parse references into individual entries
# Pattern: split where there is Author Name and year like (2023) or (2024a)
raw_refs = re.split(r'(?=[A-Z][a-zA-Z\s.,&-]+?\(\d{4}[a-z]?\))', references_text)
ref_entries = []
for r in raw_refs:
    cleaned = r.strip()
    if len(cleaned) > 15:
        # Wrap URLs with markdown links
        cleaned = re.sub(r'(https?://[^\s)]+)', r'<\1>', cleaned)
        ref_entries.append(cleaned)

# Clean up body text into major sections with subheadings
body_start = body_text
if 'INTRODUCTION' in body_start:
    body_start = body_start[body_start.find('INTRODUCTION'):]
elif 'Introduction' in body_start:
    body_start = body_start[body_start.find('Introduction'):]

# Replace section titles with clean Markdown headers
formatted_body = body_start
section_replacements = [
    ('INTRODUCTION', '\n\n## 1. Introduction\n\n'),
    ('Background', '\n\n### 1.1 Background & Strategic Significance\n\n'),
    ('Problem Formulation', '\n\n### 1.2 Problem Formulation\n\n'),
    ('Research Objectives', '\n\n### 1.3 Research Objectives\n\n'),
    ('Significance of the Study', '\n\n### 1.4 Significance of the Study\n\n'),
    ('LITERATURE REVIEW', '\n\n## 2. Literature Review & Theoretical Framework\n\n'),
    ('Theoretical Framework', '\n\n### 2.1 Theoretical Framework & Deterrence Concepts\n\n'),
    ('RESEARCH METHODOLOGY', '\n\n## 3. Research Methodology\n\n'),
    ('RESEARCH METHOD', '\n\n## 3. Research Methodology\n\n'),
    ('Research Design', '\n\n### 3.1 Research Design\n\n'),
    ('Data Sources', '\n\n### 3.2 Data Sources\n\n'),
    ('Data Analysis Techniques', '\n\n### 3.3 Data Analysis Techniques\n\n'),
    ('RESULTS AND DISCUSSION', '\n\n## 4. Results and Discussion\n\n'),
    ('CONCLUSION', '\n\n## 5. Conclusion and Policy Recommendations\n\n'),
    ('POLICY RECOMMENDATIONS', '\n\n### 5.1 Strategic Policy Recommendations\n\n'),
    ('RECOMMENDATIONS', '\n\n### 5.1 Strategic Policy Recommendations\n\n'),
]

for old_sec, new_title in section_replacements:
    formatted_body = re.sub(rf'\b{old_sec}\b', new_title, formatted_body, count=1)

# Format into clean, readable paragraphs
# Split into sentences and group into 2-4 sentences per paragraph
sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+(?=[A-Z0-9])', formatted_body) if s.strip()]
paragraphs = []
temp_p = []

for s in sentences:
    if s.startswith('#'):
        if temp_p:
            paragraphs.append(' '.join(temp_p))
            temp_p = []
        paragraphs.append(s)
    else:
        temp_p.append(s)
        if len(temp_p) >= 3 or len(' '.join(temp_p)) > 350:
            paragraphs.append(' '.join(temp_p))
            temp_p = []

if temp_p:
    paragraphs.append(' '.join(temp_p))

final_body = '\n\n'.join(paragraphs)

# Assemble Complete Markdown Post
md_parts = []

# Abstract Box
if abstract:
    kw_line = ' '.join([f'`#{k}`' for k in keywords]) if keywords else '`#NatunaSea` `#MaritimeSecurity` `#Deterrence` `#UNCLOS` `#Paramadina`'
    md_parts.append(f'### Abstract\n\n> {abstract}\n\n**Keywords:** {kw_line}\n\n---\n')

# Body
md_parts.append(final_body)

# References Section formatted as numbered list
if ref_entries:
    md_parts.append('\n\n## References\n')
    for idx, ref in enumerate(ref_entries, 1):
        md_parts.append(f'{idx}. {ref}\n')

complete_markdown = '\n\n'.join(md_parts)

out_json = 'C:/Users/user/.gemini/antigravity/scratch/pnewmadina/client/src/data/jasmine_post.json'
if not os.path.exists(os.path.dirname(out_json)):
    out_json = '/mnt/c/Users/user/.gemini/antigravity/scratch/pnewmadina/client/src/data/jasmine_post.json'

post_obj = {
    'id': 1788334000000,
    'user_id': 1788332782537,
    'title': 'Strengthening Sovereignty in the North Natuna Sea: An Evaluation of Indonesia\'s Maritime Security and Deterrence Strategy',
    'slug': 'strengthening-sovereignty-in-the-north-natuna-sea-an-evaluation-of-indonesias-maritime-security-and-deterrence-strategy',
    'content': complete_markdown,
    'excerpt': 'Evaluasi komprehensif efektivitas strategi deterrence dan penegakan hukum maritim Indonesia di Laut Natuna Utara dalam menghadapi grey-zone tactics dan dark vessels berdasarkan kerangka hukum UNCLOS 1982.',
    'thumbnail': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    'status': 'published',
    'published_at': '2026-09-02T14:15:00.000Z',
    'created_at': '2026-09-02T14:15:00.000Z',
    'updated_at': None,
    'author_name': 'Shafa Nur Jasmine',
    'author_username': 'jasmine',
    'author_email': 'shafa.jasmine@students.paramadina.ac.id',
    'author_avatar': '/team/redaksi-anggota-jasmine.png',
    'author_bio': 'Editorial Division of Pneumadina • Dept. of International Relations, Paramadina University',
    'likes_count': 18,
    'comments_count': 2,
    'bookmarks_count': 7,
    'categories': [
        {
            'id': 2,
            'name': 'Non-Fiksi',
            'slug': 'non-fiksi',
            'description': 'Esai, wacana, opini, riset ilmiah, filsafat, dan ulasan kritis'
        }
    ],
    'tags': [
        {'id': 101, 'name': 'NatunaSea', 'slug': 'natunasea'},
        {'id': 102, 'name': 'MaritimeSecurity', 'slug': 'maritimesecurity'},
        {'id': 103, 'name': 'Deterrence', 'slug': 'deterrence'},
        {'id': 104, 'name': 'UNCLOS', 'slug': 'unclos'},
        {'id': 105, 'name': 'InternationalRelations', 'slug': 'internationalrelations'},
        {'id': 106, 'name': 'Paramadina', 'slug': 'paramadina'}
    ],
    'comments': [
        {
            'id': 1,
            'user_id': 1,
            'author_name': 'Admin Jawsyan Tampan',
            'content': 'Analisis komprehensif yang sangat tajam mengenai dinamika grey-zone tactics dan kelemahan koordinasi kelembagaan di Laut Natuna Utara. Selamat atas penerbitan paper ilmiah ini, Jasmine!',
            'created_at': '2026-09-02T14:20:00.000Z'
        },
        {
            'id': 2,
            'user_id': 2,
            'author_name': 'Diandra Paramadina',
            'content': 'Pendekatan UNCLOS 1982 dan konsep deterrence yang disajikan sangat relevan bagi diskursus kedaulatan maritim Indonesia modern.',
            'created_at': '2026-09-02T14:25:00.000Z'
        }
    ]
}

with open(out_json, 'w', encoding='utf-8') as f:
    json.dump(post_obj, f, ensure_ascii=False, indent=2)

print('Successfully extracted and formatted clean markdown!')
print('Content length:', len(complete_markdown))
print('Parsed references count:', len(ref_entries))
