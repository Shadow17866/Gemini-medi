# 🚀 Deploy Gemini-medi to Vercel

Your code is now at: **https://github.com/Shadow17866/Gemini-medi.git**

## 📋 Quick Deployment Steps

### Step 1: Go to Vercel
1. Open: **https://vercel.com/signup**
2. Click **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub account

### Step 2: Import Your Repository
1. Click **"Add New..."** → **"Project"**
2. Find **"Shadow17866/Gemini-medi"** in your repository list
3. Click **"Import"**

### Step 3: Configure Project
Leave these settings as default:
- **Framework Preset**: Other
- **Root Directory**: `./` (root)
- **Build Command**: Auto-detected
- **Output Directory**: Auto-detected

### Step 4: Add Environment Variable
**IMPORTANT:** Before deploying, add your API key:

1. Click **"Environment Variables"** section
2. Add:
   ```
   Name:  GOOGLE_API_KEY
   Value: AIzaSyAcX8NgdOFTjIUuJViwEYSgXkIylDlrVqE
   ```
3. Select: ✅ Production, ✅ Preview, ✅ Development

### Step 5: Deploy! 🎉
1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like: `https://gemini-medi.vercel.app`

---

## 🎯 After Deployment

### Your Live URLs:
- **App**: `https://gemini-medi.vercel.app`
- **API Health**: `https://gemini-medi.vercel.app/api/health`
- **Chat API**: `https://gemini-medi.vercel.app/api/chat`

### Test Your Deployment:
1. Open your Vercel URL
2. Try asking: "What are the symptoms of diabetes?"
3. Upload a prescription image to test the parser
4. Check that all three agents work

---

## ⚙️ Project Structure

Your Vercel deployment handles:
```
/                    → Frontend (React UI)
/api/*              → Backend (FastAPI endpoints)
```

Configuration files:
- ✅ `vercel.json` - Routing configuration
- ✅ `frontend/.env.production` - Frontend config
- ✅ `.env.example` - Backend config template

---

## 🔧 Making Updates

After initial deployment:

```bash
# Make your changes
git add .
git commit -m "Update: description of changes"
git push origin main
```

Vercel will **automatically redeploy** on every push to `main`! 🚀

---

## 🐛 Troubleshooting

### Build Failed?
1. Check **Build Logs** in Vercel dashboard
2. Verify `frontend/package.json` exists
3. Ensure `vercel.json` is in root directory

### API Not Working?
1. Go to Vercel Dashboard → **Settings** → **Environment Variables**
2. Verify `GOOGLE_API_KEY` is set correctly
3. Check **Function Logs** for errors

### Frontend Can't Connect to Backend?
1. Open browser **DevTools** → **Console**
2. Look for CORS or network errors
3. Verify API routes use `/api/` prefix

---

## 📊 Vercel Dashboard

Access your dashboard: **https://vercel.com/dashboard**

Useful sections:
- **Deployments**: View build history
- **Functions**: Monitor API performance
- **Analytics**: Track usage (Pro plan)
- **Settings**: Update environment variables

---

## 💰 Pricing

Your app uses:
- **Vercel Free Tier**: 100GB bandwidth, 100 serverless function invocations per day
- **Google Gemini API**: Free tier includes 60 requests per minute

**Total Cost**: $0/month for testing! 🎉

For production with more traffic, consider Vercel Pro ($20/month).

---

## ✅ You're Done!

Your integrated Medical AI system is now live! 🏥✨

Share your app: `https://gemini-medi.vercel.app`

---

## 📞 Support

- Vercel Docs: https://vercel.com/docs
- GitHub Issues: https://github.com/Shadow17866/Gemini-medi/issues
- Gemini API: https://ai.google.dev/docs
