# Multiple Questions in Single File

## Overview

A single `.doc.md` file can contain **multiple searchable questions**. This is useful when you want to group related content under one file.

## How It Works

The parser (`build-questions.mjs`) looks for `## Q:` headers to detect questions. Each `## Q:` header creates one searchable entry.

**Key Rules:**
1. Each question needs a `## Q:` header with format: `## Q: **[tags] Question Text?**`
2. Content/answer follows immediately after the header
3. Next question's `## Q:` header marks the end of previous question's answer
4. **IMPORTANT:** If you have only ONE `## Q:` header, any content you add will become the answer to that question

## Format

### Single Question File

```markdown
---
sections: [Languages]
id: my-content
tags: [keyword1, keyword2]
---

## Q: **[tag1 - tag2] What is this?**

Answer content here.

This can be multiple paragraphs.

- Lists
- Are supported
- As well
```

**Result:** 1 searchable question

### Multiple Questions File

```markdown
---
sections: [Languages]
id: my-content
tags: [keyword1, keyword2]
---

## Q: **[tag1 - tag2] First Question?**

Answer to first question here.

---

## Q: **[tag1 - tag2] Second Question?**

Answer to second question here.

---

## Q: **[tag1 - tag2] Third Question?**

Answer to third question here.
```

**Result:** 3 searchable questions

## Important Notes

### ⚠️ Empty Answers

If you have a `## Q:` header with NO content after it, the parser will create a question with an empty answer:

```markdown
## Q: **[tags] Question?**

← No content after header means empty answer
```

This is usually NOT what you want. Always provide content after each `## Q:` header.

### ✅ Proper Separation

Use a clear separator (like `---`) to visually separate questions:

```markdown
## Q: **[tags] First Question?**

Answer content...

---

## Q: **[tags] Second Question?**

Answer content...
```

### 🔍 How Tags Work

Each file has TWO types of tags:

1. **Frontmatter tags** (inherit to all questions)
   ```yaml
   tags: [keyword1, keyword2]
   ```

2. **Question header tags** (specific to that question)
   ```markdown
   ## Q: **[specific-tag1 - specific-tag2] Question?**
   ```

**Final tag set = Frontmatter tags + Question header tags**

### Example: Vocabulary File with Multiple Levels

```markdown
---
sections: [Languages]
id: oxford-3000-vocabulary
tags: [english, american, oxford, 3000]
---

## Q: **[level-0 - unknown] Unknown Words (Level 0)?**

Words at level 0 (never seen before):

### Word 1
Definition and examples...

### Word 2
Definition and examples...

---

## Q: **[level-1 - familiar] Familiar Words (Level 1)?**

Words at level 1 (seen but not understood):

### Word 1
Definition and examples...

### Word 2
Definition and examples...

---

## Q: **[level-2 - passive] Passive Vocabulary (Level 2)?**

Words at level 2 (understand but can't use):

### Word 1
Definition and examples...

### Word 2
Definition and examples...
```

**Result:** 3 searchable questions, each tagged with its own level

## Debugging

### Problem: Question Not Appearing in Search

**Cause 1:** Missing `## Q:` header
- **Solution:** Add `## Q: **[tags] Question?**`

**Cause 2:** Empty answer
- **Solution:** Add content after the header

**Cause 3:** Question header syntax error
- **Correct:** `## Q: **[tags] Question?**`
- **Wrong:** `## Q: [tags] Question?` (missing `**`)
- **Wrong:** `## Q [tags] Question?` (missing colon)

### Problem: Too Many Duplicate Questions

**Cause:** Multiple files with same `id` in frontmatter
- **Solution:** Use unique `id` for each file, or combine into one file with multiple questions

## Build Pipeline

When you run `make build`:

1. Scanner finds all `.doc.md` files
2. For each file:
   - Parse frontmatter (id, tags, pageUrl, pageLabel)
   - Find all `## Q:` headers
   - For each header:
     - Extract question text and tags
     - Capture answer content (until next `## Q:` or EOF)
     - Create searchable question object
3. All questions compiled into `data/questions.json`
4. Search index rebuilt

## Examples from Codebase

### ✅ Good: Multiple Questions

File: `001-american-oxford-3000-level-1-familiar.doc.md`
```
- 2 `## Q:` headers
- Each with content (vocabulary entries)
- Produces 2 searchable questions
```

### ❌ Problem: Empty Answer

File: `001-american-oxford-3000-level-0-unknow.doc.md`
```
- 1 `## Q:` header
- NO content after header
- Question appears in search but with empty answer
```

### ✅ Ideal: Comprehensive Coverage

File: `000-how-to-classify-vocabulary.doc.md`
```
- 1 main `## Q:` header
- Lots of content (explanation with sections, code blocks, etc.)
- Produces 1 comprehensive searchable question
```

## Best Practices

1. **One main topic per file** - Use one `## Q:` for main content
2. **Multiple levels per file** - Use multiple `## Q:` for different classifications
3. **Always provide answers** - Every `## Q:` needs content
4. **Clear tags** - Use consistent tag naming across related questions
5. **Visual separation** - Use `---` to separate questions visually
6. **Related content** - Keep related questions in same file for context

## See Also

- [VOCABULARY_FORMAT.md](./VOCABULARY_FORMAT.md) - Vocabulary entry format
- [SEARCH_HIGHLIGHTING.md](./SEARCH_HIGHLIGHTING.md) - Search features
