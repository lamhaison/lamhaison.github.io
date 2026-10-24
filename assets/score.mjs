// Same idea as this_question_menu_v1: a question is one line of tags plus text.
// Every whitespace-separated word must appear in the tags, the question, the
// section, or the answer. Title and tag hits rank above answer-only hits.

export function fold(value) {
  return String(value).toLowerCase().replace(/[—–]/g, '-');
}

export function tokenize(query) {
  return fold(query)
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2 || /^\d+$/.test(token));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Simple suffix-stripping stemmer for better partial matching
// Strips common plural/verb suffixes
function stem(word) {
  // Remove common suffixes
  if (word.endsWith('ies')) return word.slice(0, -3);
  if (word.endsWith('es')) return word.slice(0, -2);
  if (word.endsWith('s')) return word.slice(0, -1);
  if (word.endsWith('ed')) return word.slice(0, -2);
  if (word.endsWith('ing')) return word.slice(0, -3);
  return word;
}

// Levenshtein distance - calculates minimum edits needed to transform one string to another
// Used for fuzzy matching to tolerate typos
function levenshteinDistance(a, b) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// Check if token fuzzy-matches a word (within edit distance)
// E.g., "rediss" matches "redis" (1 edit distance)
function isFuzzyMatch(token, word, maxDistance = 1) {
  // Only use fuzzy matching for queries of reasonable length
  if (token.length < 3) return false;
  
  const distance = levenshteinDistance(token, word);
  
  // Allow up to 2 edits for reasonable typo tolerance
  // But require word length to be similar (prevent false positives)
  const lengthDiff = Math.abs(token.length - word.length);
  
  // Stricter: max 1 edit for short words, max 2 for longer words
  const maxEdit = token.length > 6 ? 2 : 1;
  
  return distance > 0 && distance <= maxEdit && lengthDiff <= 2;
}

// Check if token fuzzy-matches any word in haystack
function occursWithFuzzy(haystack, token) {
  const words = haystack.split(/[^a-z0-9]+/);
  
  for (const word of words) {
    if (word && isFuzzyMatch(token, word)) {
      return true;
    }
  }
  
  return false;
}

function occurs(haystack, token) {
  let from = 0;

  while (from < haystack.length) {
    const at = haystack.indexOf(token, from);

    if (at < 0) return false;

    const before =
      at === 0 || /[^a-z0-9]/.test(haystack[at - 1]);

    const after =
      at + token.length === haystack.length ||
      /[^a-z0-9]/.test(haystack[at + token.length]);

    if (before && after) return true;

    from = at + 1;
  }

  return false;
}

// Check if token matches word in haystack using stemming
// E.g., "window" matches "windows" by comparing stems
function occursWithStemming(haystack, token) {
  const tokenStem = stem(token);
  
  // Extract words from haystack and compare stems
  const words = haystack.split(/[^a-z0-9]+/);
  
  for (const word of words) {
    if (word && stem(word) === tokenStem) {
      return true;
    }
  }
  
  return false;
}

// Check if token is a prefix of any word in haystack
// E.g., "dev" matches "devops", "sto" matches "storage"
function occursAsPrefix(haystack, token) {
  // Only use prefix matching for shorter tokens (2-3 chars)
  // to avoid matching too many results with very short prefixes
  if (token.length > 3) return false;
  
  const words = haystack.split(/[^a-z0-9]+/);
  
  for (const word of words) {
    if (word && word.startsWith(token)) {
      return true;
    }
  }
  
  return false;
}

function scoreOne(question, tokens, rawQuery) {
  const title = fold(question.question);
  const tags = fold(question.tags.join(' '));
  const group = fold(
    `${question.section} ${question.subsection || ''}`
  );
  const answer = fold(question.answerText || '');

  let score = 0;

  for (const token of tokens) {
    const inTitle = occurs(title, token);
    // Try 4 strategies in order (most to least strict):
    // 1. Exact match (full word boundaries)
    // 2. Stemming match (plural/verb forms)
    // 3. Prefix match (partial category names like "dev" → "devops")
    // 4. Fuzzy match (typo tolerance like "rediss" → "redis")
    const inTags = occurs(tags, token) || 
                   occursWithStemming(tags, token) || 
                   occursAsPrefix(tags, token) ||
                   occursWithFuzzy(tags, token);
    const inGroup = occurs(group, token) || 
                    occursWithStemming(group, token) || 
                    occursAsPrefix(group, token) ||
                    occursWithFuzzy(group, token);
    const inAnswer = occurs(answer, token);

    if (!inTitle && !inTags && !inGroup && !inAnswer) {
      return 0;
    }

    if (inTitle) {
      score += 50;
    } else if (inTags) {
      score += 30;
    } else if (inGroup) {
      score += 20;
    } else {
      score += 5;
    }
  }

  const phrase = fold(rawQuery).trim();

  if (phrase.length > 2 && title.includes(phrase)) {
    score += 40;
  }

  return score;
}

export function filterQuestions(
  questions,
  { query = '', section = 'all' } = {}
) {
  let list = questions;

  if (section && section !== 'all') {
    list = list.filter(
      (question) => {
        // Support both new 'sections' array and legacy 'section' single value
        const sections = question.sections || [question.section];
        return sections.includes(section);
      }
    );
  }

  const tokens = tokenize(query);

  if (!tokens.length) {
    return list.slice();
  }

  return list
    .map((question) => ({
      question,
      score: scoreOne(question, tokens, query),
    }))
    .filter((hit) => hit.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.question.order - b.question.order
    )
    .map((hit) => hit.question);
}

export function highlight(text, query) {
  const tokens = tokenize(query);

  if (!tokens.length) {
    return escapeHtml(text);
  }

  const folded = fold(text);
  const ranges = [];

  for (const token of tokens) {
    const tokenStem = stem(token);
    let from = 0;

    // First try exact matches
    while (from < folded.length) {
      const at = folded.indexOf(token, from);

      if (at < 0) break;

      const before =
        at === 0 || /[^a-z0-9]/.test(folded[at - 1]);

      const after =
        at + token.length === folded.length ||
        /[^a-z0-9]/.test(folded[at + token.length]);

      if (before && after) {
        ranges.push([at, at + token.length]);
      }

      from = at + token.length;
    }

    // Then try stemming matches (highlight the stem part of longer words)
    from = 0;
    while (from < folded.length) {
      const at = folded.indexOf(tokenStem, from);

      if (at < 0) break;

      const before =
        at === 0 || /[^a-z0-9]/.test(folded[at - 1]);

      if (before) {
        // Find the end of the word
        let wordEnd = at + tokenStem.length;
        while (
          wordEnd < folded.length &&
          /[a-z0-9-]/.test(folded[wordEnd])
        ) {
          wordEnd++;
        }

        // Check if stemming actually finds a match
        const word = folded.slice(at, wordEnd);
        if (stem(word) === tokenStem && word !== token) {
          // Highlight only the stem part (not the suffix)
          ranges.push([at, at + tokenStem.length]);
        }
      }

      from = at + 1;
    }

    // Then try prefix matches for short tokens (highlight the matching prefix)
    if (token.length <= 3) {
      from = 0;
      while (from < folded.length) {
        const at = folded.indexOf(token, from);

        if (at < 0) break;

        const before =
          at === 0 || /[^a-z0-9]/.test(folded[at - 1]);

        if (before) {
          // Find the end of the word
          let wordEnd = at + token.length;
          while (
            wordEnd < folded.length &&
            /[a-z0-9-]/.test(folded[wordEnd])
          ) {
            wordEnd++;
          }

          // Check if this is a prefix match (not already matched by exact/stemming)
          const word = folded.slice(at, wordEnd);
          if (word.length > token.length && word.startsWith(token)) {
            // Highlight only the prefix part
            ranges.push([at, at + token.length]);
          }
        }

        from = at + 1;
      }
    }
  }

  if (!ranges.length) {
    return escapeHtml(text);
  }

  ranges.sort((a, b) =>
    a[0] - b[0] || b[1] - a[1]
  );

  const merged = [];

  for (const range of ranges) {
    const last = merged[merged.length - 1];

    if (!last || range[0] > last[1]) {
      merged.push([range[0], range[1]]);
    } else {
      last[1] = Math.max(last[1], range[1]);
    }
  }

  let html = '';
  let cursor = 0;

  for (const [start, end] of merged) {
    html += escapeHtml(text.slice(cursor, start));
    html +=
      `<mark>${escapeHtml(text.slice(start, end))}</mark>`;
    cursor = end;
  }

  html += escapeHtml(text.slice(cursor));

  return html;
}