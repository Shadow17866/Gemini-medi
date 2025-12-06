@echo off
REM Git initialization script for deployment (Windows)

echo 🚀 Preparing project for deployment...

REM Initialize git if not already
if not exist .git (
    echo 📦 Initializing Git repository...
    git init
)

REM Add all files
echo ➕ Adding files to Git...
git add .

REM Commit
echo 💾 Creating commit...
git commit -m "Initial commit - Ready for deployment"

echo.
echo ✅ Git setup complete!
echo.
echo 📋 Next steps:
echo 1. Create a GitHub repository: https://github.com/new
echo 2. Run these commands with your repo URL:
echo.
echo    git remote add origin https://github.com/yourusername/medical-ai.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. Deploy backend to Render: https://render.com
echo 4. Deploy frontend to Netlify: https://netlify.com
echo.
echo See DEPLOYMENT.md for detailed instructions!
echo.
pause
