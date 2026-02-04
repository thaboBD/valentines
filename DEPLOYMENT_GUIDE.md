# 🚀 Quick Deployment Guide

## Before You Deploy

1. **Add your video file** to `src/assets/video/montage.mp4`
2. **Update the repository name** in `vite.config.js`:
   ```javascript
   base: process.env.NODE_ENV === 'production' ? '/YOUR-REPO-NAME/' : '/',
   ```

## Deployment Steps

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Valentine's envelope"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. That's it! The workflow will automatically deploy

### Step 3: Access Your Site

Your site will be live at:
```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

## Troubleshooting

### Assets not loading?
- Check that `base` in `vite.config.js` matches your repo name exactly
- Format: `/repo-name/` (with slashes)

### Workflow not running?
- Check **Settings** → **Actions** → **General**
- Set Workflow permissions to "Read and write permissions"

### Need to redeploy?
Just push to main:
```bash
git add .
git commit -m "Update content"
git push
```

## Testing Locally

Before deploying, test locally:

```bash
npm run dev        # Development mode
npm run build      # Build for production
npm run preview    # Preview production build
```

## Custom Domain (Optional)

If you have a custom domain:

1. Update `vite.config.js`:
   ```javascript
   base: '/'
   ```

2. Add a `CNAME` file to `public/` with your domain

3. Configure DNS according to [GitHub's guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
