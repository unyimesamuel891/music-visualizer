# Deployment Guide: Music Visualizer

This guide provides step-by-step instructions for deploying the Music Visualizer to both Manus (recommended) and Vercel.

## Table of Contents

1. [GitHub Setup](#github-setup)
2. [Manus Deployment](#manus-deployment-recommended)
3. [Vercel Deployment](#vercel-deployment)
4. [Troubleshooting](#troubleshooting)

---

## GitHub Setup

### Step 1: Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Fill in the repository details:
   - **Repository name**: `music-visualizer`
   - **Description**: "A modern, elegant music visualizer using Web Audio API and Canvas"
   - **Visibility**: Public (for portfolio) or Private
   - **Initialize with**: None (we'll push existing code)
3. Click **Create repository**

### Step 2: Initialize Git Locally

Open your terminal in the project directory:

```bash
cd /path/to/music-visualizer
```

Initialize Git and add your files:

```bash
git init
git add .
git commit -m "Initial commit: Music visualizer with Web Audio API and Canvas"
```

### Step 3: Connect to GitHub and Push

Replace `yourusername` with your GitHub username:

```bash
git remote add origin https://github.com/yourusername/music-visualizer.git
git branch -M main
git push -u origin main
```

**What these commands do**:
- `git remote add origin`: Connects your local repo to GitHub
- `git branch -M main`: Renames the default branch to `main`
- `git push -u origin main`: Pushes your code to GitHub and sets `main` as the default branch

### Step 4: Verify on GitHub

Go to `https://github.com/yourusername/music-visualizer` and verify your code is there.

---

## Manus Deployment (Recommended)

Manus provides built-in hosting optimized for Web Audio API and Canvas applications.

### Step 1: Create a Checkpoint

In the Manus Management UI:

1. Click the **Checkpoint** button (or go to Dashboard)
2. Click **Save Checkpoint**
3. Add a description: "Production-ready music visualizer"
4. Click **Save**

### Step 2: Publish to Manus

1. In the Management UI, click the **Publish** button (top-right)
2. Review the deployment settings
3. Click **Publish**
4. Wait for deployment to complete (usually < 1 minute)

### Step 3: Access Your Live Site

Your site will be available at:
```
https://music-visualizer.manus.space
```

### Step 4: Configure Custom Domain (Optional)

To use your own domain:

1. Go to **Settings > Domains** in the Management UI
2. Click **Add Domain**
3. Enter your domain (e.g., `visualizer.yourname.com`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (usually 24-48 hours)

### Advantages of Manus

✅ **Optimized for Web Audio API**: Full support for audio processing  
✅ **Canvas Performance**: Optimized rendering pipeline  
✅ **Automatic HTTPS**: All sites use SSL/TLS  
✅ **CDN**: Global content delivery  
✅ **Analytics**: Built-in traffic analytics  
✅ **No Configuration**: Works out of the box  
✅ **Easy Updates**: Push to GitHub, auto-deploys  

---

## Vercel Deployment

Vercel is a popular serverless platform for React applications.

### Step 1: Push to GitHub

Ensure your code is pushed to GitHub (see GitHub Setup above):

```bash
git push origin main
```

### Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up**
3. Choose **GitHub** as your sign-up method
4. Authorize Vercel to access your GitHub account

### Step 3: Import Project

1. Click **New Project**
2. Select your `music-visualizer` repository
3. Configure project settings:
   - **Framework Preset**: Other
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`

4. Click **Deploy**

### Step 4: Wait for Deployment

Vercel will:
1. Clone your repository
2. Install dependencies
3. Build the project
4. Deploy to Vercel's CDN

This typically takes 2-5 minutes. You'll see a progress indicator.

### Step 5: Access Your Live Site

Once deployed, you'll get a URL like:
```
https://music-visualizer-yourusername.vercel.app
```

### Step 6: Configure Custom Domain (Optional)

1. Go to your Vercel project dashboard
2. Click **Settings > Domains**
3. Enter your custom domain
4. Follow DNS configuration instructions
5. Wait for DNS propagation

### Step 7: Enable Auto-Deploy

Vercel automatically deploys on every push to `main`. To verify:

1. Make a small change to your code
2. Commit and push:
   ```bash
   git add .
   git commit -m "test: verify auto-deploy"
   git push origin main
   ```
3. Watch the deployment in Vercel dashboard

### Vercel Configuration File (Optional)

Create `vercel.json` in the project root for custom configuration:

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "env": {
    "NODE_ENV": "production"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600"
        }
      ]
    }
  ]
}
```

### Advantages of Vercel

✅ **Easy Integration**: One-click GitHub integration  
✅ **Auto-Deploy**: Automatic deployment on push  
✅ **Preview URLs**: Preview deployments before merging  
✅ **Analytics**: Built-in performance analytics  
✅ **Serverless Functions**: Can add backend APIs later  
✅ **Global CDN**: Fast content delivery worldwide  

### Limitations of Vercel

⚠️ **Web Audio API**: Works but may have latency issues  
⚠️ **Canvas Performance**: Slightly slower than Manus  
⚠️ **Cold Starts**: First request may be slower  

---

## Updating Your Deployment

### Manus Updates

1. Make changes locally
2. Push to GitHub:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin main
   ```
3. Manus automatically detects changes and redeploys

### Vercel Updates

1. Make changes locally
2. Push to GitHub:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin main
   ```
3. Vercel automatically detects the push and redeploys

---

## Troubleshooting

### Issue: Build Fails on Vercel

**Solution**: Check the build logs in Vercel dashboard:

1. Go to Vercel project dashboard
2. Click **Deployments**
3. Click the failed deployment
4. Scroll to **Build Logs**
5. Look for error messages
6. Common issues:
   - Missing dependencies: Run `pnpm install` locally and commit `pnpm-lock.yaml`
   - TypeScript errors: Run `pnpm check` locally to find issues
   - Environment variables: Add to Vercel Settings > Environment Variables

### Issue: Web Audio API Not Working

**Solution**: Ensure HTTPS is enabled:

- Manus: Automatic HTTPS ✅
- Vercel: Automatic HTTPS ✅

Web Audio API requires HTTPS (except localhost).

### Issue: Canvas Rendering Slow

**Solution**: This is typically a browser/device limitation, not deployment issue:

- Test on different browsers
- Test on different devices
- Check browser console for errors
- Verify GPU acceleration is enabled

### Issue: Audio File Upload Not Working

**Solution**: Check file format and size:

- Supported formats: MP3, WAV, OGG, M4A
- File size: Typically < 50MB (browser memory limit)
- CORS: Should work fine on both Manus and Vercel

### Issue: Deployment Stuck

**Solution**: 

For Manus:
1. Go to Management UI > Dashboard
2. Click **View Logs**
3. Check for errors

For Vercel:
1. Go to Deployments
2. Click the stuck deployment
3. Check Build Logs
4. Try redeploying:
   ```bash
   git commit --allow-empty -m "Trigger redeploy"
   git push origin main
   ```

---

## Comparison: Manus vs Vercel

| Feature | Manus | Vercel |
|---------|-------|--------|
| **Setup Time** | 2 minutes | 5 minutes |
| **Web Audio API** | ✅ Optimized | ✅ Works |
| **Canvas Performance** | ✅ Excellent | ✅ Good |
| **Auto-Deploy** | ✅ Yes | ✅ Yes |
| **Custom Domain** | ✅ Yes | ✅ Yes |
| **Analytics** | ✅ Built-in | ✅ Built-in |
| **Cost** | ✅ Included | ✅ Free tier available |
| **Learning Curve** | ✅ Minimal | ✅ Minimal |

**Recommendation**: Use **Manus** for best performance with Web Audio API and Canvas. Use **Vercel** if you want more flexibility for future backend features.

---

## Next Steps

1. **Deploy to Manus** (recommended)
2. **Share your portfolio**: Add the live link to your GitHub profile
3. **Monitor performance**: Check analytics in deployment dashboard
4. **Iterate**: Make improvements and push updates
5. **Add features**: Consider album art color extraction, playlist support, etc.

---

## Resources

- [Manus Documentation](https://help.manus.im)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Documentation](https://docs.github.com)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

---

**Questions?** Check the troubleshooting section or open an issue on GitHub.
