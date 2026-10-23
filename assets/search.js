import { filterQuestions, highlight } from './score.mjs';

const input = document.querySelector('#q');
const count = document.querySelector('#count');
const sectionsEl = document.querySelector('#sections');
const resultsEl = document.querySelector('#results');
const tocNav = document.querySelector('#toc-nav');
const generated = document.querySelector('#generated');
const sourceLink = document.querySelector('#source-link');

const state = {
  questions: [],
  sections: [],
  section: 'all',
  query: '',
  open: new Set(),
};

function readUrl() {
  const params = new URLSearchParams(location.search);

  state.query = params.get('q') || '';
  state.section = params.get('section') || 'all';

  const hash = location.hash.replace(/^#/, '');
  if (hash) state.open.add(decodeURIComponent(hash));
}

function writeUrl() {
  const params = new URLSearchParams();

  if (state.query) params.set('q', state.query);
  if (state.section !== 'all') {
    params.set('section', state.section);
  }

  const next =
    `${location.pathname}` +
    `${params.toString() ? `?${params}` : ''}` +
    `${location.hash}`;

  history.replaceState(null, '', next);
}

function visible() {
  return filterQuestions(state.questions, {
    query: state.query,
    section: state.section,
  });
}

function groupId(section) {
  return (
    'group-' +
    section
      .toLowerCase()
      .replace(/&/g, '-and-')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  );
}

function revealGroup(section) {
  const heading = document.getElementById(groupId(section));

  if (heading) {
    heading.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    markToc();
    return;
  }

  state.section = section;
  writeUrl();
  render();

  const next = document.getElementById(groupId(section));

  if (
    next &&
    resultsEl.querySelector(
      `article[data-section="${CSS.escape(section)}"]`
    )
  ) {
    next.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}

function revealQuestion(id) {
  const shown = visible().some(
    (question) => question.id === id
  );

  if (!shown) {
    state.query = '';
    state.section = 'all';
    input.value = '';
    writeUrl();
  }

  state.open.add(id);

  history.replaceState(
    null,
    '',
    `${location.pathname}${location.search}#${id}`
  );

  render();

  document
    .getElementById(id)
    ?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
}

function renderToc() {
  tocNav.replaceChildren();

  for (const section of state.sections) {
    const questions = state.questions.filter(
      (question) => question.section === section
    );

    const block = document.createElement('div');
    block.className = 'toc-block';

    const head = document.createElement('a');
    head.className = 'toc-group';
    head.href = `#${groupId(section)}`;
    head.dataset.section = section;

    const name = document.createElement('span');
    name.textContent = section;

    const total = document.createElement('span');
    total.className = 'toc-count';
    total.textContent = String(questions.length);

    head.append(name, total);

    head.addEventListener('click', (event) => {
      event.preventDefault();
      revealGroup(section);
    });

    const list = document.createElement('div');

    let lastSub = '';
    let lastPath = '';

    for (const question of questions) {
      // Extract folder structure tags (first tags that aren't document-specific)
      // These are typically: [folder1, folder2, folder3, ...]
      const pathTags = question.tags.slice(0, 3).join(' / ');

      // Show path separator when path changes
      if (pathTags && pathTags !== lastPath) {
        const path = document.createElement('p');
        path.className = 'toc-path';
        path.textContent = pathTags;
        list.append(path);
        lastPath = pathTags;
      }

      if (
        question.subsection &&
        question.subsection !== lastSub
      ) {
        const sub = document.createElement('p');

        sub.className = 'toc-sub';
        sub.textContent = question.subsection;

        list.append(sub);

        lastSub = question.subsection;
      }

      const item = document.createElement('a');
      item.className = 'toc-question';
      item.href = `#${question.id}`;
      item.dataset.id = question.id;
      item.textContent = question.question;
      item.title = question.question;

      item.addEventListener('click', (event) => {
        event.preventDefault();
        revealQuestion(question.id);
      });

      list.append(item);
    }

    block.append(head, list);
    tocNav.append(block);
  }
}

let markedQuestion = '';

function showQuestionInToc(link) {
  const toc = tocNav.closest('.toc');

  if (!toc || !link) return;

  const linkRect = link.getBoundingClientRect();
  const tocRect = toc.getBoundingClientRect();

  if (
    linkRect.top >= tocRect.top &&
    linkRect.bottom <= tocRect.bottom
  ) {
    return;
  }

  toc.scrollTop +=
    linkRect.top -
    tocRect.top -
    toc.clientHeight / 3;
}

function markToc() {
  const hash = decodeURIComponent(
    location.hash.replace(/^#/, '')
  );

  let current = '';

  if (state.section !== 'all') {
    current = state.section;
  }

  const line = 180;

  for (const heading of resultsEl.querySelectorAll('.group-heading')) {
    if (
      heading.getBoundingClientRect().top <= line
    ) {
      current = heading.dataset.section;
    }
  }

  if (!current) {
    current =
      resultsEl.querySelector('.group-heading')
        ?.dataset.section || '';
  }

  for (const link of tocNav.querySelectorAll('.toc-group')) {
    link.setAttribute(
      'aria-current',
      String(link.dataset.section === current)
    );
  }

  let currentLink = null;

  for (const link of tocNav.querySelectorAll('.toc-question')) {
    const selected = link.dataset.id === hash;

    link.setAttribute(
      'aria-current',
      String(selected)
    );

    if (selected) {
      currentLink = link;
    }
  }

  if (hash !== markedQuestion) {
    markedQuestion = hash;
    showQuestionInToc(currentLink);
  }
}

function renderSections() {
  const buttons = [
    ['all', 'All'],
    ...state.sections.map((name) => [name, name]),
  ];

  sectionsEl.replaceChildren(
    ...buttons.map(([value, label]) => {
      const button = document.createElement('button');

      button.type = 'button';
      button.className = 'chip';
      button.textContent = label;

      button.setAttribute(
        'aria-pressed',
        String(state.section === value)
      );

      button.addEventListener('click', () => {
        state.section = value;
        writeUrl();
        render();
      });

      return button;
    })
  );
}

function questionLink(id) {
  const url = new URL(location.href);

  url.search = '';
  url.hash = id;

  return url.toString();
}

function answerLines(html) {
  const root = document.createElement('div');
  root.innerHTML = html || '';

  const lines = [];

  const add = (text) => {
    const line = text.replace(/\s+/g, ' ').trim();
    if (line) lines.push(line);
  };

  for (const node of root.children) {
    const tag = node.tagName;

    if (tag === 'UL' || tag === 'OL') {
      let index = 0;

      for (const item of node.children) {
        if (item.tagName !== 'LI') continue;

        index += 1;

        add(
          `${tag === 'OL' ? `${index}.` : '-'} ${item.textContent}`
        );
      }
    } else if (
      tag === 'TABLE' ||
      node.querySelector('table')
    ) {
      const table =
        tag === 'TABLE'
          ? node
          : node.querySelector('table');

      for (const row of table.querySelectorAll('tr')) {
        const cells = [...row.children]
          .map((cell) =>
            cell.textContent.replace(/\s+/g, ' ').trim()
          )
          .filter(Boolean);

        if (cells.length) {
          lines.push(cells.join(' | '));
        }
      }
    } else {
      add(node.textContent);
    }
  }

  return lines;
}

function questionDetail(question) {
  const lines = [question.question];

  if (question.answerHtml) {
    lines.push(...answerLines(question.answerHtml));
  } else if (question.answerText) {
    lines.push(question.answerText.trim());
  }

  if (question.pageUrl) {
    lines.push(
      `${question.pageLabel || question.pageUrl} | ${question.pageUrl}`
    );
  }

  lines.push(`Related FAQ: ${questionLink(question.id)}`);

  return lines.join('\n');
}

function escapeHtml(value) {
  return String(value).replace(
    /[&<>]/g,
    (ch) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
    })[ch]
  );
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/"/g, '&quot;');
}

function questionHtml(question) {
  const link = questionLink(question.id);

  const parts = [
    `<p>${escapeHtml(question.question)}</p>`
  ];

  if (question.answerHtml) {
    parts.push(question.answerHtml);
  } else if (question.answerText) {
    parts.push(
      `<p>${escapeHtml(question.answerText)}</p>`
    );
  }

  if (question.pageUrl) {
    const label =
      question.pageLabel || question.pageUrl;

    parts.push(
      `<p><a href="${escapeAttr(question.pageUrl)}">${escapeHtml(label)}</a></p>`
    );
  }

  parts.push(
    `<p>Related FAQ: <a href="${escapeAttr(link)}">${escapeHtml(link)}</a></p>`
  );

  return parts.join('');
}

function bindCopy(
  button,
  idleText,
  idleLabel,
  readPayload
) {
  button.type = 'button';
  button.className = 'link-btn';
  button.textContent = idleText;
  button.title = idleLabel;
  button.setAttribute('aria-label', idleLabel);

  let timer = 0;

  button.addEventListener('click', async () => {
    try {
      const payload = readPayload();

      if (typeof payload === 'string') {
        await copyText(payload);
      } else {
        await copyRich(
          payload.plain,
          payload.html
        );
      }

      button.textContent = 'Copied';
      button.title = 'Copied';
      button.setAttribute(
        'aria-label',
        'Copied'
      );
      button.dataset.copied = 'true';
    } catch {
      button.textContent = 'Copy failed';
      button.title = 'Copy failed';
      button.setAttribute(
        'aria-label',
        'Copy failed'
      );
      button.dataset.copied = 'true';
    }

    window.clearTimeout(timer);

    timer = window.setTimeout(() => {
      button.textContent = idleText;
      button.title = idleLabel;
      button.setAttribute(
        'aria-label',
        idleLabel
      );
      delete button.dataset.copied;
    }, 5000);
  });
}

function copyWithField(text) {
  const field = document.createElement('textarea');

  field.value = text;
  field.setAttribute('readonly', '');
  field.style.position = 'fixed';
  field.style.left = '-9999px';

  document.body.append(field);

  field.select();

  const copied = document.execCommand('copy');

  field.remove();

  if (!copied) {
    throw new Error('Copy failed');
  }
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      copyWithField(text);
      return;
    }
  }

  copyWithField(text);
}

async function copyRich(plain, html) {
  if (
    navigator.clipboard?.write &&
    window.ClipboardItem
  ) {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': new Blob(
            [plain],
            { type: 'text/plain' }
          ),
          'text/html': new Blob(
            [html],
            { type: 'text/html' }
          ),
        }),
      ]);

      return;
    } catch {
      // The async clipboard can be blocked.
      // Fall through to a selection copy.
    }
  }

  try {
    copyHtmlSelection(html);
  } catch {
    copyWithField(plain);
  }
}

function copyHtmlSelection(html) {
  const holder =
    document.createElement('div');

  holder.setAttribute(
    'contenteditable',
    'true'
  );

  holder.style.position = 'fixed';
  holder.style.left = '0';
  holder.style.top = '0';
  holder.style.opacity = '0';

  holder.innerHTML = html;

  document.body.append(holder);

  holder.focus();

  const range = document.createRange();
  range.selectNodeContents(holder);

  const selection =
    window.getSelection();

  selection.removeAllRanges();
  selection.addRange(range);

  const copied =
    document.execCommand('copy');

  selection.removeAllRanges();

  holder.remove();

  if (!copied) {
    throw new Error('Copy failed');
  }
}


function resultArticle(question) {
  const open = state.open.has(question.id);

  const article = document.createElement('article');
  article.className = 'card';
  article.id = question.id;
  article.dataset.section = question.section;

  const top = document.createElement('div');
  top.className = 'card-top';

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'toggle-btn';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-controls', `${question.id}-answer`);
  toggle.setAttribute(
    'aria-label',
    open ? 'Hide the answer' : 'Show the answer'
  );

  const chevron = document.createElement('span');
  chevron.className = 'chevron';
  chevron.setAttribute('aria-hidden', 'true');

  toggle.append(chevron);

  toggle.addEventListener('click', () => {
    if (state.open.has(question.id))
      state.open.delete(question.id);
    else
      state.open.add(question.id);

    const nextHash = state.open.has(question.id)
      ? `#${question.id}`
      : '';

    history.replaceState(
      null,
      '',
      `${location.pathname}${location.search}${nextHash}`
    );

    render();
  });

  const text = document.createElement('div');
  text.className = 'card-text';

  const kicker = document.createElement('p');
  kicker.className = 'kicker';
  kicker.textContent =
    question.subsection
      ? `${question.section} › ${question.subsection}`
      : question.section;

  const title = document.createElement('h2');
  title.innerHTML = highlight(
    question.question,
    state.query
  );

  text.append(kicker, title);

  if (state.query.trim()) {
    const line = document.createElement('p');
    line.className = 'search-line';

    const tags = `[${question.tags.join(' • ')}]`;

    line.innerHTML = highlight(
      tags,
      state.query
    );

    text.append(line);
  }

  const actions = document.createElement('div');
  actions.className = 'card-actions';

  const detail =
    document.createElement('button');

  bindCopy(
    detail,
    '⧉',
    `Copy the question and answer: ${question.question}`,
    () => ({
      plain: questionDetail(question),
      html: questionHtml(question),
    })
  );

  const link =
    document.createElement('button');

  bindCopy(
    link,
    '🔗',
    `Copy link to: ${question.question}`,
    () => questionLink(question.id)
  );

  actions.append(detail, link);

  top.append(toggle, text, actions);

  article.append(top);

  if (open) {
    const body =
      document.createElement('div');

    body.className = 'answer';
    body.id = `${question.id}-answer`;

    const answer =
      document.createElement('div');

    answer.className = 'answer-body';
    answer.innerHTML = question.answerHtml;

    const more =
      document.createElement('p');

    more.className = 'more';

    if (question.pageUrl) {
      const moreLink =
        document.createElement('a');

      moreLink.href = question.pageUrl;

      moreLink.textContent =
        question.pageLabel ||
        'Open this question on the CMS FAQ';

      more.append(moreLink);
    }

    body.append(answer, more);
    article.append(body);
  }

  return article;
}

function render() {
  const hits = visible();

  const noun =
    hits.length === 1
      ? 'question'
      : 'questions';

  count.textContent = state.query
    ? `${hits.length} ${noun}`
    : `${hits.length} ${noun}`;

  renderSections();

  resultsEl.replaceChildren();

  if (!hits.length) {
    const empty =
      document.createElement('p');

    empty.className = 'empty';

    empty.textContent =
      'No question matches. Try fewer words, or raise a CMS request from the footer.';

    resultsEl.append(empty);
    return;
  }

  let lastSection = '';

  for (const question of hits) {
    if (
      !state.query &&
      question.section !== lastSection
    ) {
      const heading =
        document.createElement('h2');

      heading.className =
        'group-heading';

      heading.id = groupId(
        question.section
      );

      heading.dataset.section =
        question.section;

      heading.textContent =
        question.section;

      resultsEl.append(heading);

      lastSection = question.section;
    }

    resultsEl.append(
      resultArticle(question)
    );
  }

  markToc();
}

async function main() {
  readUrl();

  const response = await fetch(
    './data/questions.json'
  );

  if (!response.ok) {
    throw new Error(
      `Cannot load questions (${response.status})`
    );
  }

  const data =
    await response.json();

  state.questions =
    data.questions;

  state.sections = [];

  for (const question of data.questions) {
    if (
      !state.sections.includes(
        question.section
      )
    ) {
      state.sections.push(
        question.section
      );
    }
  }

  if (data.sourcePage && sourceLink) {
    sourceLink.href = data.sourcePage;
  }

  const when = data.generatedAt
    ? data.generatedAt.slice(0, 10)
    : '';

  const sha = data.sourceSha
    ? data.sourceSha.slice(0, 7)
    : '';

  generated.textContent =
    [
      when && `Index built ${when}`,
      sha && `from cms-page ${sha}`,
    ]
      .filter(Boolean)
      .join(' • ');

  renderToc();

  let ticking = false;

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;

      ticking = true;

      requestAnimationFrame(() => {
        markToc();
        ticking = false;
      });
    },
    { passive: true }
  );

  input.value = state.query;

  input.addEventListener('input', () => {
    state.query = input.value;
    writeUrl();
    render();
  });

  render();

  if (location.hash) {
    const target =
      document.getElementById(
        decodeURIComponent(
          location.hash.slice(1)
        )
      );

    target?.scrollIntoView({
      block: 'start',
    });
  }

  input.focus();
}

main().catch((error) => {
  count.textContent = error.message;
});
