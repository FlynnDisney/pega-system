# Google Apps Script Email Automation Setup Guide

This guide walks you through setting up the automated email system for PEGA assessments.

## Prerequisites

✅ PEGA assessment app deployed and working
✅ Google Sheet receiving assessment data
✅ All email content prepared (see ALL_EMAIL_CONTENT.md)

## Overview

The email automation system:
- Monitors your Google Sheet for new submissions
- Sends a welcome email immediately
- Schedules 12 personalized emails over 3 weeks
- Tailors content to each user's 3 lowest emotions
- Marks submissions as processed to avoid duplicates

## Step-by-Step Setup

### Step 1: Access Google Apps Script

1. Open your Google Sheet (the one receiving PEGA data)
2. Go to **Extensions → Apps Script**
3. You'll see a code editor with a default `Code.gs` file

### Step 2: Add the Email Automation Script

1. Delete any existing code in `Code.gs`
2. Copy the entire contents of `EmailAutomation.gs` from the `google-apps-script` folder
3. Paste it into the code editor
4. Click **File → Save** (or Ctrl/Cmd + S)
5. Name your project: "PEGA Email Automation"

### Step 3: Configure Settings

In the script, update the `CONFIG` object at the top:

```javascript
const CONFIG = {
  SHEET_NAME: 'Sheet1', // Your sheet name (check the tab name at bottom of Google Sheet)
  FROM_NAME: 'Flynn Disney', // Your name
  FROM_EMAIL: 'your-email@gmail.com', // Your sending email (must match Google account)
  CHECK_INTERVAL_HOURS: 1 // How often to check for new submissions
};
```

**Important:** The `FROM_EMAIL` must match the Google account that owns the sheet.

### Step 4: Add All Email Content

The script template includes placeholders for email content. You need to add the full text for all 40 emails.

In the `EMAIL_BODIES` object (near the bottom of the script), add all email content:

```javascript
const EMAIL_BODIES = {
  'Pride': {
    1: `[Full text of Pride Email 1]`,
    2: `[Full text of Pride Email 2]`,
    3: `[Full text of Pride Email 3]`,
    4: `[Full text of Pride Email 4]`
  },
  'Inspiration': {
    1: `[Full text of Inspiration Email 1]`,
    // ... etc
  },
  // Add all 10 emotions × 4 emails each
};
```

**Tip:** Use the email content provided in ALL_EMAIL_CONTENT.md as your reference.

### Step 5: Test Sheet Reading

Before setting up automation, test that the script can read your sheet:

1. In the Apps Script editor, click the function dropdown (says "Select function")
2. Select **testReadSheet**
3. Click the **Run** button (▶️)
4. The first time, you'll need to authorize:
   - Click "Review Permissions"
   - Choose your Google account
   - Click "Advanced" → "Go to PEGA Email Automation (unsafe)"
   - Click "Allow"
5. After running, click **View → Logs** to see the output

**Expected output:**
```
Total rows: 2
Headers: Timestamp,Email,Q1,Q2,Q3...
First data row email: test@example.com
Lowest emotions: Pride,Gratitude,Hope
```

If you see this, the script is reading your sheet correctly! ✅

### Step 6: Test Welcome Email

Send yourself a test welcome email:

1. In the script, find the `testWelcomeEmail()` function
2. Change `'your-test-email@example.com'` to your actual email
3. Select **testWelcomeEmail** from the function dropdown
4. Click **Run** (▶️)
5. Check your email inbox

If you received the welcome email, email sending works! ✅

### Step 7: Set Up Automated Checking

Now set up the hourly trigger that will automatically process new submissions:

1. Select **setupTrigger** from the function dropdown
2. Click **Run** (▶️)
3. Check the logs - you should see:
   `Trigger set up successfully. Will check for new submissions every 1 hour(s)`

The automation is now live! ✅

### Step 8: Verify Trigger Is Active

1. In Apps Script editor, click the **clock icon** (⏰) in the left sidebar
2. You should see a trigger:
   - **Function:** checkForNewSubmissions
   - **Event:** Time-driven
   - **Interval:** Every hour

If you see this, the trigger is active! ✅

## How It Works

### Automatic Processing Flow

1. **Every hour**, the `checkForNewSubmissions` function runs
2. It reads all rows in your Google Sheet
3. For each row where Column BF (Email_Sequence_Started) ≠ "TRUE":
   - Sends welcome email immediately
   - Schedules 12 emails based on the user's 3 lowest emotions
   - Marks the row as processed (sets Column BF to "TRUE")

### Email Schedule

For each user, emails are scheduled as follows:

**Emotion 1 (Lowest score):**
- Day 0: Understanding [Emotion]
- Day 1: First Intervention
- Day 3: Second Intervention
- Day 5: Integration

**Emotion 2 (Second lowest):**
- Day 7: Understanding [Emotion]
- Day 8: First Intervention
- Day 10: Second Intervention
- Day 12: Integration

**Emotion 3 (Third lowest):**
- Day 14: Understanding [Emotion]
- Day 15: First Intervention
- Day 17: Second Intervention
- Day 19: Integration

All emails are scheduled to send at **9:00 AM** in your timezone.

## Monitoring & Management

### View Scheduled Emails

1. In Apps Script editor, click the **clock icon** (⏰)
2. You'll see all scheduled triggers
3. Each trigger represents one scheduled email

### Check Execution History

1. Click **clock icon** (⏰) → **Executions** tab
2. See all script runs, including successes and failures
3. Click any execution to see logs and error details

### Manually Process a Submission

If you need to manually trigger the email sequence:

1. In your Google Sheet, find the submission row
2. Change Column BF (Email_Sequence_Started) to blank or FALSE
3. Wait for the next hourly check (or run `checkForNewSubmissions` manually)

### Stop All Email Automation

To pause or stop the automation:

1. In Apps Script editor, click the **clock icon** (⏰)
2. Find the `checkForNewSubmissions` trigger
3. Click the **three dots** (⋮) → **Delete trigger**

To restart, run `setupTrigger` again.

## Troubleshooting

### Issue: "Permission denied" when running functions

**Solution:**
1. Run any function again
2. Click "Review Permissions"
3. Go through authorization flow
4. Make sure to allow email sending permissions

### Issue: Emails not sending

**Possible causes:**
1. **FROM_EMAIL doesn't match account**: Change to match Google account email
2. **Gmail daily limit reached**: Free accounts can send 100-500 emails/day
3. **Email content too long**: Gmail has a ~400KB limit per email
4. **Script execution quota exceeded**: Free accounts have daily runtime limits

**Check:**
- Apps Script → clock icon → Executions tab
- Look for error messages

### Issue: Welcome email sends but scheduled emails don't

**Solution:**
1. Check that EMAIL_BODIES contains all emotion content
2. Verify emotion names match exactly: 'Pride', 'Gratitude', etc (case-sensitive)
3. Check Apps Script → clock icon - you should see multiple triggers scheduled

### Issue: Duplicate emails sent

**Possible cause:** Multiple triggers created

**Solution:**
1. Delete all triggers (clock icon → three dots → Delete)
2. Run `setupTrigger` once to recreate
3. Check Column BF in sheet - should show "TRUE" for processed rows

### Issue: Script timeout errors

**Possible cause:** Processing too many rows at once

**Solution:**
1. Reduce CHECK_INTERVAL_HOURS to process smaller batches
2. Or manually mark old rows as "TRUE" in Column BF to skip them

## Email Content Management

### Updating Email Content

To change email text after setup:

1. Open Apps Script editor
2. Find the EMAIL_BODIES object
3. Update the desired email text
4. Click **File → Save**
5. Changes apply immediately to future emails

**Note:** This won't affect already-scheduled emails.

### Testing Individual Emails

To test a specific emotion email:

1. Add a test function:
```javascript
function testPrideEmail1() {
  const testEmail = 'your-test@example.com';
  GmailApp.sendEmail(testEmail, EMAIL_SUBJECTS['Pride'][1], EMAIL_BODIES['Pride'][1], {
    name: CONFIG.FROM_NAME
  });
}
```

2. Run the function
3. Check your inbox

## Best Practices

### Before Going Live

✅ Test with your own email first
✅ Verify all 40 email contents are present
✅ Check emails render correctly in Gmail, Outlook, etc
✅ Test with 2-3 real users before full launch
✅ Monitor the first week closely for issues

### Gmail Sending Limits

- **Free Gmail**: ~100 emails/day
- **Google Workspace**: ~2,000 emails/day

If you expect high volume:
- Use a Google Workspace account
- Or integrate with a dedicated email service (Mailchimp, SendGrid, etc)

### Email Deliverability

To ensure emails don't go to spam:
- Send from a professional email address
- Keep emails under 100KB
- Don't include too many links
- Encourage users to whitelist your email
- Monitor spam complaints

### Data Privacy

The script has access to:
- Email addresses in your sheet
- Can send emails on your behalf

Make sure your privacy policy covers:
- How email addresses are stored
- How emails are sent
- Option to unsubscribe

## Advanced Customization

### Change Email Send Time

In the `scheduleEmail` function, change:

```javascript
sendDate.setHours(9, 0, 0, 0); // Send at 9 AM
```

To:
```javascript
sendDate.setHours(14, 30, 0, 0); // Send at 2:30 PM
```

### Add Unsubscribe Link

Add to bottom of email body:

```javascript
const unsubscribeLink = `\n\n---\n\nDon't want to receive these emails? [Unsubscribe](https://flynndisney.com/unsubscribe?email=${email})`;
```

### Send HTML Emails

Change `sendEmail` to:

```javascript
GmailApp.sendEmail(email, subject, '', {
  name: CONFIG.FROM_NAME,
  htmlBody: htmlContent
});
```

### Track Email Opens

Use a tracking pixel or integrate with email services like SendGrid that provide analytics.

## Support

If you encounter issues:

1. Check **Executions** tab for error messages
2. Verify all configuration settings
3. Test individual functions to isolate the problem
4. Check Google Apps Script quotas and limits
5. Review authorization permissions

For Google Apps Script documentation:
https://developers.google.com/apps-script

---

## Summary Checklist

Before launching email automation:

- [ ] Apps Script code added and saved
- [ ] CONFIG settings updated (sheet name, email, etc)
- [ ] All 40 email contents added to EMAIL_BODIES
- [ ] testReadSheet runs successfully
- [ ] testWelcomeEmail delivers to inbox
- [ ] setupTrigger executed successfully
- [ ] Trigger appears in Triggers tab
- [ ] Test submission processed correctly
- [ ] All scheduled emails created for test user
- [ ] Test emails received at correct times
- [ ] Column BF marked as "TRUE" after processing

**Congratulations!** Your PEGA email automation is now live! 🎉

Users will automatically receive personalized email sequences based on their assessment results.
