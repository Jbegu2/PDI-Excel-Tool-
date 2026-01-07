# Deployment Instructions

## Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the "+" icon → "New repository"
3. Name it (e.g., `inspection-sheet-app`)
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 2: Push to GitHub

Run these commands in your terminal (replace `<your-github-username>` and `<repo-name>`):

```bash
cd "/Users/jbegu/Desktop/cursor video"

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Inspection sheet web app"

# Add GitHub remote (replace with your actual repo URL)
git remote add origin https://github.com/<your-github-username>/<repo-name>.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Example:**
If your GitHub username is `jbegu` and repo name is `inspection-sheet-app`:
```bash
git remote add origin https://github.com/jbegu/inspection-sheet-app.git
```

## Step 3: Deploy to Vercel

### Option A: Via Vercel Website (Easiest)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click "Deploy"
6. Wait for deployment (usually 1-2 minutes)
7. Get your public URL (e.g., `inspection-sheet-app.vercel.app`)

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy (will prompt for login)
vercel

# For production deployment
vercel --prod
```

## Step 4: Share with Team

Once deployed, share the Vercel URL with your team. The app will be:
- Accessible via HTTPS
- Automatically deployed on every push to `main` branch
- Protected with security headers

## Troubleshooting

### Git Authentication Issues

If you get authentication errors:
- Use GitHub Personal Access Token instead of password
- Or use SSH: `git remote set-url origin git@github.com:<username>/<repo>.git`

### Vercel Build Fails

- Check build logs in Vercel dashboard
- Ensure `package.json` has correct build script
- Verify all dependencies are listed in `package.json`
