# 🚀 Deploy to Render - Complete Guide

## Why Render?
- ✅ Deploy both frontend and backend
- ✅ Free tier available (backend sleeps after 15 min inactivity)
- ✅ Simple configuration
- ✅ Automatic deployments from GitHub

---

## 📦 Deployment Steps

### Step 1: Create Render Account
1. Go to: https://render.com/
2. Click **"Get Started"**
3. Sign up with **GitHub**

### Step 2: Deploy Backend (Python/FastAPI)

1. In Render Dashboard, click **"New +"** → **"Web Service"**

2. Connect your repository:
   - Click **"Connect a repository"**
   - Find **"Shadow17866/Gemini-medi"**
   - Click **"Connect"**

3. Configure the web service:
   ```
   Name: gemini-medi-backend
   Region: Oregon (US West) or closest to you
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn app:app --host 0.0.0.0 --port $PORT
   ```

4. Select **Instance Type**:
   - Choose **"Free"** (or "Starter" for $7/month if you want always-on)

5. **Add Environment Variable**:
   - Click **"Advanced"** → **"Add Environment Variable"**
   - Key: `GOOGLE_API_KEY`
   - Value: `AIzaSyAcX8NgdOFTjIUuJViwEYSgXkIylDlrVqE`

6. Click **"Create Web Service"**

7. **Wait 3-5 minutes** for deployment to complete

8. **Copy your backend URL** - it will look like:
   ```
   https://gemini-medi-backend.onrender.com
   ```

### Step 3: Deploy Frontend (React/Vite)

1. In Render Dashboard, click **"New +"** → **"Static Site"**

2. Connect the **same repository**: **"Shadow17866/Gemini-medi"**

3. Configure the static site:
   ```
   Name: gemini-medi-frontend
   Branch: main
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

4. **Add Environment Variable**:
   - Click **"Advanced"** → **"Add Environment Variable"**
   - Key: `VITE_API_URL`
   - Value: `https://gemini-medi-backend.onrender.com` (use YOUR backend URL from Step 2)

5. Click **"Create Static Site"**

6. **Wait 2-3 minutes** for build to complete

7. Your frontend URL will be:
   ```
   https://gemini-medi-frontend.onrender.com
   ```

### Step 4: Update Backend CORS

After both are deployed, update CORS in your backend to allow the frontend URL.

---

## 🎯 Your Live URLs

After deployment:
- **Frontend**: `https://gemini-medi-frontend.onrender.com`
- **Backend API**: `https://gemini-medi-backend.onrender.com/api/health`

---

## 🔧 Quick Summary

### Backend Configuration:
| Setting | Value |
|---------|-------|
| Name | gemini-medi-backend |
| Root Directory | `backend` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn app:app --host 0.0.0.0 --port $PORT` |
| Environment | `GOOGLE_API_KEY=AIzaSyAcX8NgdOFTjIUuJViwEYSgXkIylDlrVqE` |

### Frontend Configuration:
| Setting | Value |
|---------|-------|
| Name | gemini-medi-frontend |
| Root Directory | `frontend` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |
| Environment | `VITE_API_URL=https://gemini-medi-backend.onrender.com` |

---

## ⚠️ Important Notes

### Free Tier Limitations:
- **Backend sleeps** after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds to wake up
- Static site (frontend) is always active

### To Avoid Sleep:
- Upgrade to **Starter Plan** ($7/month) for always-on backend
- Or use a service like **UptimeRobot** to ping your backend every 10 minutes

---

## 🐛 Troubleshooting

### Backend Build Failed?
- Check **Logs** in Render dashboard
- Verify `requirements.txt` is in `backend/` folder
- Ensure Python version is 3.9+

### Frontend Build Failed?
- Check **Deploy Logs**
- Verify `package.json` is in `frontend/` folder
- Ensure all dependencies are listed

### API Not Connecting?
- Verify `VITE_API_URL` in frontend settings points to your backend URL
- Check backend CORS settings allow frontend domain
- Test backend directly: `https://your-backend.onrender.com/api/health`

### 404 Errors?
- Check backend is running (not sleeping)
- Verify API routes in `app.py`
- Check browser console for CORS errors

---

## 💰 Cost Breakdown

### Free Tier:
- Backend: Free (sleeps after 15 min)
- Frontend: Free (100GB bandwidth)
- **Total: $0/month**

### Paid (No Sleep):
- Backend Starter: $7/month
- Frontend: Free
- **Total: $7/month**

---

## 🔄 Auto-Deploy

Once set up, every push to GitHub automatically triggers:
- Backend redeployment
- Frontend rebuild

No manual deployment needed! 🎉

---

## ✅ Next Steps

1. Deploy backend first
2. Copy backend URL
3. Deploy frontend with backend URL in environment
4. Test your live app!

Your integrated Medical AI system will be live on Render! 🏥✨
