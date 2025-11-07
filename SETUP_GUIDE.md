# PEGA Assessment - Quick Setup Guide

This guide will help you get the PEGA assessment application up and running.

## Prerequisites Checklist

Before you begin, make sure you have:

- [ ] Node.js 18+ installed
- [ ] A Google Cloud Platform account
- [ ] A Vercel account (for deployment)
- [ ] Access to create a Google Sheet

## Step 1: Install Dependencies

\`\`\`bash
npm install
\`\`\`

## Step 2: Set Up Google Cloud Project

### 2.1 Create a New Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it "PEGA Assessment" (or your preferred name)
4. Click "Create"

### 2.2 Enable Google Sheets API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google Sheets API"
3. Click on it and press "Enable"

### 2.3 Create a Service Account

1. Go to "IAM & Admin" → "Service Accounts"
2. Click "Create Service Account"
3. Name: \`pega-assessment-service\`
4. Description: "Service account for PEGA assessment data"
5. Click "Create and Continue"
6. Role: Select "Editor"
7. Click "Continue" then "Done"

### 2.4 Create Service Account Key

1. Click on the service account you just created
2. Go to the "Keys" tab
3. Click "Add Key" → "Create new key"
4. Select "JSON" format
5. Click "Create"
6. **IMPORTANT:** Save the downloaded JSON file securely - you'll need it for environment variables

## Step 3: Set Up Google Sheet

### 3.1 Create a New Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click "Blank" to create a new spreadsheet
3. Name it "PEGA Assessment Data"
4. Copy the Sheet ID from the URL:
   \`\`\`
   https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit
   \`\`\`

### 3.2 Share Sheet with Service Account

1. In your Google Sheet, click "Share" button
2. Paste the service account email (from the JSON file, looks like: \`xxx@xxx.iam.gserviceaccount.com\`)
3. Give it "Editor" permissions
4. Uncheck "Notify people"
5. Click "Share"

## Step 4: Configure Environment Variables

### 4.1 Locate Your Credentials

Open the JSON file you downloaded. You'll need these values:
- \`client_email\` → This is your \`GOOGLE_SERVICE_ACCOUNT_EMAIL\`
- \`private_key\` → This is your \`GOOGLE_PRIVATE_KEY\`

### 4.2 Update .env.local

Edit the \`.env.local\` file in the project root:

\`\`\`env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your_spreadsheet_id_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

**Important Notes:**
- Keep the private key wrapped in double quotes
- Preserve the \\n characters (don't replace them with actual line breaks)
- Don't add spaces around the = sign

## Step 5: Test Locally

\`\`\`bash
npm run dev
\`\`\`

1. Open [http://localhost:3000](http://localhost:3000)
2. Fill out the assessment (you can use any values for testing)
3. Submit the form
4. Check your Google Sheet - you should see a new row with the data
5. View the results page

## Step 6: Deploy to Vercel

### 6.1 Push to GitHub

\`\`\`bash
git add .
git commit -m "Initial PEGA assessment setup"
git push
\`\`\`

### 6.2 Deploy on Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. In "Environment Variables" section, add:
   - \`GOOGLE_SERVICE_ACCOUNT_EMAIL\`
   - \`GOOGLE_PRIVATE_KEY\`
   - \`GOOGLE_SHEET_ID\`
   - \`NEXT_PUBLIC_SITE_URL\` (use your Vercel URL)
5. Click "Deploy"

### 6.3 Test Production Deployment

1. Visit your Vercel URL
2. Complete a test assessment
3. Verify data appears in Google Sheet
4. Check results page works

## Step 7: Set Up Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your domain (e.g., \`joy-assessment.flynndisney.com\`)
4. Follow the DNS configuration instructions
5. Update \`NEXT_PUBLIC_SITE_URL\` environment variable in Vercel

## Troubleshooting

### "Failed to save assessment data"

**Problem:** Cannot write to Google Sheets

**Solutions:**
1. Check that the service account email has editor access to the sheet
2. Verify \`GOOGLE_SHEET_ID\` is correct
3. Ensure Google Sheets API is enabled in Google Cloud Console
4. Check that private key is properly formatted (with \\n preserved)

### Environment Variables Not Working

**Problem:** App can't read environment variables

**Solutions:**
1. Restart dev server after changing \`.env.local\`
2. For Vercel, check environment variables are set in dashboard
3. Make sure variable names match exactly (case-sensitive)
4. Don't commit \`.env.local\` to git

### TypeScript Errors

**Problem:** Build fails with TypeScript errors

**Solution:**
\`\`\`bash
npm run build
\`\`\`
This will show all TypeScript errors. Fix them one by one.

### Google Sheets API Quota Exceeded

**Problem:** Too many requests to Google Sheets API

**Solutions:**
1. Check Google Cloud Console quotas
2. Implement rate limiting if needed
3. Consider caching data if doing bulk operations

## Next Steps

Once your assessment is live:

1. **Set up email automation** using Google Apps Script (see main documentation)
2. **Configure analytics** to track completion rates
3. **Test on multiple devices** to ensure mobile responsiveness
4. **Collect user feedback** and iterate on the design
5. **Monitor Google Sheets** for data quality

## Security Checklist

- [ ] \`.env.local\` is in \`.gitignore\` (don't commit credentials!)
- [ ] Service account has minimum required permissions
- [ ] Google Sheet is only shared with service account
- [ ] HTTPS is enabled (automatic with Vercel)
- [ ] Environment variables are set in Vercel dashboard
- [ ] Private keys are never exposed in frontend code

## Support

If you encounter issues:

1. Check the main README.md for detailed documentation
2. Review error messages in browser console
3. Check Vercel deployment logs
4. Verify all environment variables are set correctly

---

**Congratulations!** Your PEGA assessment should now be live and collecting data. 🎉
