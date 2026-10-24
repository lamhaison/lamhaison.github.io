# Vocabulary Entry Format Documentation

## Overview

The vocabulary entries use an enriched markdown format that is fully supported by the `build-questions.mjs` parser. Each vocabulary file contains structured entries with metadata, pronunciation, definitions, and examples.

## File Structure

### Frontmatter (YAML)

```yaml
---
sections: [Languages]
id: american-oxford-3000-0001-0100
pageUrl: https://www.oxfordlearnersdictionaries.com/about/oxford3000
pageLabel: Oxford 3000 (American English) - Words 1-100
tags: [english, american, oxford, 3000, common, word, language, words-0001-0100]
---
```

**Fields:**
- `sections`: Searchable category (e.g., "Languages")
- `id`: Unique file identifier (slug format)
- `pageUrl`: Source URL for this vocabulary set
- `pageLabel`: Display label for the page
- `tags`: Search keywords and categorization

### Question Header

```markdown
## Q: **[english - american - oxford - 3000 - words - 0001-0100] Oxford 3000 Most Common American English Words (0001-0100)?**
```

**Format:**
- `## Q: **[tags] Question?**`
- Tags separated by `-` or `+` (optional, can be empty)
- Tags can be empty: `## Q: **[] Question?**`

### Introduction/Context

```markdown
Words 1 to 100 from the Oxford 3000 list - the 3000 most important words to learn in English from A1 to B2 level.
```

Optional introductory text describing the vocabulary set.

## Entry Format

Each vocabulary entry follows this structure:

```markdown
## NUMBER. WORD

<br>

- Type: Word Class (abbreviation)
- CEFR Level: A1|A2|B1|B2
- IPA (US): /pronunciation/
- English Meaning:
  - Definition 1
  - Definition 2 (optional)
- Vietnamese Meaning:
  - Translation 1
  - Translation 2 (optional)
- Common Collocations:
  - collocation 1
  - collocation 2
  - collocation 3
- Example:
  - Example sentence 1
  - Example sentence 2 (optional)
- Example Translation:
  - Vietnamese translation of example
  - Translation 2 (optional)
```

## Supported Fields

### Required Fields

1. **Type** - Word class with abbreviation
   - Examples: `Noun (n.)`, `Verb (v.)`, `Adjective (adj.)`, `Adverb (adv.)`, `Preposition (prep.)`, `Conjunction (conj.)`, `Article (art.)`, `Pronoun (pron.)`

2. **CEFR Level** - Common European Framework of Reference level
   - Values: `A1`, `A2`, `B1`, `B2`
   - A1: Elementary/Beginner
   - A2: Elementary/Pre-intermediate
   - B1: Intermediate
   - B2: Upper-intermediate

3. **IPA (US)** - International Phonetic Alphabet (US English pronunciation)
   - Format: `/phonetic/` or `/phonetic1/, /phonetic2/` for alternatives
   - Example: `/əˈɡen/, /əˈɡeɪn/`

4. **English Meaning** - Definition(s) in English
   - Can have multiple definitions (one per sub-bullet)
   - Keep definitions clear and concise

5. **Vietnamese Meaning** - Translation to Vietnamese
   - Provides bilingual support
   - Can have multiple translations

6. **Example** - Contextual usage example
   - Complete sentence showing the word in context
   - Can have multiple examples

7. **Example Translation** - Vietnamese translation of the example
   - Direct translation of the example sentence

### Optional Fields

- **Common Collocations** - Frequently occurring word combinations
  - List of common phrases using the word
  - Helps learners see the word in typical contexts

## Parsing Features

### Markdown Support

✅ **Nested Bullet Lists**
- Top-level field definitions (`- Type:`, `- CEFR Level:`, etc.)
- Sub-bullets under each field (indented with spaces)
  ```markdown
  - English Meaning:
    - Definition 1
    - Definition 2
  ```

✅ **Multi-line Fields**
- Fields with colons followed by content on next lines
- Proper indentation for nested bullets

✅ **HTML Rendering**
- Converts to semantic HTML for browser display
- Headers: `## word` → `<h2>word</h2>`
- Lists: `- item` → `<ul><li>item</li></ul>`
- Preserves nested structure

✅ **Plain Text Extraction**
- For search indexing
- Strips HTML/markdown formatting
- Combines all text for full-text search

## Example Entry (Complete)

```markdown
## 60. again

<br>

- Type: Adverb (adv.)
- CEFR Level: A1
- IPA (US): /əˈɡen/, /əˈɡeɪn/
- English Meaning:
  - One more time.
  - In return; as a response.
- Vietnamese Meaning:
  - Lại; một lần nữa.
  - Lại nữa; thêm lần nữa.
- Common Collocations:
  - try again
  - never again
  - once again
  - again and again
- Example:
  - Please say that again.
  - Can we go there again this summer?
- Example Translation:
  - Xin vui lòng nói lại lần nữa.
  - Chúng ta có thể đi đó lần nữa vào mùa hè này không?
```

## Build Pipeline Integration

### File Naming Convention

- **Active files**: `filename.doc.md` → Indexed and searchable
- **Draft files**: `filename.doc.draft.md` → Preserved but not indexed

### Build Process

1. **Scan Phase**: `build-questions.mjs` scans all `.doc.md` files
2. **Parse Phase**: Extracts frontmatter and question headers
3. **Render Phase**: Converts markdown to HTML and plain text
4. **Index Phase**: Generates `data/questions.json` with searchable entries
5. **Deploy Phase**: JSON loaded by browser for search functionality

### Build Command

```bash
make build
```

This:
1. Runs `node scripts/build-questions.mjs` to generate search index
2. Runs `node scripts/check-search.mjs` to validate entries
3. Updates `data/questions.json`
4. Can be deployed to GitHub Pages

## Best Practices

### Writing Definitions
- Clear, concise language
- Avoid circular definitions
- Include context when helpful
- Multiple definitions if the word has different meanings

### IPA Pronunciation
- Include both /initial/ and /alternative/ pronunciations if common
- Use correct IPA symbols
- Verify against authoritative sources (Oxford, Cambridge dictionaries)

### Examples
- Real-world contexts
- Natural, commonly-used sentences
- Not overly complex
- Related to the word's definition
- Include Vietnamese translation for learners

### Collocations
- Common word combinations specific to this word
- Phrases that native speakers actually use
- Include prepositions and objects
- 3-5 examples is typical

### Bilingual Content
- Consistent translation quality
- Cultural appropriateness
- Vietnamese conventions respected
- Technical terms accurately rendered

## Validation

### Automated Checks (make build)
- ✅ Frontmatter YAML validity
- ✅ Markdown structure integrity
- ✅ Header pattern recognition
- ✅ Tag extraction
- ✅ Search index generation

### Manual Review
- Verify IPA accuracy
- Check translation quality
- Confirm example appropriateness
- Validate collocation selection
- Review for consistency

## Reactivating Vocabulary

When vocabulary is ready for search indexing:

1. Rename `.doc.draft.md` to `.doc.md`:
   ```bash
   for file in american-oxford-3000-*.doc.draft.md; do
     mv "$file" "${file%.doc.draft.md}.doc.md"
   done
   ```

2. Rebuild search index:
   ```bash
   make build
   ```

3. Commit changes:
   ```bash
   git add content/skill/languages/english/
   git commit -m "feat: activate Oxford 3000 vocabulary in search index"
   git push
   ```

4. Deploy to GitHub Pages (automatic via GitHub Actions)

## Troubleshooting

### Build Fails - "No Q header"
- Ensure file has a proper question header: `## Q: **[tags] Question?**`
- Tags can be empty: `## Q: **[] Question?**`

### Entries Not Showing
- Check file extension is `.doc.md` (not `.doc.draft.md`)
- Verify frontmatter is valid YAML
- Run `make build` to regenerate index

### Formatting Issues
- Ensure proper indentation (2-4 spaces for sub-bullets)
- Check for consistent bullet markers (`-` not `*`)
- Verify colons after field names: `- Type:`

### Search Not Finding Results
- Check that tag slugification matches expectations
- Verify plain text extraction in `data/questions.json`
- Run `make build` after making changes

## Related Files

- [`/scripts/build-questions.mjs`](/scripts/build-questions.mjs) - Parser and builder
- [`/data/questions.json`](/data/questions.json) - Generated search index
- [`/assets/score.mjs`](/assets/score.mjs) - Browser-side search engine

## Version History

- **v1.0** - Initial enriched format with 8 fields
  - Type, CEFR Level, IPA, English Meaning, Vietnamese Meaning, Example, Example Translation
  - Support for nested bullets and multi-line fields
  - Bilingual vocabulary support

- **Future Enhancements**
  - Additional fields (etymology, frequency, related words)
  - Multiple pronunciations by dialect
  - Interactive examples
  - Etymology information
  - Word families
  - Frequency statistics
