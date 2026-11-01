# Search Keyword Highlighting Feature

## Overview

The search functionality now highlights matching keywords **everywhere they appear** in search results:
- ✅ In question titles
- ✅ In tags  
- ✅ **NEW:** In answer/content body

## How It Works

### Keyword Matching Strategy

The search uses a four-tier matching approach:

1. **Exact Match**: Full word boundaries (e.g., "python" matches "Python" but not "pythonic")
2. **Stemming Match**: Plural/verb forms (e.g., "run" matches "runs", "running")
3. **Prefix Match**: Category names (e.g., "dev" matches "devops")
4. **Fuzzy Match**: Typo tolerance (e.g., "rediss" matches "redis" with 1 edit distance)

### Visual Highlighting

All matches are highlighted with:
- **Background color**: Yellow (`--mark: #ffe08a`)
- **Element**: `<mark>` HTML tag
- **Styling**: Defined in `assets/search.css` (lines 353-358)

### Answer Content Highlighting

When you expand a search result's answer:

1. The system checks if you have an active search query
2. If yes, it processes the answer HTML content
3. It highlights matching keywords while **preserving HTML structure**:
   - Lists, tables, code blocks stay intact
   - Links and formatting are preserved
   - Only text nodes are processed

## Technical Details

### New Functions in `assets/search.js`

#### `highlightInHtml(html, query)`

Highlights matching keywords in HTML content while preserving structure.

**Parameters:**
- `html` (string): HTML content to process
- `query` (string): Search query

**Returns:** HTML string with highlighted matches wrapped in `<mark>` tags

**How it works:**
```javascript
1. Parse HTML into DOM tree
2. Walk through all text nodes
3. For each text node:
   - Use existing highlight() function from score.mjs
   - Replace matching text with <mark> tags
   - Preserve all HTML elements and attributes
4. Return processed HTML
```

**Safety features:**
- Skips `<script>` and `<style>` tags
- Uses `DOMParser` for safe HTML parsing
- Array.from() to avoid live collection issues
- Doesn't double-highlight or corrupt markup

#### `escapeHtml(value)`

Safely escapes HTML special characters to prevent injection.

**Used for:** Comparing escaped text to detect changes

## Examples

### Example 1: Vocabulary Search

**Search term:** `vocabulary`

**Result card before expansion:**
```
Title: Oxford 3000 - Level 2
Tags: [english, vocabulary, oxford]
```
→ Both title (if matched) and tags highlight "vocabulary"

**Answer after expansion (with highlighting):**
```
This vocabulary section contains the most common words in English.

- Learn vocabulary efficiently
- Practice English pronunciation
- Build your vocabulary with examples
```
→ All three instances of "vocabulary" in the answer are highlighted with yellow background

### Example 2: Grammar Search

**Search term:** `tense`

**Title:** "How to understand verb tense"
→ "tense" highlighted in title

**Tags:** [english, grammar, verbs, tense]
→ "tense" highlighted in tags

**Answer:**
```
Tense indicates when an action occurs. There are three main tenses:
- Past tense: describes completed actions
- Present tense: describes current actions  
- Future tense: describes planned actions
```
→ All four instances of "tense" (including in past/present/future) highlighted in answer

## Browser Compatibility

Works on all modern browsers:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

Uses standard APIs:
- `DOMParser` (ES5+)
- `Document.createElement()` (DOM Level 1)
- `Node.replaceChild()` (DOM Level 1)

## Performance

- Highlighting only runs when answer is expanded AND query exists
- Uses efficient DOM walking algorithm
- No regex scanning (uses exact string search from score.mjs)
- Minimal memory footprint (single-pass processing)

## Testing

### Manual Test File

Open `test-search-highlight.html` in browser to see:
- Title highlighting
- Tag highlighting  
- Answer content highlighting (new)

### Test Cases

**Test 1:** Search shows highlight in title ✓
```
Search: "python"
Result: Understanding [Python] Functions
```

**Test 2:** Search shows highlight in tags ✓
```
Search: "python"
Result: Tags: [english, programming, [python], storage]
```

**Test 3:** Search shows highlight in answer ✓
```
Search: "vocabulary"
Result: "This [vocabulary] section contains the most common words"
```

## Future Enhancements

### Possible improvements:
1. Highlight proximity scoring (boost results where keyword appears early)
2. Context snippets (show lines around matches with ellipsis)
3. Match counter (show "1 of 3 matches" for each result)
4. Search history with frecency ranking
5. Advanced search operators (AND, OR, NOT)

## Files Modified

| File | Changes |
|------|---------|
| `assets/search.js` | Added `highlightInHtml()` function, integrated into answer rendering |
| `assets/search.css` | No changes (existing `mark` styling used) |
| `test-search-highlight.html` | New test file demonstrating feature |

## Commit Reference

**Commit:** `d977ff4`
**Date:** 2026-11-01
**Message:** "feat: add keyword highlighting in search answer content"

## See Also

- [score.mjs](./assets/score.mjs) - Tokenization and highlight() function
- [search.js](./assets/search.js) - Main search UI logic
- [search.css](./assets/search.css) - Styling (includes `mark` style)
