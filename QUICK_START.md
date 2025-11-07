# 🚀 PEGA Assessment - Quick Start Guide

Your PEGA assessment application is **fully configured and ready to deploy!**

## ✅ What's Already Done

- ✓ Complete Next.js application built
- ✓ All 40 PEGA questions implemented
- ✓ Scoring algorithm implemented and tested
- ✓ Google Sheets integration configured
- ✓ Results page with beautiful visualization
- ✓ Mobile-responsive design
- ✓ Environment variables configured with your credentials
- ✓ Code committed and pushed to GitHub

## 🎯 Your Credentials (Configured)

```
Service Account: pega-app@pega-app-477511.iam.gserviceaccount.com
Sheet ID: 15yckcOfINSHtBE8hAbuafPMWxKRU3sakdDr5g79RNFo
```

## 📝 Next Steps (3 Simple Steps)

### Step 1: Share Your Google Sheet (2 minutes)

1. Open your Google Sheet:
   👉 https://docs.google.com/spreadsheets/d/15yckcOfINSHtBE8hAbuafPMWxKRU3sakdDr5g79RNFo/edit

2. Click "Share" button (top right)

3. Add this email:
   ```
   pega-app@pega-app-477511.iam.gserviceaccount.com
   ```

4. Set permission to **Editor**

5. Uncheck "Notify people"

6. Click "Share"

### Step 2: Enable Google Sheets API (1 minute)

1. Go to Google Cloud Console:
   👉 https://console.cloud.google.com/apis/library/sheets.googleapis.com

2. Make sure project "pega-app-477511" is selected (top dropdown)

3. Click "Enable" button if not already enabled

### Step 3: Deploy to Vercel (5 minutes)

1. Go to Vercel:
   👉 https://vercel.com/new

2. Import your GitHub repository: `pega-system`

3. Add these **4 environment variables** (copy from DEPLOYMENT_CHECKLIST.md):
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY` (include BEGIN and END markers)
   - `GOOGLE_SHEET_ID`
   - `NEXT_PUBLIC_SITE_URL`

4. Click "Deploy"

5. Wait 1-2 minutes ⏱️

6. Visit your new site! 🎉

## 🧪 Test Your Deployment

1. Visit your Vercel URL
2. Complete the assessment (all 40 questions)
3. Submit the form
4. Check your Google Sheet - new row should appear!
5. View your results page

## 📚 Documentation

- **DEPLOYMENT_CHECKLIST.md** - Complete deployment guide with troubleshooting
- **README.md** - Full technical documentation
- **SETUP_GUIDE.md** - Detailed setup instructions

## ⚡ Testing Locally (Optional)

Already configured! Just run:

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## 🆘 Need Help?

If you encounter any issues:

1. Check DEPLOYMENT_CHECKLIST.md for troubleshooting
2. Verify all 3 steps above are completed
3. Check Vercel deployment logs for errors
4. Ensure environment variables are set correctly in Vercel

## 🎉 That's It!

Your PEGA assessment is ready to go live. After deployment:

- ✅ Users can take the assessment at your URL
- ✅ Data automatically saves to Google Sheets
- ✅ Beautiful results page shows their emotion profile
- ✅ Ready for email automation (next phase)

---

**Total time to deploy: ~10 minutes** ⏱️

**Questions?** Check the comprehensive documentation files included in the project.

**Good luck! 🚀**
