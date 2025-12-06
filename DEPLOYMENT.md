# Deployment Guide for Integrated Medical AI System

## 🚀 Deployment Overview

### ⭐ **Recommended: Deploy Everything to Vercel** (Easiest)
See [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) for one-platform deployment of both frontend and backend.

### Alternative: Separate Deployments
This guide covers deploying on **two separate platforms**:
1. **Backend (Python/FastAPI)** → Deploy on Render/Railway
2. **Frontend (React)** → Deploy on Netlify

---

## 📦 Backend Deployment (Render - Recommended)

### Option 1: Deploy to Render (Free Tier Available)

1. **Create a Render Account**: https://render.com

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Or use "Deploy from Git URL"

3. **Configure Service**:
   ```
   Name: medical-ai-backend
   Environment: Python 3
   Region: Oregon (US West)
   Branch: main
   Root Directory: integrated-medical-ai/backend
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn app:app --host 0.0.0.0 --port $PORT
   ```

4. **Add Environment Variables** in Render Dashboard:
   ```
   GOOGLE_API_KEY=your_actual_google_api_key
   ```

5. **Deploy** - Render will provide a URL like:
   ```
   https://medical-ai-backend.onrender.com
   ```

### Option 2: Deploy to Railway

1. Go to https://railway.app
2. Click "Start a New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Set root directory: `integrated-medical-ai/backend`
5. Add environment variable: `GOOGLE_API_KEY`
6. Railway will auto-detect Python and deploy

---

## 🌐 Frontend Deployment (Netlify)

### Step-by-Step:

1. **Push Code to GitHub**:
   ```bash
   cd integrated-medical-ai
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/medical-ai.git
   git push -u origin main
   ```

2. **Create Netlify Account**: https://netlify.com

3. **Deploy New Site**:
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository
   - Configure build settings:
     ```
     Base directory: integrated-medical-ai/frontend
     Build command: npm run build
     Publish directory: integrated-medical-ai/frontend/dist
     ```

4. **Add Environment Variables** in Netlify:
   - Go to: Site settings → Environment variables
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com
     ```
     (Use the URL from your Render deployment)

5. **Deploy Site** - Netlify will provide a URL like:
   ```
   https://medical-ai-system.netlify.app
   ```

6. **Custom Domain (Optional)**:
   - Go to Site settings → Domain management
   - Add your custom domain

---

## 🔧 Update Backend CORS

After deploying frontend, update backend CORS settings:

Edit `backend/app.py` line 37:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-netlify-site.netlify.app",
        "http://localhost:3000"  # Keep for local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Redeploy backend after this change.

---

## 📋 Pre-Deployment Checklist

### Backend:
- ✅ `requirements.txt` is complete
- ✅ Environment variables configured (GOOGLE_API_KEY)
- ✅ CORS settings updated with frontend URL
- ✅ Port uses `$PORT` environment variable

### Frontend:
- ✅ Build command works locally: `npm run build`
- ✅ API URL environment variable set
- ✅ All dependencies in `package.json`

---

## 🧪 Testing Deployed App

1. **Test Backend**:
   ```bash
   curl https://your-backend-url.onrender.com/api/health
   ```
   Should return: `{"status":"healthy",...}`

2. **Test Frontend**:
   - Open Netlify URL in browser
   - Try asking a medical question
   - Upload an image to test prescription parser
   - Check browser console for errors

---

## 💰 Cost Breakdown

### Free Tier (Recommended for Testing):
- **Render**: Free tier available (sleeps after 15 min inactivity)
- **Netlify**: 100GB bandwidth/month free
- **Total**: $0/month

### Production (Recommended):
- **Render**: $7/month (always active)
- **Netlify**: $0-19/month depending on traffic
- **Total**: $7-26/month

---

## 🔒 Security Notes

1. **Never commit** `.env` files to Git
2. **Add to `.gitignore`**:
   ```
   .env
   .env.local
   .env.production
   ```

3. **Use environment variables** for all API keys

4. **Enable HTTPS** (automatic on Render & Netlify)

---

## 🐛 Troubleshooting

### Backend won't start:
- Check logs in Render dashboard
- Verify `requirements.txt` has all dependencies
- Ensure `GOOGLE_API_KEY` is set

### Frontend API calls fail:
- Verify `VITE_API_URL` points to correct backend URL
- Check CORS settings in backend
- Open browser DevTools → Network tab to see errors

### Build fails:
- Run `npm run build` locally first
- Check Node version (should be 18+)
- Clear Netlify cache and retry

---

## 📞 Support

For deployment issues:
- Render: https://render.com/docs
- Netlify: https://docs.netlify.com
- Railway: https://docs.railway.app

---

**Ready to deploy!** Start with backend on Render, then frontend on Netlify. 🚀
