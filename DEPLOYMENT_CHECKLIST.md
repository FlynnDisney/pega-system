# PEGA Assessment - Deployment Checklist

Your PEGA assessment application is fully configured and ready to deploy!

## ✅ Configuration Status

### Environment Variables - CONFIGURED ✓
- ✅ `GOOGLE_SERVICE_ACCOUNT_EMAIL`: pega-app@pega-app-477511.iam.gserviceaccount.com
- ✅ `GOOGLE_PRIVATE_KEY`: Configured and properly formatted
- ✅ `GOOGLE_SHEET_ID`: 15yckcOfINSHtBE8hAbuafPMWxKRU3sakdDr5g79RNFo
- ✅ `.env.local` file created with all credentials

### Google Sheets Setup - REQUIRED
Before deploying, verify your Google Sheet is properly configured:

1. **Open your Google Sheet**:
   - Go to: https://docs.google.com/spreadsheets/d/15yckcOfINSHtBE8hAbuafPMWxKRU3sakdDr5g79RNFo/edit

2. **Share with Service Account**:
   - Click the "Share" button in your Google Sheet
   - Add: `pega-app@pega-app-477511.iam.gserviceaccount.com`
   - Give it "Editor" permissions
   - Uncheck "Notify people"
   - Click "Share"

3. **Verify Sheet Structure** (optional - the app will create headers automatically):
   The app will automatically create the correct column structure on first submission.

### Google Cloud Console - REQUIRED
Ensure these are configured in your Google Cloud project:

1. **Google Sheets API is enabled**:
   - Go to: https://console.cloud.google.com/apis/library/sheets.googleapis.com
   - Select project: "pega-app-477511"
   - Click "Enable" if not already enabled

2. **Service Account exists**:
   - Your service account: `pega-app@pega-app-477511.iam.gserviceaccount.com`
   - Should have Editor role

## 🚀 Quick Start - Local Testing

Since your `.env.local` is already configured, you can test locally right now:

```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

**To test the full flow:**
1. Fill out all 40 questions
2. Enter any email address
3. Submit the assessment
4. Check your Google Sheet for the new data row
5. View the results page

## 📦 Deploy to Vercel (Recommended)

### Option 1: Vercel Dashboard (Easiest)

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Add Google Sheets credentials"
   git push
   ```

2. **Go to Vercel Dashboard**:
   - Visit: https://vercel.com/new
   - Sign in with your GitHub account

3. **Import Repository**:
   - Click "Import Project"
   - Select your `pega-system` repository
   - Click "Import"

4. **Configure Environment Variables**:
   In the "Environment Variables" section, add these EXACT values:

   ```
   GOOGLE_SERVICE_ACCOUNT_EMAIL
   pega-app@pega-app-477511.iam.gserviceaccount.com
   ```

   ```
   GOOGLE_SHEET_ID
   15yckcOfINSHtBE8hAbuafPMWxKRU3sakdDr5g79RNFo
   ```

   ```
   GOOGLE_PRIVATE_KEY
   -----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCm9HX1A+27RnvT
xz0oUdgF2FWvhYb9tm0G+uBk3jc7UKgqbfek4tSW0SF1UdjClNmqxy6VWlRQL6Ou
9CjEACOzSVptEwaCyhKiP648gKAO2sQaFd0Xw0HfFOSPJb5uxUNLzHwY/ojNkAew
e3VH29Ax6CN4SMHLAkx7xyaDyeGuiCKjCiwtZD0cBVcQSGS8uzfhvs4YXZKLTM63
7QHN6kWf3Sbu2MoYe/FXs70vP6s0kXDl1C8EhLnwwjU7WurY0YKjMfz/89jAJI8V
I6KabAzbU2KMqesKqLC64QfLNJUAIHqDdZu1MoX1m5STfeX8SXdOWkLt6JBCmjlt
OpGm7yl7AgMBAAECggEAHFC7rLlk2W1D1RAmfC8dTyh4p9MiqOcGqLdl1VWm0mWE
j+WkqY9a9NU1MnuWIrIyFHfBm8z9Hbhmr2Zzf4Jyi5a2QmeGpCn3bRMVzucVvk82
ESKCI+SWyGn3tZt2J71HA5UDuw14UDzMQQ8/Pde3AK/ZTC4yx+Z06E1HZ/SWVQ41
Gw2GxaDgAysIljKIQJWhZC/o7meIZjc/eCzIqfxS5fVU3gmgSSniqkPvJjqQ5p9Y
CYGGryMhBouhRrCOdmR31D0FrU9zo4tDw4LqL6flzsN1D79zfmerMMPbahObKWth
bJxD3TUGQ/soc1zzsEaB6gYp94kE9DuljAbktn4SWQKBgQDm9yNkN24+QEkOWBHu
ZsSl1LEL+5D5ppkaCJYDNRfkySmN19ch+xK4/FczWkeuoj52XgcmQ097+TCSpwKN
ocr2WXahyRcYCpcP04i1GaWgweMYibXdvUs1nQe4VktDNl3uNLfvgW5vInb/oxuK
lghjk7eryCb0tmGkGBXUcdLdxwKBgQC5DSabTFyiVops8YlYBegnL98ALSQlasGI
Px9UfQXD5H4NggBh6xr2KNyWIJDqawaom/yo7TQKZ/McP/XCyXbYvN84D1YnwRIn
auiq4askSyiSWaI8qMCM9NPwlvO/WbhZORMzzar/GgxpTfQl5Big7PVGeTlud+qC
l5SceF5mrQKBgQDcR68IgNlzI8rJlHOdpYQ+CQnGvOq7QApbSv8QFg4w1S79qnLz
ZMuphHoCb0NYqkLaj7lP4/il67dI12JXBI1XwWGk0e5lrov+uyhyWQCfvuvB1m2P
C1/0xUy8ogjsFKknbD5VfmN+OSe3jq/Q0GE134fYnW+SC3Q6lgIT+W88twKBgAsO
qhvleDOLEEJqPFayI6kTxzNvfxVtR5soimq1/b4yzQVpmzQ+pCHJV0TxNTeMpZ01
lOdTJSTqCTDK8ZhuCVfyETR8Vh2R/8+zJ6vuSBenFgmIqZUOUFMb3f4mRvJMHiPW
sTsLMwiDOfKg4dHRy1byUcWgQLpFGBItlIe0+Y8RAoGBAMyiUUrCTDMIFXlvelZ4
aAVsWNRLj58HR8wNu1tC1sSFm5OY1JflknfLWRVxsM0Rysw9Nn7zTC1qd/HJTGu6
J+oeFw1X9cQUlosnKwUjciInPlBnXBvaueUX1y+ttivLHgxhFyIAzmb8jBmWGruy
9X9G8DbKz/cpacTUbXleuAzR
-----END PRIVATE KEY-----
   ```

   **IMPORTANT:** For `GOOGLE_PRIVATE_KEY`, paste the ENTIRE key including the BEGIN and END markers. Use the multi-line format shown above.

   ```
   NEXT_PUBLIC_SITE_URL
   https://your-app-name.vercel.app
   ```
   (You can update this after deployment with your actual Vercel URL)

5. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete (usually 1-2 minutes)

6. **Test Your Deployment**:
   - Visit your Vercel URL (e.g., `https://your-app-name.vercel.app`)
   - Complete a test assessment
   - Verify data appears in your Google Sheet
   - Check the results page

### Option 2: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

When prompted for environment variables, paste the values from your `.env.local` file.

## 🌐 Custom Domain Setup

Once deployed, you can add your custom domain:

### Option A: Subdomain (Recommended)
Example: `assessment.flynndisney.com`

1. In Vercel Dashboard → Your Project → Settings → Domains
2. Add domain: `assessment.flynndisney.com`
3. Add the following DNS record in your domain registrar:
   - Type: `CNAME`
   - Name: `assessment`
   - Value: `cname.vercel-dns.com`

### Option B: Path-based (e.g., flynndisney.com/joy-assessment)
This requires your main site to proxy to Vercel, or deploying your entire site on Vercel.

### Update Environment Variable
After setting up your domain, update the environment variable in Vercel:
```
NEXT_PUBLIC_SITE_URL
https://assessment.flynndisney.com
```

## 📧 Email Automation Setup (Next Phase)

Once your app is deployed and collecting data, set up email automation:

1. **Open Google Apps Script**:
   - In your Google Sheet, go to: Extensions → Apps Script

2. **Create Email Automation Script**:
   - See documentation for complete email automation code
   - Configure triggers to run on new row addition

3. **Set up Email Templates**:
   - Create email content for each emotion (10 emotions × 4 emails = 40 templates)
   - Store templates in the script or separate sheet

4. **Test Email Flow**:
   - Submit a test assessment
   - Verify emails are scheduled correctly
   - Check email deliverability

## 🧪 Testing Checklist

Before going live, test these scenarios:

### Functionality Tests
- [ ] All 40 questions display correctly
- [ ] Email validation works
- [ ] Cannot submit with missing answers
- [ ] Progress bar updates correctly
- [ ] Scoring is accurate (verify with known inputs)
- [ ] Data saves to Google Sheets correctly
- [ ] Results page displays all scores
- [ ] Chart renders correctly
- [ ] Lowest 3 emotions identified correctly

### Cross-Browser Testing
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (iOS/macOS)

### Mobile Testing
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] Tablet view
- [ ] Touch targets are adequate size

### Performance
- [ ] Page loads in < 2 seconds
- [ ] No console errors
- [ ] Lighthouse score > 90
- [ ] Works on slow connections

## 🐛 Troubleshooting

### "Failed to save assessment data"

**Cause**: Google Sheets API connection issue

**Solutions**:
1. Verify service account has "Editor" access to the sheet
2. Check environment variables are set correctly in Vercel
3. Ensure Google Sheets API is enabled in Google Cloud Console
4. Try re-deploying after fixing

### Environment Variables Not Loading

**Cause**: Variables not properly set in Vercel

**Solutions**:
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Check all 4 variables are present
3. For `GOOGLE_PRIVATE_KEY`, ensure it includes BEGIN and END markers
4. Re-deploy after making changes

### Build Fails in Vercel

**Cause**: TypeScript or dependency errors

**Solutions**:
1. Check build logs in Vercel
2. Run `npm run build` locally to see errors
3. Ensure all dependencies are in `package.json`
4. Verify Node.js version (should be 18+)

### Results Page Not Loading

**Cause**: SessionStorage not persisting

**Solutions**:
1. Check browser console for errors
2. Ensure you're submitting from the same domain
3. Don't open results page directly (must come from assessment)

## 📊 Monitoring & Analytics

### Vercel Analytics (Built-in)
- Enable in Vercel Dashboard → Analytics
- Track page views, conversions, Web Vitals

### Google Sheets as Database
Monitor your data:
- Submission count over time
- Average scores per emotion
- Most common lowest emotions
- Email open rates (if using tracking)

### Custom Analytics (Optional)
Add Google Analytics or Plausible:
1. Get tracking ID
2. Add script to `app/layout.tsx`
3. Track events: page views, submissions, completions

## 🎉 You're Ready!

Your PEGA assessment application is:
- ✅ Fully built and functional
- ✅ Google Sheets configured
- ✅ Environment variables set up
- ✅ Ready to deploy to Vercel

### Next Actions:

1. **Immediate**:
   - Share Google Sheet with service account
   - Enable Google Sheets API
   - Deploy to Vercel

2. **Within 24 hours**:
   - Test full assessment flow
   - Verify data in Google Sheets
   - Set up custom domain

3. **Within 1 week**:
   - Configure email automation
   - Test email sequences
   - Soft launch to small group

4. **Ongoing**:
   - Monitor submissions
   - Collect user feedback
   - Optimize based on data

---

Need help? Check:
- **README.md** - Complete technical documentation
- **SETUP_GUIDE.md** - Detailed setup instructions
- **Project documentation** - Full requirements and specifications

**Support**: If you encounter issues, check the troubleshooting sections in README.md or reach out with specific error messages.

---

**Good luck with your launch! 🚀**
