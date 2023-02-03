---
theme: ./
---

# Git

Handling common git scenarios

---

# Git merge

Assume you are working on `dev` branch and want to move/merge all your work to main (production) branch.

```bash
# move to main branch first
git checkout main

# merge dev branch into main
git merge dev

# push changes
git push
```

---

# Getting commits from another branch

At some point you might have to get commit from another branch.

1. Copy commit hash of the commit you want to copy
    ![copy-commit.png](/assets/git/copy-commit.png)
2. Move to branch to want to copy commit to (`git checkout dev`)
3. Cherry pick the commit using `git cherry-pick <copied-commit-hash>`

<br>

> It will make new commit in current branch with the same message commit message of copied commit. All you have to do is push the commit.

---

# Move uncommitted changes to new branch

Assume we want to make changes in `layout` branch and accidentally we made changes in `dev` branch. Instead of stashing the changes run below command to switch to new branch with existing uncommitted changes.

```bash
git switch -c <new-branch>
```

<!-- Reference: https://stackoverflow.com/a/1394804/10796681 -->

---

# Removing branches

<br>

Remove local branches:

```bash
git branch -d <branch-name>
```

<br>

Remove remote branch:

```bash
git push -d origin <branch-name>
```

---

# Remove deleted branches from local machine

> removing local branches that are not on remote

When our code get reviewed and reviewer deletes the branch from the remote repository after successful merge, we still have that branch in our local machine.

This will fill up your local branch list after you perform multiple PRs. To remove already deleted branches from your local machine, You can run below command:

```bash
git fetch --prune -a
```

---

# Update last commit

Likely you have pushed to commit and later wanted to change the commit message. Use below command to change commit message:

```bash
# prompt you to enter new commit message (of latest commit only)
git commit --amend -m "an updated commit message"

# force push
git push -f
```

<br>

There might be case where you want to make more changes to already pushed commit.

1. Perform the changes (_I know you pushed the commit_)
2. Stag changes (`git add .` or use UI)
3. Run `git commit --amend --no-edit`
4. Force push `git push -f`

---

# Removing linear commit(s) from the history

<div class="grid grid-cols-2">
<div>

Let's say you want to remove last three commits from your git history.

First of all copy commit hash of commit you want your git history to be at. In our case, as we want to remove first three commits we will copy 4th commit hash.

<br>

Run below commands:

```bash
# reset hard
git reset --hard <commit-hash>

# push new git history that doesn't have last three commits
git push -f
```

</div>

<div>
    <img src="/assets/git/remove-last-three-commits.png" alt="remove-last-three-commits.png" class="w-86 m-5 ml-auto">
</div>
</div>

> Process is same if you want to remove last commit

---

# Remove in-between commit

Assume you have below git history:

1. feat(btn): updated according to design
2. feat(alert): updated according to design
3. fix(layout): fixed vertical nav flicker issue
4. feat(accordion): updated according to design _(This is latest commit)_

Now, we accidentally pushed layout changes in our `component-updates` branch and want to remove it from our git history while preserving surrounding commits.

Run `git rebase -i HEAD~2` to open commit modification/rebase till 2nd commit from latest git history. It will open new terminal session with listed commits like below:

```text
pick 9as98q feat(accordion): updated according to design
pick qw8719 fix(layout): fixed vertical nav flicker issue
```

In this terminal change "pick" to "drop" right before layout commit. Once we modified commit history close the terminal session and force push via `git push -f`.
