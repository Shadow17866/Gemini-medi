# 🚀 Deploy Everything to Vercel (One Platform)

## Why Vercel?
- ✅ Deploy **both frontend AND backend** in one place
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ No separate backend URL needed
- ✅ Simpler than managing two deployments

---

## 📦 Quick Deploy Steps

### 1. **Push to GitHub**

Run the setup script:
```bash
# Windows
setup-git.bat

# Or manually:
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/medical-ai.git
git branch -M main
git push -u origin main
```

### 2. **Deploy to Vercel**

1. Go to: https://vercel.com/signup
2. Sign up with GitHub
3. Click **"Add New Project"**
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: Leave as `/`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`

### 3. **Add Environment Variable**

In Vercel project settings:
- Go to **Settings** → **Environment Variables**
- Add:
  ```
  Name: GOOGLE_API_KEY
  Value: AIzaSyAcX8NgdOFTjIUuJViwEYSgXkIylDlrVqE
  ```

### 4. **Deploy!**

Click **Deploy** - Vercel will:
- Build your frontend
- Deploy your backend as serverless functions
- Give you one URL for everything: `https://your-app.vercel.app`

---

## 🎯 URL Structure

After deployment:
- **Frontend**: `https://your-app.vercel.app`
- **API**: `https://your-app.vercel.app/api/chat`
- **Health Check**: `https://your-app.vercel.app/api/health`

---

## ⚙️ Configuration Files

The project includes:
- ✅ `vercel.json` - Vercel configuration
- ✅ `frontend/.env.production` - Production settings
- ✅ Backend automatically routed to `/api/*`

---

## 🔧 Alternative: Railway (All-in-One)

If you prefer Railway:

1. Go to: https://railway.app
2. Click **"Start a New Project"**
3. Choose **"Deploy from GitHub repo"**
4. Select your repository
5. Railway will detect both frontend and backend
6. Add environment variable: `GOOGLE_API_KEY`
7. Deploy!

Railway gives you:
- Frontend: Auto-deployed
- Backend: Auto-deployed
- One domain for both

---

## 💰 Cost Comparison

### Vercel:
- **Free Tier**: 100GB bandwidth, serverless functions
- **Pro**: $20/month for unlimited

### Railway:
- **Free**: $5 credit/month (usually enough for testing)
- **Usage-based**: Pay for what you use

### Render + Netlify (Separate):
- **Render**: Free tier (sleeps after 15 min)
- **Netlify**: Free tier (100GB bandwidth)
- **Total**: Free but requires 2 platforms

---

## 🐛 Troubleshooting

### Vercel build fails:
- Check `vercel.json` is in root directory
- Verify `frontend/package.json` exists
- Check build logs in Vercel dashboard

### API not working:
- Ensure `GOOGLE_API_KEY` is set in environment variables
- Check API routes use `/api/` prefix
- View function logs in Vercel dashboard

### Frontend can't reach backend:
- Verify `VITE_API_URL` is set to `/api` (relative path)
- Check browser console for CORS errors
- Ensure backend routes are configured in `vercel.json`

---

## ✅ Recommended: Vercel

**For simplicity and ease of use, Vercel is the best choice** because:
1. One platform for everything
2. No CORS issues (same domain)
3. Free tier is generous
4. Automatic deployments on git push
5. Built-in SSL/HTTPS

Deploy to Vercel and you're done! 🎉
