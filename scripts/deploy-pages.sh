#!/usr/bin/env bash

# Publish the static site to the gh-pages branch.
# 
# GitHub Pages serves this repository from the gh-pages branch.
# Publishing always comes from main. The branch is force-pushed over the live site,
# so there is no preview deploy from a feature branch. Local work is stashed for
# the duration rather than published.
#
# Usage:
#   ./scripts/deploy-pages.sh          # Publish current main commit
#   ./scripts/deploy-pages.sh --force  # Force-publish (idempotent)
#
set -euo pipefail

branch=gh-pages
source_branch=main
base_path="/"
force=false

for argument in "$@"; do
  case "$argument" in
    --force) force=true ;;
    *)
      echo "Unknown option: $argument. Only --force is understood." >&2
      exit 2
      ;;
  esac
done

root=$(git rev-parse --show-toplevel)
worktree=""
stashed=false

cleanup() {
  if [ -n "$worktree" ]; then
    git -C "$root" worktree remove --force "$worktree" 2>/dev/null || true
    rm -rf "$worktree"
  fi

  if [ "$stashed" = true ]; then
    if git -C "$root" stash pop --quiet >/dev/null 2>&1; then
      echo "✓ Local changes restored."
    else
      git -C "$root" reset --hard --quiet HEAD
      echo "⚠ Local changes clash with $source_branch, staying in stash." >&2
      echo "  Run: git stash pop" >&2
    fi
  fi
}

trap cleanup EXIT

current_branch=$(git -C "$root" rev-parse --abbrev-ref HEAD)

if [ "$current_branch" != "$source_branch" ]; then
  echo "✗ On $current_branch, but deploy publishes $source_branch only." >&2
  echo "  Run: git switch $source_branch" >&2
  exit 1
fi

git -C "$root" fetch origin

if [ -n "$(git -C "$root" ls-files --unmerged)" ]; then
  echo "✗ Merge conflict: cannot stash over unmerged index." >&2
  exit 1
fi

if [ -n "$(git -C "$root" status --porcelain)" ]; then
  git -C "$root" stash push --quiet --include-untracked \
    --message "deploy-pages: set aside for a deploy"
  stashed=true
  echo "✓ Local changes stashed."
fi

if ! git -C "$root" merge --ff-only --quiet "origin/$source_branch" >/dev/null 2>&1; then
  echo "✗ $source_branch cannot fast-forward onto origin/$source_branch." >&2
  echo "  Local commits exist. Push or drop them, then deploy again." >&2
  exit 1
fi

commit=$(git -C "$root" rev-parse --short HEAD)
head_commit=$(git -C "$root" rev-parse HEAD)

# Check if this commit was already published
published=$(
  git -C "$root" log -1 --format=%s "refs/remotes/origin/$branch" 2>/dev/null \
    | grep -oE 'publish [0-9a-f]{7,40}' \
    | tail -n 1 | cut -d' ' -f2 || true
)

if [ -n "$published" ] && [ "$force" = false ]; then
  if [ "$head_commit" = "$published" ]; then
    echo "ℹ $branch already publishes $commit, which is current main." >&2
    echo "  Nothing new to deploy. Use --force to publish again." >&2
    exit 0
  fi
fi

if [ ! -f "$root/index.html" ]; then
  echo "✗ No index.html to publish." >&2
  exit 1
fi

worktree=$(mktemp -d)

# Create or update worktree for gh-pages branch
if git -C "$root" show-ref --verify --quiet "refs/remotes/origin/$branch"; then
  git -C "$root" worktree add --quiet \
    --force -B "$branch" "$worktree" \
    "refs/remotes/origin/$branch" || \
  git -C "$root" worktree add --quiet \
    --force --orphan -b "$branch" "$worktree"
fi

# Clear worktree and copy built site
find "$worktree" -mindepth 1 \
  ! -name .git -exec rm -rf {} + 2>/dev/null || true

cp "$root/index.html" "$worktree/"
cp -R "$root/assets" "$worktree/"
cp "$root/data" "$worktree/" 2>/dev/null || true
cp "$root/nojekyll" "$worktree/.nojekyll" 2>/dev/null || true

# Inject base href for GitHub Pages serving at /<owner>/<repo>/
# This keeps relative URLs working when deployed to the subpath
awk -v base="$base_path" '
  /<head>/ && !done {
    print
    print "  <base href=\"" base "\">"
    done = 1
    next
  }
  { print }
' "$worktree/index.html" > "$worktree/index.html.tmp"

mv "$worktree/index.html.tmp" "$worktree/index.html"

# Stage and commit
git -C "$worktree" add --all

if git -C "$worktree" diff --cached --quiet; then
  echo "✓ Site matches $branch, nothing to publish."
  exit 0
fi

git -C "$worktree" commit --quiet \
  --message "site: publish $commit"

# Push with buffer for HTTP proxies (same as cms-page)
GIT_HTTP_POSTBUFFER=157286400 git -C "$worktree" push --quiet --force origin "$branch"

echo "✓ Deployed $commit to $branch"