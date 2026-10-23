---
section: DevOps
id: git-commit-conventions
pageUrl: https://lamhaison.github.io
pageLabel: Git Commit Conventions
tags: [git, commit, best-practices, conventions, commit-messages]
---

## Q: **[git - commit - conventions] What are the Git commit message best practices?**

Follow these conventions for clear, searchable, and maintainable commit history.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Commit Types

#### **[Add]** - New addition
Use when introducing new files or features that don't fit other categories.

```bash
git commit -m "[Add] new user authentication module"
git commit -m "[Add] database migration script for schema v2"
git commit -m "[Add] API endpoint for user profile"
```

#### **[Build]** - Build system changes
Changes affecting the build, CI/CD pipelines, or external dependencies.

```bash
git commit -m "[Build] update webpack configuration for production"
git commit -m "[Build] configure GitHub Actions workflow"
git commit -m "[Build] add Docker build multi-stage optimization"
```

#### **[Chore]** - Dependency updates
Updates to dependencies, tooling, or maintenance tasks.

```bash
git commit -m "[Chore] upgrade npm dependencies to latest versions"
git commit -m "[Chore] update Python package requirements"
git commit -m "[Chore] bump Node.js version to 18.x"
```

#### **[CiCd]** - CI/CD pipeline changes
Continuous integration and continuous delivery related changes.

```bash
git commit -m "[CiCd] add automated deployment pipeline"
git commit -m "[CiCd] configure test coverage reporting"
git commit -m "[CiCd] add pre-commit linting hooks"
```

#### **[Docs]** - Documentation updates
Updates to README, markdown files, or code comments.

```bash
git commit -m "[Docs] update installation instructions in README"
git commit -m "[Docs] add API documentation for authentication"
git commit -m "[Docs] improve code comments for utility functions"
```

#### **[Feat]** - New feature
A new feature is introduced with the changes.

```bash
git commit -m "[Feat] implement dark mode toggle"
git commit -m "[Feat] add search functionality with filters"
git commit -m "[Feat] support OAuth2 authentication"
```

#### **[Fix]** - Bug fix
A bug fix has occurred.

```bash
git commit -m "[Fix] resolve memory leak in event listener cleanup"
git commit -m "[Fix] correct calculation in billing module"
git commit -m "[Fix] handle null reference in data parser"
```

#### **[Improvement]** - Enhancement
Improvements or enhancements to existing functionality.

```bash
git commit -m "[Improvement] enhance search performance with caching"
git commit -m "[Improvement] optimize database queries for reports"
git commit -m "[Improvement] streamline user onboarding flow"
```

#### **[Perf]** - Performance improvements
Optimizations that improve speed or resource usage.

```bash
git commit -m "[Perf] reduce bundle size by 40%"
git commit -m "[Perf] optimize image loading with lazy loading"
git commit -m "[Perf] cache API responses for 5 minutes"
```

#### **[Refactor]** - Code refactoring
Refactored code that neither fixes a bug nor adds a feature.

```bash
git commit -m "[Refactor] extract duplicate logic into helper functions"
git commit -m "[Refactor] simplify conditional statements with early returns"
git commit -m "[Refactor] reorganize module structure for clarity"
```

#### **[Release]** - Release notes
Version release or release-related changes.

```bash
git commit -m "[Release] v1.2.0 - add authentication and performance improvements"
git commit -m "[Release] v2.0.0 - breaking: migrate to new API schema"
```

#### **[Remove]** - Removal
Remove functions, temporary files, deprecated code, or unused features.

```bash
git commit -m "[Remove] delete deprecated API endpoints"
git commit -m "[Remove] clean up temporary test fixtures"
git commit -m "[Remove] remove legacy browser compatibility code"
```

#### **[Revert]** - Revert previous commit
Reverts a previous commit (use sparingly, prefer explicit fixes).

```bash
git commit -m "[Revert] revert '[Feat] add A/B testing feature' (caused production issue)"
git commit -m "[Revert] revert commit abc1234 due to merge conflict"
```

#### **[Style]** - Code formatting
Related to code formatting such as whitespace, missing semi-colons, and similar cosmetic changes.

```bash
git commit -m "[Style] format code with Prettier"
git commit -m "[Style] add missing semicolons"
git commit -m "[Style] adjust indentation for consistency"
```

#### **[Test]** - Testing changes
Including new, correcting previous, or improving tests.

```bash
git commit -m "[Test] add unit tests for payment module"
git commit -m "[Test] fix flaky integration test for API"
git commit -m "[Test] increase test coverage to 85%"
```

#### **[Update]** - General updates
General updates or changes that don't fit specific categories.

```bash
git commit -m "[Update] change user profile default avatar"
git commit -m "[Update] modify configuration for staging environment"
git commit -m "[Update] refresh vendor libraries"
```

### Best Practices

1. **Use imperative mood** - "add feature" not "added feature"
2. **Keep subject line under 50 characters** - Concise and scannable
3. **Separate subject from body with blank line** - Easier to read in logs
4. **Wrap body at 72 characters** - Better formatted in terminals
5. **Explain what and why, not how** - Implementation details should be clear from code
6. **Use lowercase for type** - Consistency across commits
7. **No period at end of subject** - Convention in many projects
8. **Reference issues and PRs** - Link to tracking systems: "Fixes #123" or "Relates to PR #456"

### Extended Commit Example

```bash
git commit -m "[Feat] add OAuth2 authentication support

- Implement Google OAuth2 provider integration
- Add JWT token generation and validation
- Support refresh token rotation for security
- Create user session management module

Closes #234
Relates to milestone v2.0
```

### Conventional Commits Standard

For stricter formatting, use Conventional Commits format:

```bash
git commit -m "feat(auth): add OAuth2 support

Implement OAuth2 authentication with Google provider.
Supports automatic token refresh and secure session handling.

BREAKING CHANGE: Legacy token format is no longer supported
Closes #234
```

### Commit Frequency

- **Frequent, logical commits** - One feature/fix per commit when possible
- **Atomic changes** - Each commit should be independently deployable
- **Meaningful history** - Commits tell a story of development decisions

### Tools to Help

- **commitizen** - Interactive commit message generator
- **husky + lint-staged** - Enforce commit message standards
- **conventional-commits** - Strict format validation
- **git-aliases** - Create shortcuts for common patterns

Example `.gitconfig` alias:

```bash
git config --global alias.feat '!git commit -m "[Feat]"'
git config --global alias.fix '!git commit -m "[Fix]"'
git config --global alias.docs '!git commit -m "[Docs]"'
```

Usage:
```bash
git feat "add new login form"    # [Feat] add new login form
git fix "handle null pointer"    # [Fix] handle null pointer
git docs "update API reference"  # [Docs] update API reference
```
