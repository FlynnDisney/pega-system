# PEGA Email Automation - Complete Setup Guide

This guide walks you through setting up the complete PEGA email automation system from start to finish.

## Prerequisites

Before starting, ensure you have:

- [ ] Google Sheet with PEGA form responses
- [ ] Google Form connected to the sheet (optional but recommended)
- [ ] Your complete email content ready (40 emotion emails)
- [ ] Gmail account with sending permissions
- [ ] 60-90 minutes for complete setup

## Overview

The system consists of three main components:

1. **Form Responses 1 tab** - Auto-populated by Google Forms
2. **Participants tab** - Calculates scores and identifies lowest emotions
3. **Google Apps Script** - Automates email sequences

## Part 1: Set Up Your Google Sheet

### Step 1.1: Verify Form Responses Tab

1. Open your Google Sheet
2. Locate the "Form Responses 1" tab (or similar name)
3. Verify it has:
   - Column A: Timestamp
   - Column B: Email (or adjust if different)
   - Column C: Name (optional)
   - Columns D-AQ: 40 PEGA questions (responses 1-5)

**If your column layout is different**, note the differences - you'll need to adjust formulas later.

### Step 1.2: Create Participants Tab

1. Create a new tab named exactly "Participants"
2. In row 1, add these headers (columns A-AB):

```
ID | Timestamp | Email | Name | Status | Total Score | Total % | Joy Score | Gratitude Score | Serenity Score | Interest Score | Hope Score | Pride Score | Amusement Score | Inspiration Score | Awe Score | Love Score | Focus 1 | Focus 2 | Focus 3 | Current Day | Current Emotion | Last Email | Last Email Date | Engagement | Raw Responses | Notes | Email_Sequence_Started
```

3. Follow the formulas in `PARTICIPANTS_TAB_SETUP.md` to populate columns
4. Test with existing form responses to verify calculations work

**⏱ Estimated time**: 30-45 minutes

**✓ Checkpoint**: After submitting a test form response, verify:
- Participants tab auto-populates
- All emotion scores calculate correctly (1-5 range)
- Focus 1, 2, 3 identify the three lowest emotions
- Email_Sequence_Started shows FALSE

## Part 2: Set Up Google Apps Script

### Step 2.1: Access Apps Script Editor

1. In your Google Sheet, go to **Extensions → Apps Script**
2. You'll see a code editor with default code
3. Click on the project name (top left) and rename to "PEGA Email Automation"

### Step 2.2: Add the Email Automation Script

1. Select all the default code and delete it
2. Open the file `EmailAutomation.gs` from this repository
3. Copy the entire contents
4. Paste into the Apps Script editor
5. Click **File → Save** (or Ctrl/Cmd + S)

### Step 2.3: Configure Settings

In the script, find the `CONFIG` object (around line 39) and update these values:

```javascript
const CONFIG = {
  // Sheet Configuration
  PARTICIPANTS_SHEET_NAME: 'Participants',  // Must match your tab name exactly

  // Email Configuration
  FROM_NAME: 'Flynn Disney',                  // Your name
  FROM_EMAIL: 'contact@flynndisney.com',      // Must match your Gmail address

  // Automation Settings
  CHECK_INTERVAL_HOURS: 1,                     // How often to check (recommend 1)
  EMAIL_SEND_HOUR: 9,                          // When to send emails (9 = 9 AM)
  EMAIL_SEND_MINUTE: 0,                        // Minute of the hour

  // Column indices (only change if your Participants tab structure differs)
  COLUMNS: {
    ID: 0,
    TIMESTAMP: 1,
    EMAIL: 2,
    NAME: 3,
    FOCUS_1: 17,
    FOCUS_2: 18,
    FOCUS_3: 19,
    EMAIL_SEQUENCE_STARTED: 27
  }
};
```

**Important**: `FROM_EMAIL` must match the Google account that owns this spreadsheet.

### Step 2.4: Add Email Content

**This is the most time-consuming step**. You need to add all 40 email bodies.

1. In the script, search for: `ADD YOUR COMPLETE EMAIL CONTENT`
2. You'll find the `EMAIL_CONTENT` object with placeholders
3. Replace each placeholder with your actual email content

For example, replace:
```javascript
2: {
  subject: 'Pride 2: Finding pride in past achievements',
  body: `[ADD PRIDE EMAIL 2 CONTENT HERE]`
},
```

With:
```javascript
2: {
  subject: 'Pride 2: Finding pride in past achievements',
  body: `In the last email, you learnt that effort attributions are the key to authentic pride.

In this email, you're going to learn an intervention for practising the skill of recognising effort.

All you need is a pen and paper, and as little as five minutes.

... [rest of email content] ...`
},
```

**Pro tip**: Use multi-line strings (backticks) to preserve formatting and line breaks.

**⏱ Estimated time**: 20-30 minutes (depending on how organized your email content is)

### Step 2.5: Save the Script

1. Click **File → Save** or press Ctrl/Cmd + S
2. Verify no syntax errors appear at the bottom of the editor
3. If errors appear, check for:
   - Missing commas between email objects
   - Unmatched quotes or backticks
   - Missing brackets or braces

**✓ Checkpoint**: Script saves without errors

## Part 3: Test the Setup

### Step 3.1: Test Sheet Reading

1. In Apps Script editor, find the function dropdown (top toolbar)
2. Select **testReadSheet** from the dropdown
3. Click the **Run** button (▶ icon)
4. **First time only**: You'll need to authorize the script
   - Click "Review Permissions"
   - Choose your Google account
   - Click "Advanced" → "Go to PEGA Email Automation (unsafe)"
   - Click "Allow"
5. After it runs, click **View → Executions** to see the log
6. You should see output like:

```
✓ Sheet found: Participants
Total rows: 2
First data row:
  Email: test@example.com
  Name: Test User
  Focus 1: Pride
  Focus 2: Gratitude
  Focus 3: Hope
  Sequence Started: FALSE
```

**✓ Checkpoint**: Test reads your sheet data correctly

### Step 3.2: Test Welcome Email

1. In the script, find the `testWelcomeEmail()` function (around line 955)
2. Change the test email to your own:
```javascript
const testEmail = 'your-email@example.com'; // CHANGE THIS
```
3. Save the script
4. Select **testWelcomeEmail** from the function dropdown
5. Click **Run** (▶)
6. Check your email inbox

**✓ Checkpoint**: You receive the welcome email within 1-2 minutes

### Step 3.3: Test an Emotion Email (Optional)

1. Find the `testEmotionEmail()` function (around line 1009)
2. Update the test email and choose an emotion to test:
```javascript
const testEmail = 'your-email@example.com'; // CHANGE THIS
const testEmotion = 'Pride';
const testEmailNumber = 1;
```
3. Save and run **testEmotionEmail**
4. Check your inbox

**✓ Checkpoint**: You receive the Pride email #1

**⏱ Estimated time**: 15-20 minutes (including authorization)

## Part 4: Activate the Automation

### Step 4.1: Set Up Triggers

1. In Apps Script editor, select **setupAllTriggers** from the function dropdown
2. Click **Run** (▶)
3. Check the execution log - you should see:

```
✓ Form submission trigger created
✓ Hourly backup trigger created (checks every 1 hour)

✓ Setup complete! Email automation is now active.
Test with a form submission or run checkForNewSubmissions manually.
```

4. Click the **Triggers** icon (⏰) in the left sidebar
5. Verify you see two triggers:
   - `onFormSubmit` - Event source: From spreadsheet / On form submit
   - `checkForNewSubmissions` - Event source: Time-driven / Hour timer

**✓ Checkpoint**: Two triggers are active and visible in the Triggers panel

### Step 4.2: Submit a Test Form Response

1. Open your Google Form
2. Fill it out with test data (use your own email)
3. Submit the form
4. Wait 1-2 minutes
5. Check your Participants tab:
   - New row should appear
   - `Email_Sequence_Started` should change to TRUE
6. Check your email inbox:
   - Welcome email should arrive immediately
7. Click **Triggers** icon (⏰) in Apps Script
8. You should see 14 new scheduled triggers:
   - 12 emotion-specific emails (e.g., `sendEmail_Pride_1`)
   - 1 reminder email (`sendReminderEmail`)
   - 1 reassessment email (`sendReassessmentEmail`)

**✓ Checkpoint**:
- Welcome email received
- 14 triggers scheduled for future dates
- Email_Sequence_Started marked TRUE

**⏱ Estimated time**: 10 minutes

## Part 5: Monitoring and Maintenance

### View Execution History

1. In Apps Script, click **Executions** icon (📋) in the left sidebar
2. See all script runs with timestamps
3. Click any execution to see detailed logs
4. Look for ✓ (success) or ✗ (error) indicators

### View Scheduled Emails

1. Click **Triggers** icon (⏰)
2. See all upcoming emails with scheduled times
3. Each row shows:
   - Function name (e.g., `sendEmail_Joy_2`)
   - Event type (Time-driven)
   - Runs at (scheduled date/time)

### Check Error Log

1. Go to your Google Sheet
2. Look for an "Error Log" tab (created automatically on first error)
3. Review any errors with timestamps and details

### Manual Processing (if needed)

If a submission was missed:

1. In the Participants tab, find the row
2. Change column AB (Email_Sequence_Started) to FALSE
3. Wait for the hourly check, OR
4. Run **checkForNewSubmissions** manually in Apps Script

## Troubleshooting

### Problem: "Permission denied" errors

**Solution**:
1. Run any function again
2. Go through authorization flow
3. Ensure you're using the Google account that owns the sheet

### Problem: Emails not sending

**Check**:
1. FROM_EMAIL matches your Google account
2. Gmail daily sending limits (100-500 emails/day for free accounts)
3. Email content isn't too long (max ~400KB per email)
4. Check Executions log for specific error messages

### Problem: Duplicate emails

**Solution**:
1. Click Triggers (⏰) → Delete all triggers
2. Run `setupAllTriggers` once
3. Verify Email_Sequence_Started is TRUE for processed rows

### Problem: Formulas showing #REF! error

**Solution**:
1. Verify "Form Responses 1" tab name matches exactly
2. Check that form questions are in columns D-AQ
3. Adjust formula references if your layout differs

### Problem: Wrong emotions identified

**Check**:
1. Verify reverse scoring is implemented correctly in formulas
2. Ensure all 40 questions are answered (no blanks)
3. Responses are numbers 1-5, not text

### Problem: Script execution timeout

**Solution**:
1. If processing many rows, do it in batches
2. Manually mark old rows as TRUE in column AB
3. Reduce CHECK_INTERVAL_HOURS to process fewer rows per check

## Customization

### Change Email Send Time

In CONFIG:
```javascript
EMAIL_SEND_HOUR: 14,     // 2 PM
EMAIL_SEND_MINUTE: 30,   // Half past the hour
```

### Add Unsubscribe Functionality

In each email body, add:
```javascript
body: `[email content]

---
Don't want these emails? Reply with "unsubscribe" and I'll remove you.`
```

### Send HTML Emails

Replace `sendEmail` calls with:
```javascript
GmailApp.sendEmail(email, subject, '', {
  name: CONFIG.FROM_NAME,
  htmlBody: htmlContent
});
```

## Gmail Sending Limits

Be aware of daily limits:
- **Free Gmail**: 100-500 emails/day
- **Google Workspace**: 2,000 emails/day

Each user generates 14 emails over 28 days, so plan accordingly:
- Free account: Can handle 7-35 new users per day
- Workspace account: Can handle ~140 new users per day

## Security & Privacy

**Best Practices**:
- Don't share your Google Sheet with unauthorized users
- Include privacy notice in welcome email
- Provide unsubscribe mechanism
- Store minimal personal data
- Delete old data periodically

## Testing Checklist

Before going live with real users:

- [ ] Submitted test form → Welcome email received < 2 minutes
- [ ] Participants tab calculates all scores correctly
- [ ] Focus 1, 2, 3 identify correct lowest emotions
- [ ] 14 triggers created for test user
- [ ] Email_Sequence_Started marked TRUE
- [ ] testReadSheet() runs without errors
- [ ] testWelcomeEmail() delivers successfully
- [ ] All 40 email bodies added to script
- [ ] Tested on mobile devices (check email formatting)
- [ ] Monitored first 2-3 users for any issues
- [ ] Error Log tab reviewed (if exists)

## Support & Help

If you encounter issues:

1. Check the **Executions** log for error messages
2. Review **Triggers** to ensure they're active
3. Verify CONFIG settings match your setup
4. Test individual functions to isolate problems
5. Check Google Apps Script quotas/limits
6. Review authorization permissions

**Useful Functions for Debugging**:
- `testReadSheet()` - Verify sheet access
- `testWelcomeEmail()` - Test email sending
- `testEmotionEmail()` - Test specific emotion email
- `listAllTriggers()` - View all scheduled emails
- `manualProcessRow()` - Manually process a specific row

## Going Live

**Final Pre-Launch Checklist**:

1. [ ] Complete setup and testing finished
2. [ ] All 40 emails reviewed for typos/errors
3. [ ] Email content matches your brand voice
4. [ ] Privacy policy updated
5. [ ] Gmail sending limits considered
6. [ ] Backup plan if script fails
7. [ ] Monitoring strategy in place
8. [ ] First week: Check daily for issues
9. [ ] After 28 days: Review reassessment data

## Post-Launch Monitoring

**Week 1**: Check daily
- Executions log for errors
- Participants tab for new submissions
- Trigger list to ensure emails scheduling correctly
- Error Log tab for any issues

**Week 2-4**: Check 2-3 times per week
- Overall system health
- User completion rates
- Any reported issues from users

**After 28 days**:
- Review reassessment response rates
- Check email open rates (if tracking set up)
- Gather user feedback
- Iterate on email content if needed

---

## Quick Reference

**Key Files**:
- `EmailAutomation.gs` - Main script file
- `PARTICIPANTS_TAB_SETUP.md` - Formula reference
- `COMPLETE_SETUP_GUIDE.md` - This document

**Key Functions**:
- `setupAllTriggers()` - Initialize automation (run once)
- `checkForNewSubmissions()` - Process new rows (runs hourly)
- `onFormSubmit()` - Process on form submit (automatic)
- `removeAllTriggers()` - Disable automation

**Important CONFIG Values**:
- `PARTICIPANTS_SHEET_NAME` - Must match tab name exactly
- `FROM_EMAIL` - Must match your Google account
- `EMAIL_SEND_HOUR` - When emails are sent (24-hour format)
- `COLUMNS.EMAIL_SEQUENCE_STARTED` - Index 27 (column AB)

**Support Resources**:
- Google Apps Script documentation: https://developers.google.com/apps-script
- Google Sheets formulas: https://support.google.com/docs/table/25273
- Gmail sending limits: https://support.google.com/mail/answer/22839

---

**Congratulations!** Your PEGA Email Automation System is now live! 🎉

Users will automatically receive personalized 28-day email sequences based on their assessment results. The system runs automatically with minimal maintenance required.
