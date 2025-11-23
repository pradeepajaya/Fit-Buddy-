# 🚀 Step-by-Step Guide to Push Your Project to GitHub

## Prerequisites

✅ Git installed on your computer  
✅ GitHub account created

---

## Step 1: Create a New Repository on GitHub

1. Go to https://github.com
2. Click the **"+"** icon in top right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `fit-buddy-wellness-app` (or your preferred name)
   - **Description**: "A comprehensive fitness and wellness mobile app built with React Native"
   - **Visibility**: Choose Public or Private
   - ⚠️ **DO NOT** check "Initialize with README" (we already have one)
5. Click **"Create repository"**

---

## Step 2: Initialize Git in Your Project (if not already done)

Open PowerShell in your project folder:

```powershell
cd "f:\Fit Buddy Wellness App"
```

Initialize git repository:

```powershell
git init
```

---

## Step 3: Configure Git (First Time Only)

Set your name and email:

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## Step 4: Add All Files to Git

Stage all files:

```powershell
git add .
```

Check what will be committed:

```powershell
git status
```

---

## Step 5: Make Your First Commit

Commit the files:

```powershell
git commit -m "Initial commit: Fit Buddy Wellness App with mobile and web features"
```

---

## Step 6: Rename Default Branch to 'main' (Recommended)

```powershell
git branch -M main
```

---

## Step 7: Connect to GitHub Repository

Replace `YOUR_USERNAME` with your actual GitHub username:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/fit-buddy-wellness-app.git
```

Verify the remote was added:

```powershell
git remote -v
```

---

## Step 8: Push to GitHub

Push your code:

```powershell
git push -u origin main
```

**If prompted for credentials:**

- Username: Your GitHub username
- Password: Use a **Personal Access Token** (not your password)

### How to Create a Personal Access Token:

1. Go to GitHub → Settings → Developer settings
2. Click "Personal access tokens" → "Tokens (classic)"
3. Click "Generate new token (classic)"
4. Give it a name (e.g., "Fit Buddy App")
5. Select scopes: check **"repo"**
6. Click "Generate token"
7. **COPY THE TOKEN** (you won't see it again!)
8. Use this token as your password when pushing

---

## Step 9: Verify on GitHub

1. Go to https://github.com/YOUR_USERNAME/fit-buddy-wellness-app
2. You should see all your files!
3. Rename `GITHUB_README.md` to `README.md` for it to display on repo homepage

---

## Step 10: Update README on GitHub (Optional)

After first push, rename the README file:

```powershell
# Delete old README if exists
Remove-Item "README.md" -ErrorAction SilentlyContinue

# Rename GITHUB_README to README
Move-Item "GITHUB_README.md" "README.md"

# Commit and push
git add .
git commit -m "Update README for GitHub"
git push
```

---

## 📝 Future Updates

Whenever you make changes:

1. **Stage changes:**

   ```powershell
   git add .
   ```

2. **Commit with descriptive message:**

   ```powershell
   git commit -m "Add dark mode to exercise screen and profile picture upload"
   ```

3. **Push to GitHub:**
   ```powershell
   git push
   ```

---

## 🌿 Working with Branches (Optional)

Create a new feature branch:

```powershell
git checkout -b feature/new-feature
```

Switch back to main:

```powershell
git checkout main
```

Merge feature branch into main:

```powershell
git merge feature/new-feature
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Permission denied (publickey)"

**Solution:** Use HTTPS instead of SSH or set up SSH keys in GitHub

### Issue 2: "Updates were rejected"

**Solution:** Pull first, then push:

```powershell
git pull origin main --rebase
git push
```

### Issue 3: Large files error

**Solution:** Add to `.gitignore` and commit again:

```powershell
# Add to .gitignore
echo "node_modules/" >> .gitignore
echo "*.log" >> .gitignore

git rm -r --cached node_modules
git commit -m "Remove node_modules from tracking"
git push
```

---

## 🎉 Success!

Your project is now on GitHub! You can:

- Share the link with others
- Clone it on another computer
- Accept contributions
- Add it to your portfolio

**Your repo URL:**

```
https://github.com/YOUR_USERNAME/fit-buddy-wellness-app
```

---

## 📋 Quick Reference Commands

| Command                   | Description          |
| ------------------------- | -------------------- |
| `git status`              | Check file status    |
| `git add .`               | Stage all changes    |
| `git commit -m "message"` | Commit changes       |
| `git push`                | Upload to GitHub     |
| `git pull`                | Download from GitHub |
| `git log`                 | View commit history  |
| `git diff`                | See changes          |

---

**Need Help?**

- GitHub Docs: https://docs.github.com
- Git Docs: https://git-scm.com/doc
