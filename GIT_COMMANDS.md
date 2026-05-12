# Git Commands for VS Code

A comprehensive guide to using Git commands in VS Code for the Music Visualizer project.

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Daily Workflow](#daily-workflow)
3. [Common Commands](#common-commands)
4. [Branching](#branching)
5. [Undoing Changes](#undoing-changes)
6. [Troubleshooting](#troubleshooting)

---

## Initial Setup

### Step 1: Configure Git (First Time Only)

Open the terminal in VS Code (`Ctrl+`` or `Cmd+`` on Mac) and run:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Replace with your actual name and email.

### Step 2: Initialize Repository

Navigate to your project directory:

```bash
cd /path/to/music-visualizer
```

Initialize Git:

```bash
git init
```

### Step 3: Add All Files

```bash
git add .
```

This stages all files for the first commit.

### Step 4: Create Initial Commit

```bash
git commit -m "Initial commit: Music visualizer with Web Audio API"
```

### Step 5: Connect to GitHub

Go to [github.com/new](https://github.com/new) and create a new repository named `music-visualizer`. Then run:

```bash
git remote add origin https://github.com/yourusername/music-visualizer.git
git branch -M main
git push -u origin main
```

**What each command does**:
- `git remote add origin`: Connects your local repo to GitHub
- `git branch -M main`: Renames default branch to `main`
- `git push -u origin main`: Pushes code to GitHub and sets tracking

---

## Daily Workflow

### Typical Development Cycle

#### 1. Check Status

Before making changes, check what's been modified:

```bash
git status
```

**Output example**:
```
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  modified:   client/src/pages/Home.tsx
  modified:   client/src/components/CanvasVisualizer.tsx

Untracked files:
  new file:   client/src/lib/newUtility.ts
```

#### 2. Stage Changes

Stage all changes:

```bash
git add .
```

Or stage specific files:

```bash
git add client/src/pages/Home.tsx
git add client/src/components/CanvasVisualizer.tsx
```

Or use interactive staging (stage parts of files):

```bash
git add -p
```

This shows each change and asks if you want to stage it.

#### 3. Commit Changes

```bash
git commit -m "feat: add waveform timeline visualization"
```

**Commit message format** (Conventional Commits):

```
<type>: <description>

<optional body>
<optional footer>
```

**Common types**:
- `feat`: New feature
- `fix`: Bug fix
- `perf`: Performance improvement
- `refactor`: Code restructuring
- `docs`: Documentation
- `style`: Code formatting
- `test`: Tests
- `chore`: Build, dependencies

**Examples**:
```bash
git commit -m "feat: add album art color extraction"
git commit -m "fix: resolve mobile button sizing issue"
git commit -m "perf: optimize canvas rendering"
git commit -m "docs: update README with deployment guide"
```

#### 4. Push to GitHub

```bash
git push origin main
```

This uploads your commits to GitHub.

#### 5. Verify on GitHub

Go to `https://github.com/yourusername/music-visualizer` and verify your changes appear.

---

## Common Commands

### View Commit History

See all commits:

```bash
git log
```

See last 5 commits:

```bash
git log -5
```

See commits with changes:

```bash
git log -p
```

See commits in one line:

```bash
git log --oneline
```

### View Differences

See what changed since last commit:

```bash
git diff
```

See what's staged:

```bash
git diff --staged
```

See changes in a specific file:

```bash
git diff client/src/pages/Home.tsx
```

### Undo Changes

Discard changes in a file (before staging):

```bash
git checkout -- client/src/pages/Home.tsx
```

Unstage a file:

```bash
git reset HEAD client/src/pages/Home.tsx
```

Undo last commit (keep changes):

```bash
git reset --soft HEAD~1
```

Undo last commit (discard changes):

```bash
git reset --hard HEAD~1
```

### Pull Latest Changes

Get updates from GitHub:

```bash
git pull origin main
```

---

## Branching

### Create a Feature Branch

Create and switch to a new branch:

```bash
git checkout -b feature/album-art-colors
```

Or using newer syntax:

```bash
git switch -c feature/album-art-colors
```

### List Branches

See all branches:

```bash
git branch -a
```

### Switch Branches

Switch to an existing branch:

```bash
git checkout main
```

Or using newer syntax:

```bash
git switch main
```

### Push Branch to GitHub

```bash
git push origin feature/album-art-colors
```

### Create Pull Request

After pushing your branch:

1. Go to `https://github.com/yourusername/music-visualizer`
2. Click **Compare & pull request**
3. Add description
4. Click **Create pull request**
5. Wait for review (or merge yourself)
6. Click **Merge pull request**

### Delete Branch

Delete locally:

```bash
git branch -d feature/album-art-colors
```

Delete on GitHub:

```bash
git push origin --delete feature/album-art-colors
```

---

## Undoing Changes

### Scenario 1: Made Changes, Not Staged Yet

Discard all changes:

```bash
git checkout .
```

Or discard specific file:

```bash
git checkout -- client/src/pages/Home.tsx
```

### Scenario 2: Staged Changes, Not Committed

Unstage all:

```bash
git reset
```

Unstage specific file:

```bash
git reset client/src/pages/Home.tsx
```

### Scenario 3: Already Committed

Undo last commit, keep changes:

```bash
git reset --soft HEAD~1
```

Undo last commit, discard changes:

```bash
git reset --hard HEAD~1
```

Undo and create new commit:

```bash
git revert HEAD
```

### Scenario 4: Already Pushed to GitHub

If you pushed and want to undo:

```bash
git revert HEAD
git push origin main
```

Or force push (use with caution):

```bash
git reset --hard HEAD~1
git push -f origin main
```

⚠️ **Warning**: Force push can cause issues if others are working on the repo.

---

## Troubleshooting

### Issue: "fatal: not a git repository"

**Solution**: You're not in the project directory. Navigate to the correct folder:

```bash
cd /path/to/music-visualizer
```

Then verify:

```bash
git status
```

### Issue: "Permission denied (publickey)"

**Solution**: You need to set up SSH keys for GitHub:

1. Generate SSH key:
   ```bash
   ssh-keygen -t ed25519 -C "your.email@example.com"
   ```

2. Add to GitHub:
   - Go to GitHub Settings > SSH and GPG keys
   - Click "New SSH key"
   - Paste your public key (usually in `~/.ssh/id_ed25519.pub`)

3. Test connection:
   ```bash
   ssh -T git@github.com
   ```

Alternatively, use HTTPS instead of SSH (requires personal access token).

### Issue: "Your branch is ahead of 'origin/main' by 3 commits"

**Solution**: Push your commits:

```bash
git push origin main
```

### Issue: "Your branch is behind 'origin/main' by 5 commits"

**Solution**: Pull latest changes:

```bash
git pull origin main
```

### Issue: Merge Conflict

When pulling or merging, you might get conflicts. To resolve:

1. Open the conflicted file in VS Code
2. Look for conflict markers:
   ```
   <<<<<<< HEAD
   Your changes
   =======
   Their changes
   >>>>>>> branch-name
   ```

3. Edit to keep the correct version
4. Remove conflict markers
5. Stage and commit:
   ```bash
   git add .
   git commit -m "Resolve merge conflict"
   ```

### Issue: Accidentally Committed to Wrong Branch

**Solution**: Move commits to correct branch:

```bash
# Save your commits
git log --oneline -5  # Note the commit hash

# Reset current branch
git reset --hard origin/main

# Switch to correct branch
git checkout correct-branch

# Cherry-pick commits
git cherry-pick <commit-hash>

# Push
git push origin correct-branch
```

### Issue: Want to Undo a Pushed Commit

**Solution**: Use `git revert` (safe) or `git reset` (risky):

**Safe option** (creates new commit):
```bash
git revert <commit-hash>
git push origin main
```

**Risky option** (rewrites history):
```bash
git reset --hard <commit-hash>
git push -f origin main
```

---

## VS Code Integration

### Using VS Code's Built-in Git

VS Code has excellent Git integration:

1. **Source Control Panel**: Click the Source Control icon (left sidebar)
2. **Stage Changes**: Click the `+` next to modified files
3. **Commit**: Enter message and press `Ctrl+Enter`
4. **Push**: Click the `...` menu > Push

### Terminal in VS Code

Open terminal: `Ctrl+`` (backtick)

Run git commands directly in the terminal.

### Git Graph Extension

For visual branch history:

1. Install "Git Graph" extension
2. Click the Git Graph icon
3. See all commits and branches visually

---

## Best Practices

### Commit Frequently

Make small, logical commits:

```bash
# Good
git commit -m "feat: add play button"
git commit -m "fix: adjust button size for mobile"

# Bad
git commit -m "Updated everything"
```

### Write Clear Commit Messages

```bash
# Good
git commit -m "feat: implement frequency band visualization"

# Bad
git commit -m "stuff"
git commit -m "fix"
```

### Pull Before Pushing

Always get latest changes:

```bash
git pull origin main
git push origin main
```

### Use Branches for Features

Don't commit directly to main:

```bash
git checkout -b feature/new-feature
# Make changes
git push origin feature/new-feature
# Create PR on GitHub
```

### Review Changes Before Committing

```bash
git diff
git diff --staged
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Check status | `git status` |
| Stage all | `git add .` |
| Stage file | `git add <file>` |
| Commit | `git commit -m "message"` |
| Push | `git push origin main` |
| Pull | `git pull origin main` |
| View history | `git log --oneline` |
| Create branch | `git checkout -b <branch>` |
| Switch branch | `git checkout <branch>` |
| Delete branch | `git branch -d <branch>` |
| Undo changes | `git checkout -- <file>` |
| Unstage | `git reset <file>` |
| Undo commit | `git reset --soft HEAD~1` |

---

## Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Docs](https://docs.github.com)
- [Conventional Commits](https://www.conventionalcommits.org)
- [VS Code Git Integration](https://code.visualstudio.com/docs/editor/versioncontrol)

---

**Ready to push your code?** Start with the Daily Workflow section above!
