---
section: DevOps
id: git-commands-reference
pageUrl: https://lamhaison.github.io
pageLabel: Git Commands Reference
tags: [git, commands, reference, scm, version-control, cheatsheet]
---

## Q: **[git - commands - reference] What are the essential Git commands and their usage?**

Comprehensive reference for Git commands organized by category with real-world examples.

### Staging & Committing

#### `git add`
Add changes from working directory to staging area (Index).

```bash
git add <file>          # Stage specific file
git add .               # Stage all changes
git add -A              # Stage all changes including deletions
git add -p              # Stage changes interactively (patch mode)
```

#### `git commit`
Save staged changes as a permanent snapshot with a message.

```bash
git commit -m "[Feat] add user authentication"
git commit -am "Update documentation"
git commit --amend                  # Modify the last commit
git commit --amend --no-edit        # Add to last commit without changing message
```

### Viewing Changes

#### `git diff`
Compare changes between working directory, staging area, and commits.

```bash
git diff                       # Unstaged changes since last commit
git diff --cached              # Staged changes (same as --staged)
git diff --staged              # Staged changes ready to commit
git diff HEAD                  # All changes since last commit
git diff master...contrib      # Changes in contrib branch vs master
git diff --word-diff           # Show changes at word level
git diff <commit1> <commit2>   # Compare two commits
```

#### `git log`
Display commit history with filtering and formatting options.

```bash
git log                                      # Full commit history
git log --oneline                            # Condensed format
git log -n 5                                 # Last 5 commits
git log --author=<author>                    # Commits by specific author
git log --since="2 weeks ago"                # Commits since date
git log --until="1 week ago"                 # Commits until date
git log --grep=<pattern>                     # Commits matching pattern
git log --follow <file>                      # History of file (including renames)
git log -p -- <file_path>                    # Changes to specific file
git log A..B                                 # Commits in B but not in A
git log --left-right A...B                   # Commits in A or B but not both
git log --abbrev-commit --no-merges          # Exclude merge commits
git log --pretty="format:%h %G? %aN   %s"   # Show GPG signatures
```

### Branching

#### `git branch`
Create, list, and delete branches.

```bash
git branch                              # List local branches
git branch -a                           # List all branches (local + remote)
git branch <branch_name>                # Create new branch
git branch -d <branch_name>             # Delete branch (safe)
git branch -D <branch_name>             # Force delete branch
git branch -m <old_name> <new_name>    # Rename branch
git branch --track <branch> origin/<branch>  # Track remote branch
```

#### `git checkout`
Switch branches or restore files.

```bash
git checkout <branch>                          # Switch to branch
git checkout -b <branch>                       # Create and switch to branch
git checkout -b <branch> origin/<remote_branch> # Create from remote branch
git checkout -- <file>                         # Discard changes to file
git checkout <commit> -- <file>               # Restore file from commit
```

#### `git switch`
Modern alternative to checkout (Git 2.23+).

```bash
git switch <branch>            # Switch to branch
git switch -c <branch>         # Create and switch to branch
git switch -                   # Switch to previous branch
```

### Merging & Rebasing

#### `git merge`
Combine branch history into current branch.

```bash
git merge <branch>                          # Simple merge
git merge --no-ff <branch>                  # Create merge commit
git merge --no-commit --squash <branch>     # Squash commits into one
git merge --abort                           # Cancel merge with conflicts
git merge --continue                        # Continue merge after resolving conflicts
git merge --strategy-option=ours            # Keep current version on conflicts
```

#### `git rebase`
Reapply commits on top of another branch (rewrites history).

```bash
git rebase <branch>                     # Rebase current branch
git rebase -i HEAD~3                    # Interactive rebase last 3 commits
git rebase --continue                   # Continue after resolving conflicts
git rebase --abort                      # Cancel rebase
git rebase --skip                       # Skip current commit during rebase
```

### Stashing

#### `git stash`
Temporarily save changes without committing.

```bash
git stash                               # Save current changes
git stash save "description"            # Save with description
git stash list                          # List all stashes
git stash pop                           # Apply and remove latest stash
git stash apply stash@{0}              # Apply stash without removing
git stash drop stash@{0}               # Delete specific stash
git stash clear                         # Delete all stashes
```

### Remote Operations

#### `git fetch`
Download changes from remote repository (no merge).

```bash
git fetch                               # Fetch from default remote
git fetch <remote>                      # Fetch from specific remote
git fetch --all                         # Fetch from all remotes
git fetch origin                        # Fetch from origin
git fetch origin refs/pull/958/head     # Fetch specific pull request
git fetch ../commits.bundle <branch>    # Fetch from bundle file
```

#### `git pull`
Fetch and merge changes from remote (fetch + merge).

```bash
git pull                                # Fetch and merge from remote
git pull origin <branch>                # Pull specific branch
git pull --rebase                       # Fetch and rebase instead of merge
```

#### `git push`
Upload commits to remote repository.

```bash
git push                                # Push to default remote
git push origin <branch>                # Push specific branch
git push origin --all                   # Push all branches
git push origin --tags                  # Push all tags
git push origin <branch> --force        # Force push (use carefully)
git push -u origin <branch>             # Push and set upstream
```

#### `git remote`
Manage remote repository references.

```bash
git remote                              # List remotes
git remote -v                           # List remotes with URLs
git remote add <name> <url>             # Add remote
git remote remove <name>                # Remove remote
git remote rename <old> <new>           # Rename remote
git remote set-url <name> <new_url>     # Change remote URL
```

### History Inspection

#### `git rev-parse`
Get commit information and references.

```bash
git rev-parse develop                   # Get commit hash for branch
git rev-parse --abbrev-ref HEAD         # Get current branch name
git rev-parse HEAD                      # Get full hash of HEAD
```

#### `git show`
Display specific commit content.

```bash
git show <commit>                       # Show commit details
git show <commit>:<file>                # Show file at specific commit
```

### Advanced Operations

#### `git cherry-pick`
Apply specific commits to current branch.

```bash
git cherry-pick <commit>                # Apply commit
git cherry-pick <commit1> <commit2>     # Apply multiple commits
git cherry-pick <commit>~..<commit>     # Apply range of commits
git cherry-pick --continue              # Continue after resolving conflicts
git cherry-pick --abort                 # Cancel cherry-pick
```

#### `git bisect`
Binary search through commits to find bug introduction.

```bash
git bisect start                        # Start bisect session
git bisect bad HEAD                     # Mark current as bad
git bisect good <commit>                # Mark commit as good
git bisect reset                        # Exit bisect mode
```

#### `git clean`
Remove untracked files from working directory.

```bash
git clean -n                            # Preview what would be deleted
git clean -f                            # Delete untracked files
git clean -fd                           # Delete untracked files and directories
git clean -fX                           # Delete only ignored files
```

#### `git archive`
Create archive (zip, tar) of project snapshot.

```bash
git archive HEAD --format=zip > project.zip
git archive <branch> --format=tar.gz > archive.tar.gz
git archive <branch> --prefix='project/' --format=zip > $(git describe <branch>).zip
```

#### `git bundle`
Package commits for transfer (useful offline).

```bash
git bundle create commits.bundle master ^9a466c5
git bundle create repo.bundle HEAD master
git bundle list-heads ../commits.bundle     # List branches in bundle
git bundle verify ../commits.bundle         # Verify bundle validity
git fetch ../commits.bundle <branch>        # Fetch from bundle
git clone repo.bundle repo                  # Clone from bundle
```

### Configuration

#### `git config`
Set Git configuration options globally or per-repository.

```bash
# Identity
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Editor
git config --global core.editor vim
git config --global core.pager less

# Colors
git config --global color.ui true
git config --global color.ui false         # Disable colors

# GPG Signing
git config --global user.signingkey <gpg-key-id>
git config commit.gpgsign true              # Enable signing
git config commit.gpgsign false             # Disable signing
git config --global gpg.program "$(which gpg)"

# Submodules
git config --global submodule.recurse false
git config --global diff.submodule log
git config -f .gitmodules submodule.[name].branch develop

# Aliases (shortcuts)
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config alias.sdiff '!'"git diff && git submodule foreach 'git diff'"
git config alias.spush 'push --recurse-submodules=on-demand'
git config alias.supdate 'submodule update --remote --merge'

# View configuration
git config --list                           # Show all settings
git config --global --list                  # Show global settings
git config --global --edit                  # Edit global config
git config --global --unset <key>          # Unset specific setting
```

### Tags

#### `git tag`
Create and manage version tags.

```bash
git tag                                 # List all tags
git tag <tag_name>                      # Create lightweight tag
git tag -a <tag_name> -m "message"     # Create annotated tag
git tag -a v1.2 9fceb02                # Tag specific commit
git tag -d <tag_name>                  # Delete tag locally
git push origin <tag_name>              # Push specific tag
git push origin --tags                  # Push all tags
```

### Undoing Changes

#### Undo Strategies

```bash
# Discard changes (unstaged)
git checkout -- <file>
git restore <file>                      # Modern syntax

# Unstage changes
git reset HEAD <file>
git restore --staged <file>             # Modern syntax

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Revert specific commit (create new commit)
git revert <commit>

# Revert to specific commit
git reset --hard <commit>
```

### Useful Patterns

#### Check what needs to be merged

```bash
git log --abbrev-commit --no-merges your_branch..origin/master
git log -n <number> your_branch..origin/master
```

#### See remote references

```bash
git ls-remote                           # All refs
git ls-remote | grep pull               # Pull requests
git ls-remote origin                    # Branch refs
```

#### Track remote branch

```bash
git checkout -b [local_branch] [remote]/[branch]
git branch --track <branch> origin/<branch>
```

#### Sync with remote after others pushed

```bash
git fetch origin
git merge origin/master
git push
```

#### View all changes before push

```bash
git diff --cached HEAD
git log origin/master..HEAD             # Commits not in remote
```

### Best Practices

1. **Commit often** - Logical, atomic commits are easier to review and debug
2. **Write meaningful messages** - Follow commit message conventions
3. **Pull before push** - Sync with remote before pushing
4. **Use branches** - Develop features on separate branches
5. **Review before committing** - Use `git diff` to verify changes
6. **Clean up branches** - Delete merged branches to keep repo tidy
7. **Sign commits** - Use GPG signing for security
8. **Use tags for releases** - Annotated tags for production versions
9. **Document workflow** - Keep team aligned on branching strategy
10. **Backup before force push** - `--force` rewrites history, be careful

### Common Workflows

#### Feature Branch Workflow
```bash
git checkout -b feature/my-feature       # Create feature branch
# Make changes...
git add .
git commit -m "[Feat] implement feature"
git push -u origin feature/my-feature
# Create pull request
# After review and merge:
git checkout main
git pull origin main
git branch -d feature/my-feature
```

#### Release Branch Workflow
```bash
git checkout -b release/v1.0             # Create release branch
# Fix bugs only
git commit -m "[Fix] critical bug"
git push origin release/v1.0
# After testing:
git checkout main
git merge --no-ff release/v1.0
git tag -a v1.0 -m "Release v1.0"
git push origin main --tags
```

#### Hotfix Workflow
```bash
git checkout -b hotfix/critical-bug      # Branch from main
git commit -m "[Fix] critical production issue"
git push origin hotfix/critical-bug
# Create pull request
# After merge and testing:
git tag -a v1.0.1 -m "Hotfix v1.0.1"
git push origin v1.0.1
```
