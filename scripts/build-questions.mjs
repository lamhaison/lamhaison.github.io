#!/usr/bin/env node
// Turn cms-page content/tenants/help/faq.mdx into data/questions.json.
// Each accordion becomes one searchable question line:
// [section-tag - synonym - synonym] the question the tenant would type?

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const FAQ_PAGE = 'https://github.com/lamhaison/lamhaison.github.io/docs/tenants/help/faq/';
const SITE_ORIGIN = 'https://github.com/lamhaison/lamhaison.github.io';
const SOURCE_PATH = 'content/tenants/help/faq.mdx';

function fold(value) {
  return String(value).toLowerCase().replace(/[—–]/g, '-');
}

function slug(value) {
  return fold(value)
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function unique(values) {
  const seen = new Set();
  const out = [];
  for (const value of values) {
    if (!value || seen.has(value)) continue;
    seen.add(value);
    out.push(value);
  }
  return out;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function rewriteUrl(url) {
  if (!url.startsWith('/')) return url;
  if (url.startsWith('/docs/') || url.startsWith('/data/'))
    return `${SITE_ORIGIN}${url}`;
  return url;
}

function inline(raw) {
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`/g;
  let last = 0;
  let match;
  const parts = [];

  while ((match = re.exec(raw))) {
    parts.push(escapeHtml(raw.slice(last, match.index)));

    if (match[1] !== undefined) {
      parts.push(`<a href="${escapeHtml(rewriteUrl(match[2]))}">${escapeHtml(match[1])}</a>`);
    } else if (match[3] !== undefined) {
      parts.push(`<strong>${escapeHtml(match[3])}</strong>`);
    } else {
      parts.push(`<code>${escapeHtml(match[4])}</code>`);
    }

    last = match.index + match[0].length;
  }

  parts.push(escapeHtml(raw.slice(last)));
  return parts.join('');
}

function isTableSeparator(line) {
  return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
}

function parseTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function renderMarkdown(src) {
  const text = src
    .replace(/<Callout type="[^"]*">/g, '\n:::callout\n')
    .replace(/<\/Callout>/g, '\n:::\n')
    .replace(/\r\n/g, '\n')
    .trim();

  if (!text) return '';

  const lines = text.split('\n');
  const html = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i += 1;
      continue;
    }

    // Handle markdown headers
    const h1 = line.match(/^#\s+(.+)$/);
    const h2 = line.match(/^##\s+(.+)$/);
    const h3 = line.match(/^###\s+(.+)$/);
    const h4 = line.match(/^####\s+(.+)$/);
    const h5 = line.match(/^#####\s+(.+)$/);
    const h6 = line.match(/^######\s+(.+)$/);

    if (h1) {
      html.push(`<h1>${inline(h1[1])}</h1>`);
      i += 1;
      continue;
    }

    if (h2) {
      html.push(`<h2>${inline(h2[1])}</h2>`);
      i += 1;
      continue;
    }

    if (h3) {
      html.push(`<h3>${inline(h3[1])}</h3>`);
      i += 1;
      continue;
    }

    if (h4) {
      html.push(`<h4>${inline(h4[1])}</h4>`);
      i += 1;
      continue;
    }

    if (h5) {
      html.push(`<h5>${inline(h5[1])}</h5>`);
      i += 1;
      continue;
    }

    if (h6) {
      html.push(`<h6>${inline(h6[1])}</h6>`);
      i += 1;
      continue;
    }

    if (line.trim() === ':::callout') {
      i += 1;

      const buf = [];
      while (i < lines.length && lines[i].trim() !== ':::') {
        buf.push(lines[i]);
        i += 1;
      }

      if (i < lines.length && lines[i].trim() === ':::') i += 1;

      html.push(
        `<aside class="callout">${renderMarkdown(buf.join('\n'))}</aside>`
      );
      continue;
    }

    if (line.trim().startsWith('```')) {
      const match = line.trim().match(/^```(\w*)/);
      const language = match ? match[1] : '';
      i += 1;

      const codeLines = [];
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i += 1;
      }

      if (i < lines.length && lines[i].trim().startsWith('```')) i += 1;

      const code = escapeHtml(codeLines.join('\n'));
      const langClass = language ? ` class="language-${language}"` : '';
      html.push(
        `<pre><code${langClass}>${code}</code></pre>`
      );
      continue;
    }

    if (line.includes('|') && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const header = parseTableRow(line);
      i += 2;

      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(parseTableRow(lines[i]));
        i += 1;
      }

      const head = header
        .map((cell) => `<th>${inline(cell)}</th>`)
        .join('');

      const body = rows
        .map(
          (row) =>
            `<tr>${row.map((cell) => `<td>${inline(cell)}</td>`).join('')}</tr>`
        )
        .join('');

      html.push(
        `<div class="table-wrap"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`
      );
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items = [];

      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(
          `<li>${inline(lines[i].replace(/^\s*[-*]\s+/, ''))}</li>`
        );
        i += 1;
      }

      html.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items = [];

      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(
          `<li>${inline(lines[i].replace(/^\s*\d+\.\s+/, ''))}</li>`
        );
        i += 1;
      }

      html.push(`<ol>${items.join('')}</ol>`);
      continue;
    }

    const buf = [line.trim()];
    i += 1;

    while (i < lines.length && lines[i].trim()) {
      const next = lines[i];

      if (next.trim() === ':::callout' || next.trim() === ':::') break;
      if (/^\s*[-*]\s+/.test(next) || /^\s*\d+\.\s+/.test(next)) break;

      if (
        next.includes('|') &&
        i + 1 < lines.length &&
        isTableSeparator(lines[i + 1])
      ) break;

      buf.push(next.trim());
      i += 1;
    }

    html.push(`<p>${inline(buf.join(' '))}</p>`);
  }

  return html.join('\n');
}

function plainText(markdown) {
  return markdown
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseFaq(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');

  let section = '';
  let subsection = '';

  const questions = [];

  const accordionRe =
    /<Accordion id="([^"]+)" title="([^"]+)">([\s\S]*?)<\/Accordion>/g;

  let match;

  const headingAt = [];

  lines.forEach((line, index) => {
    const h2 = /^##\s+(.+)$/.exec(line);
    const h3 = /^###\s+(.+)$/.exec(line);

    if (h2) headingAt.push({
      index,
      level: 2,
      text: h2[1].trim()
    });

    if (h3) headingAt.push({
      index,
      level: 3,
      text: h3[1].trim()
    });
  });

  function headingFor(offset) {
    const prefix = markdown.slice(0, offset);
    const lineNo = prefix.split('\n').length - 1;

    let currentSection = '';
    let currentSubsection = '';

    for (const heading of headingAt) {
      if (heading.index > lineNo) break;

      if (heading.level === 2) {
        currentSection = heading.text;
        currentSubsection = '';
      } else {
        currentSubsection = heading.text;
      }
    }

    return {
      section: currentSection,
      subsection: currentSubsection
    };
  }

  while ((match = accordionRe.exec(markdown))) {
    const id = match[1];
    const question = match[2];
    const body = match[3].trim();

    ({ section, subsection } = headingFor(match.index));

    const tags = unique([
      slug(section),
      slug(subsection),
    ]);

    const searchLine =
      `[${tags.join(' • ')}] ${question}`;

    questions.push({
      id,
      order: questions.length,
      section,
      subsection: subsection || '',
      tags,
      question,
      searchLine,
      answerText: plainText(body),
      answerHtml: renderMarkdown(body),
      pageUrl: `${FAQ_PAGE}#${id}`,
      pageLabel: 'Open this question on the CMS FAQ'
    });
  }

  return questions;
}

function parseFrontMatter(markdown) {
  if (!markdown.startsWith('---\n')) {
    return { meta: {}, body: markdown.trim() };
  }

  const end = markdown.indexOf('\n---\n', 4);

  if (end < 0) {
    return { meta: {}, body: markdown.trim() };
  }

  const meta = {};

  for (const line of markdown.slice(4, end).split('\n')) {
    const match = /^([a-z0-9-]+):\s*(.*)$/.exec(line);
    if (match) {
      const key = match[1];
      const value = match[2].trim();
      
      // Parse YAML array format: [item1, item2, item3]
      if ((key === 'tags' || key === 'sections' || key === 'subsections') && value.startsWith('[') && value.endsWith(']')) {
        meta[key] = value
          .slice(1, -1)
          .split(',')
          .map(item => item.trim())
          .filter(item => item);
      } else {
        meta[key] = value;
      }
    }
  }

  return {
    meta,
    body: markdown.slice(end + 5).trim()
  };
}

function parseDocQuestions(markdown, fallbackId, filePath = '') {
  const { meta, body } = parseFrontMatter(markdown);

  // Support both single value and array for section/subsection
  // Normalize to arrays for consistent handling
  let sections = [];
  if (meta.sections) {
    sections = Array.isArray(meta.sections) ? meta.sections : [meta.sections];
  } else if (meta.section) {
    sections = [meta.section];
  } else {
    sections = ['More questions'];
  }

  let subsections = [];
  if (meta.subsections) {
    subsections = Array.isArray(meta.subsections) ? meta.subsections : [meta.subsections];
  } else if (meta.subsection) {
    subsections = [meta.subsection];
  }

  // Extract subsection from folder path if not in frontmatter
  if (subsections.length === 0 && filePath) {
    const pathSubsection = getPathSubsection(filePath, sections[0] || 'More questions');
    if (pathSubsection) {
      subsections = [pathSubsection];
    }
  }

  // Find all Q: headers (tags in [] can be empty)
  const questionPattern = /^##\s+Q:\s+\*\*\[([^\]]*)\]\s+(.+?)\*\*\s*$/gm;
  const matches = [...body.matchAll(questionPattern)];

  if (matches.length === 0) {
    throw new Error(`No Q header in ${fallbackId}`);
  }

  const questions = [];
  let questionIndex = 0;

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const question = match[2].trim();
    
    // Answer is from end of Q: header until start of next Q: header or end of content
    const answerStart = match.index + match[0].length;
    const nextMatch = matches[i + 1];
    const answerEnd = nextMatch ? nextMatch.index : body.length;
    const answer = body.slice(answerStart, answerEnd).trim();

    // Extract tags from question header: [tag1 - tag2 - tag3] or [tag1 + tag2]
    const headerTagsStr = match[1].trim();
    const headerTags = headerTagsStr
      .split(/\s*[-+]\s*/)  // Split on - or + with optional whitespace
      .map(tag => tag.trim())
      .filter(tag => tag)
      .map(tag => slug(tag));

    // Combine all four tag sources:
    // 1. Frontmatter tags (highest priority)
    // 2. All sections from frontmatter
    // 3. All subsections from frontmatter
    // 4. Tags from question header
    const tags = unique([
      ...(Array.isArray(meta.tags) ? meta.tags.map(tag => slug(tag)) : []),
      ...sections.map(s => slug(s)),
      ...subsections.map(s => slug(s)),
      ...headerTags,
    ]);

    // Generate question ID from the question text itself
    // Sanitize question by slugifying it (lowercase, remove special chars, replace spaces with hyphens)
    let questionId = slug(question);
    
    // If no valid ID from question, fall back to meta.id or fallbackId
    if (!questionId) {
      questionId = meta.id || fallbackId;
    }

    // Use primary section (first one) and primary subsection (first one)
    // For backward compatibility with single-value queries
    questions.push({
      id: questionId,
      section: sections[0] || 'More questions',
      subsection: subsections[0] || '',
      sections: sections,           // NEW: array of all sections
      subsections: subsections,     // NEW: array of all subsections
      tags,
      question,
      searchLine: `[${tags.join(' • ')}] ${question}`,
      answerText: plainText(answer),
      answerHtml: renderMarkdown(answer),
      pageUrl: meta.pageUrl || '',
      pageLabel: meta.pageLabel || 'Open the source',
    });

    questionIndex++;
  }

  return questions;
}

function getPathTags(filePath) {
  // Extract folder structure for tags
  // e.g., "content/devops/scm/git/git-commands-reference.doc.md"
  // → ["devops", "scm", "git"]
  const parts = filePath.split('/');
  const contentIndex = parts.indexOf('content');
  
  if (contentIndex === -1) return [];
  
  // Get folders between 'content' and the filename
  const folderParts = parts.slice(contentIndex + 1, -1);
  return folderParts.map(part => slug(part));
}

function getPathSubsection(filePath, section) {
  // Extract subsection from folder structure based on section
  // e.g., "content/devops/scm/git/git-commands-reference.doc.md"
  // with section "DevOps" → "scm" (first folder after content/)
  // 
  // e.g., "content/devops/databases/memory_dbs/redis/redis.doc.md"
  // with section "DevOps" → "databases" (first folder after content/)
  
  if (!section) return '';
  
  const parts = filePath.split('/');
  const contentIndex = parts.indexOf('content');
  
  if (contentIndex === -1) return '';
  
  // Get folders between 'content' and the filename
  const folderParts = parts.slice(contentIndex + 1, -1);
  
  if (folderParts.length === 0) return '';
  
  // The subsection is the first folder after 'content' that's not the section itself
  // e.g., in [devops, scm, git], section is DevOps (matches "devops")
  // so subsection is "scm" (next folder)
  const sectionSlug = slug(section);
  
  for (let i = 0; i < folderParts.length; i++) {
    if (slug(folderParts[i]) === sectionSlug) {
      // Found section folder, next folder is subsection
      if (i + 1 < folderParts.length) {
        return folderParts[i + 1].charAt(0).toUpperCase() + 
               folderParts[i + 1].slice(1).replace(/_/g, ' ');
      }
      break;
    }
  }
  
  return '';
}

function walkDocFiles(dir, contentDir = null) {
  const files = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name);
    const relPath = contentDir ? fullPath.replace(contentDir, '') : fullPath;
    
    if (entry.isDirectory()) {
      files.push(...walkDocFiles(fullPath, contentDir || dir));
    } else if (entry.name.endsWith('.doc.md')) {
      files.push({ fullPath, relPath });
    }
  }

  return files;
}

function loadExtraQuestions() {
  const dir = resolve(
    dirname(fileURLToPath(import.meta.url)),
    '../content'
  );

  let files = [];

  try {
    files = walkDocFiles(dir).sort((a, b) => a.relPath.localeCompare(b.relPath));
  } catch {
    return [];
  }

  return files.map(({ fullPath, relPath }) => {
    const markdown = readFileSync(fullPath, 'utf8');
    const fallbackId = relPath.replace(/^\//, '').replace(/\.doc\.md$/, '');
    const pathTags = getPathTags(fullPath);
    
    // Parse potentially multiple questions from file
    const questionList = parseDocQuestions(markdown, fallbackId, fullPath);
    
    // Merge path-based tags with each question's tags
    questionList.forEach(question => {
      question.tags = unique([
        ...pathTags,
        ...question.tags,
      ]);
      
      // Update search line with combined tags
      question.searchLine = `[${question.tags.join(' • ')}] ${question.question}`;
    });
    
    return questionList;
  }).flat();  // Flatten array of arrays into single array
}

function insertBySection(questions, extra) {
  let at = questions.length;

  questions.forEach((question, index) => {
    if (question.section === extra.section) {
      at = index + 1;
    }
  });

  questions.splice(at, 0, extra);
}

function usage() {
  console.error(
    'Usage: node scripts/build-questions.mjs [--sha <commit>]'
  );
  process.exit(1);
}

const args = process.argv.slice(2);

const shaFlag = args.indexOf('--sha');
const sourceSha = shaFlag >= 0 ? args[shaFlag + 1] : '';

// Start with questions from .doc.md files only
const questions = [];

for (const extra of loadExtraQuestions()) {
  questions.push(extra);
}

if (questions.length === 0) {
  console.error('No questions found in content/*.doc.md files.');
  process.exit(1);
}

questions.forEach((question, index) => {
  question.order = index;
});

const payload = {
  generatedAt: new Date().toISOString(),
  sourceRepo:
    'https://github.com/lamhaison/lamhaison.github.io',
  sourcePath: SOURCE_PATH,
  sourceSha: sourceSha || '',
  sourcePage: FAQ_PAGE,
  questions,
};

const outDir = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../data'
);

mkdirSync(outDir, { recursive: true });

const outFile = resolve(outDir, 'questions.json');

writeFileSync(
  outFile,
  `${JSON.stringify(payload, null, 2)}\n`
);

console.log(
  `Wrote ${questions.length} questions to ${outFile}`
);