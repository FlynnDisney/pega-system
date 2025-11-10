# PEGA Email Automation - Testing Procedures

This document provides comprehensive testing procedures to ensure your PEGA email automation system is working correctly before going live with real participants.

## Testing Philosophy

Test early, test often, test thoroughly. The system sends emails to real people, so it's critical to verify everything works correctly before launching.

## Pre-Testing Setup

Before running any tests, ensure:

- [ ] Participants tab is set up with all formulas
- [ ] EmailAutomation.gs script is installed and configured
- [ ] All 40 email bodies are added to the script
- [ ] CONFIG values are set correctly
- [ ] You have a test Google Form connected to the sheet

## Test Level 1: Component Testing

These tests verify individual components work in isolation.

### Test 1.1: Spreadsheet Formulas

**Purpose**: Verify Participants tab calculates scores correctly

**Steps**:
1. Open your Google Sheet
2. Go to Form Responses 1 tab
3. Add a manual test row with known values:
   - Column A: Current timestamp
   - Column B: your-test-email@example.com
   - Column C: Test User
   - Columns D-AQ: Enter specific values (e.g., all 1s, or varied scores)
4. Go to Participants tab
5. Verify the row auto-populates

**Expected Results**:
- ✓ New row appears in Participants tab
- ✓ All emotion scores calculate (range 1.0 to 5.0)
- ✓ Total Score = sum of all 40 responses
- ✓ Total % = (Total Score / 200) * 100
- ✓ Focus 1, 2, 3 show emotion names
- ✓ Email_Sequence_Started shows FALSE

**Test with specific patterns**:

**Pattern A: All minimum values**
- Enter `1` for all 40 questions
- Expected: All emotion scores = 1.0, Total = 40, Total % = 20%

**Pattern B: All maximum values**
- Enter `5` for all 40 questions
- Expected: All emotion scores = 5.0, Total = 200, Total % = 100%

**Pattern C: Test reverse scoring**
- Enter `5` for all regular items, `1` for all reverse-scored items (*):
  - Items 2, 5, 14, 18, 21, 25, 27, 29, 32 should have `1`
  - All others should have `5`
- Expected: After reverse scoring, all emotions should have similar scores

**✓ Pass Criteria**: All calculations match expected values, Focus emotions correctly identified

---

### Test 1.2: Script Sheet Access

**Purpose**: Verify script can read the Participants tab

**Steps**:
1. Open Apps Script editor
2. Select `testReadSheet` from function dropdown
3. Click Run (▶)
4. View execution log (View → Logs or Executions)

**Expected Results**:
```
✓ Sheet found: Participants
Total rows: 2 (or more)
First data row:
  Email: your-test-email@example.com
  Name: Test User
  Focus 1: [Emotion name]
  Focus 2: [Emotion name]
  Focus 3: [Emotion name]
  Sequence Started: FALSE
```

**✓ Pass Criteria**: No errors, data reads correctly

---

### Test 1.3: Welcome Email Sending

**Purpose**: Verify script can send emails via Gmail

**Steps**:
1. In EmailAutomation.gs, find `testWelcomeEmail()` function
2. Update test email to your address:
   ```javascript
   const testEmail = 'your-actual-email@example.com';
   ```
3. Save the script
4. Select `testWelcomeEmail` from function dropdown
5. Click Run (▶)
6. Authorize the script if prompted
7. Check your email inbox (including spam folder)

**Expected Results**:
- ✓ Execution log shows: "✓ Test welcome email sent to [your-email]"
- ✓ Email arrives within 1-2 minutes
- ✓ Subject: "Welcome to Your Positive Emotion Growth Course"
- ✓ From name shows: "Flynn Disney" (or your configured name)
- ✓ Email body contains welcome content
- ✓ Email is readable and well-formatted

**✓ Pass Criteria**: Email received with correct content and formatting

---

### Test 1.4: Emotion Email Content

**Purpose**: Verify all 40 emotion email bodies are present and correct

**Steps**:
1. In EmailAutomation.gs, find `testEmotionEmail()` function
2. Update settings:
   ```javascript
   const testEmail = 'your-actual-email@example.com';
   const testEmotion = 'Pride';
   const testEmailNumber = 1;
   ```
3. Save and run `testEmotionEmail`
4. Check your inbox
5. Repeat for various emotions and numbers

**Test Matrix** (sample):
| Emotion | Email # | Expected Subject |
|---------|---------|------------------|
| Pride | 1 | Pride 1: Understanding Pride |
| Pride | 2 | Pride 2: Finding pride in past achievements |
| Gratitude | 1 | Gratitude 1: Understanding Gratitude |
| Joy | 4 | Joy 4: Integrating Joy |

**✓ Pass Criteria**:
- All tested emails arrive
- Subject lines match expected
- Body content is complete and well-formatted
- No placeholder text like "[ADD CONTENT HERE]"

---

## Test Level 2: Integration Testing

These tests verify components work together correctly.

### Test 2.1: Trigger Setup

**Purpose**: Verify automation triggers are created correctly

**Steps**:
1. In Apps Script, select `setupAllTriggers` from dropdown
2. Click Run (▶)
3. Check execution log

**Expected Results**:
```
✓ Form submission trigger created
✓ Hourly backup trigger created (checks every 1 hour)

✓ Setup complete! Email automation is now active.
```

4. Click Triggers icon (⏰) in left sidebar
5. Verify you see:
   - `onFormSubmit` - Event: On form submit, From spreadsheet
   - `checkForNewSubmissions` - Event: Time-driven, Hour timer

**✓ Pass Criteria**:
- Both triggers exist
- No error messages in execution log

---

### Test 2.2: Form Submission Processing

**Purpose**: Verify form submission triggers email sequence

**Steps**:
1. Ensure triggers are set up (Test 2.1)
2. In Participants tab, note current highest ID number
3. Open your Google Form
4. Fill out all 40 questions with test data
   - Use your real email address
   - Vary responses to create distinct lowest emotions
5. Submit the form
6. Wait 2-3 minutes
7. Check Participants tab
8. Check your email inbox
9. Check Apps Script → Triggers (⏰)
10. Check Apps Script → Executions (📋)

**Expected Results**:

**In Participants tab**:
- ✓ New row appears with your data
- ✓ All scores calculated correctly
- ✓ Focus 1, 2, 3 identified
- ✓ Email_Sequence_Started changed to TRUE

**In Email inbox**:
- ✓ Welcome email received within 2 minutes
- ✓ Email correctly addressed to you

**In Triggers list**:
- ✓ 14 new triggers created:
  - 4 triggers for Focus 1 emotion (Days 0, 1, 3, 5)
  - 4 triggers for Focus 2 emotion (Days 7, 8, 10, 12)
  - 4 triggers for Focus 3 emotion (Days 14, 15, 17, 19)
  - 1 trigger for reminder email (Day 23)
  - 1 trigger for reassessment email (Day 28)
- ✓ All triggers scheduled for 9:00 AM (or your configured time)
- ✓ Trigger dates are correct (today + offset days)

**In Executions log**:
- ✓ `onFormSubmit` execution shows success
- ✓ Log shows "Started email sequence for [your-email]"
- ✓ Log shows "Complete: 14 emails scheduled"

**✓ Pass Criteria**: All expected results achieved, no errors

---

### Test 2.3: Hourly Backup Check

**Purpose**: Verify hourly backup processes missed submissions

**Steps**:
1. In Participants tab, find a test row
2. Change column AB (Email_Sequence_Started) to FALSE
3. Wait for next hour, OR manually run `checkForNewSubmissions`
4. Check execution log
5. Check that row's Email_Sequence_Started status
6. Check Triggers list for new scheduled emails

**Expected Results**:
- ✓ checkForNewSubmissions executes
- ✓ Log shows "Started email sequence for [email]"
- ✓ Email_Sequence_Started marked TRUE
- ✓ 14 triggers created

**✓ Pass Criteria**: Missed submission is caught and processed

---

### Test 2.4: Duplicate Prevention

**Purpose**: Verify system doesn't send duplicates

**Steps**:
1. Submit a test form
2. Wait for processing (Email_Sequence_Started = TRUE)
3. Manually run `checkForNewSubmissions` again
4. Check execution log
5. Check Triggers list

**Expected Results**:
- ✓ Log shows "No new submissions to process"
- ✓ No duplicate triggers created
- ✓ No duplicate welcome email sent

**✓ Pass Criteria**: System correctly identifies already-processed submissions

---

## Test Level 3: End-to-End Testing

These tests verify the complete user journey works correctly.

### Test 3.1: Complete 28-Day Sequence (Accelerated)

**Purpose**: Verify all scheduled emails send correctly

**Note**: This test is time-consuming. Consider testing with accelerated timing (1-hour intervals instead of days) by temporarily modifying `calculateSendDate()`.

**Temporary modification for testing** (revert after testing):
```javascript
function calculateSendDate(daysFromNow) {
  const sendDate = new Date();
  sendDate.setMinutes(sendDate.getMinutes() + (daysFromNow * 2)); // 2 minutes per "day"
  return sendDate;
}
```

**Steps**:
1. Make temporary modification above
2. Submit test form
3. Monitor your inbox over the next ~1 hour
4. Track all 14 emails as they arrive

**Expected Email Schedule** (accelerated - 2 min per day):
- Minute 0: Welcome email
- Minute 0: Focus 1 Email 1 (Understanding)
- Minute 2: Focus 1 Email 2 (Intervention 1)
- Minute 6: Focus 1 Email 3 (Intervention 2)
- Minute 10: Focus 1 Email 4 (Integration)
- Minute 14: Focus 2 Email 1 (Understanding)
- Minute 16: Focus 2 Email 2 (Intervention 1)
- Minute 20: Focus 2 Email 3 (Intervention 2)
- Minute 24: Focus 2 Email 4 (Integration)
- Minute 28: Focus 3 Email 1 (Understanding)
- Minute 30: Focus 3 Email 2 (Intervention 1)
- Minute 34: Focus 3 Email 3 (Intervention 2)
- Minute 38: Focus 3 Email 4 (Integration)
- Minute 46: Reminder email (Day 23)
- Minute 56: Reassessment email (Day 28)

**✓ Pass Criteria**:
- All 14 emails received
- Correct order and timing
- Correct emotions for each user
- Each email has correct content
- No missing or duplicate emails

**Important**: After testing, revert the `calculateSendDate()` function to production version!

---

### Test 3.2: Multiple Concurrent Users

**Purpose**: Verify system handles multiple users simultaneously

**Steps**:
1. Prepare 3 test users with different email addresses
2. Submit 3 forms within 5 minutes
3. Monitor all 3 inboxes
4. Check Participants tab
5. Check Triggers list

**Expected Results**:
- ✓ All 3 users processed correctly
- ✓ Each user gets welcome email immediately
- ✓ 42 triggers created total (14 per user)
- ✓ Each user's emails are scheduled for their correct emotions
- ✓ No cross-contamination (User A doesn't get User B's emails)

**✓ Pass Criteria**: Each user receives correct personalized sequence

---

### Test 3.3: Edge Cases

**Purpose**: Verify system handles unusual scenarios

**Test 3.3.1: Incomplete Form Response**
1. Manually add a row in Form Responses 1 with missing question responses
2. Run `checkForNewSubmissions`
3. Expected: Row skipped with log message "Incomplete data, skipping"

**Test 3.3.2: Invalid Email Address**
1. Submit form with clearly invalid email (e.g., "notanemail")
2. Expected: Welcome email fails, error logged to Error Log tab

**Test 3.3.3: Tie in Emotion Scores**
1. Create test data where multiple emotions have same low score
2. Expected: System picks one for each Focus slot, no errors

**Test 3.3.4: All Same Scores**
1. Enter same value (e.g., "3") for all 40 questions
2. Expected: System identifies 3 emotions arbitrarily, processes normally

**✓ Pass Criteria**: System handles edge cases gracefully, logs errors appropriately

---

## Test Level 4: Performance & Reliability

### Test 4.1: Gmail Sending Limits

**Purpose**: Verify system respects Gmail limits

**Information**:
- Free Gmail: 100-500 emails/day
- Google Workspace: 2,000 emails/day

**Calculation**:
- Each user generates 14 emails over 28 days
- Welcome email counts toward daily limit immediately
- Other 13 emails spread over 28 days

**Test** (for high-volume scenarios):
1. Estimate daily new users
2. Calculate daily emails: (New users) + (existing users reaching scheduled email day)
3. Verify total stays under limits

**Example**:
- 10 new users/day = 10 welcome emails/day
- Plus ~5 scheduled emails from previous days
- Total ~15 emails/day (well under limit)

**✓ Pass Criteria**: Projected email volume stays under Gmail limits

---

### Test 4.2: Script Execution Time

**Purpose**: Verify script completes within time limits

**Apps Script Limits**:
- 6 minutes per execution (free)
- 30 minutes (Google Workspace)

**Steps**:
1. In Executions log, check duration of `checkForNewSubmissions`
2. Note time for processing different numbers of rows

**Expected**:
- 1 row: < 10 seconds
- 10 rows: < 1 minute
- 100 rows: < 5 minutes

**✓ Pass Criteria**: All executions complete well under 6-minute limit

---

## Test Level 5: User Experience Testing

### Test 5.1: Email Formatting

**Purpose**: Verify emails look good on various devices/clients

**Steps**:
1. Send test emails to yourself
2. Check on multiple email clients:
   - Gmail web interface
   - Gmail mobile app
   - Outlook
   - Apple Mail
   - Other clients your users might use

**Check for**:
- ✓ Line breaks preserve properly
- ✓ No weird character encoding issues
- ✓ URLs are clickable
- ✓ Text is readable (not too small, not too large)
- ✓ No truncation in subject lines

**✓ Pass Criteria**: Emails are readable and well-formatted across all tested clients

---

### Test 5.2: Content Quality

**Purpose**: Verify email content is appropriate and error-free

**Steps**:
1. Read through all 40 emotion emails
2. Check for:
   - Spelling/grammar errors
   - Broken links
   - Incorrect emotion names
   - Placeholder text still present
   - Tone consistency
   - Instructions clarity

**Use checklist**:
- [ ] All URLs work and point to correct destinations
- [ ] No [PLACEHOLDER] text remains
- [ ] Emotion names match throughout each sequence
- [ ] Instructions are clear and actionable
- [ ] Tone matches Flynn's style (minimalist, research-informed)
- [ ] CTA links work (flynndisney.com/joy)
- [ ] No personal/test info accidentally left in

**✓ Pass Criteria**: All content is polished, professional, and error-free

---

## Production Readiness Checklist

Before going live with real participants, verify:

**Technical Setup**:
- [ ] All formulas in Participants tab tested and verified
- [ ] EmailAutomation.gs configured with correct values
- [ ] All 40 email bodies added to script
- [ ] Triggers set up and visible in Triggers panel
- [ ] testReadSheet() runs successfully
- [ ] testWelcomeEmail() delivers successfully

**Testing Complete**:
- [ ] Level 1 tests passed (Components)
- [ ] Level 2 tests passed (Integration)
- [ ] Level 3 tests passed (End-to-End)
- [ ] Level 4 tests passed (Performance)
- [ ] Level 5 tests passed (User Experience)

**Content Quality**:
- [ ] All 40 emails reviewed for errors
- [ ] All URLs tested and working
- [ ] No placeholder text remains
- [ ] Tone and style consistent throughout
- [ ] Instructions clear and actionable

**Operational Readiness**:
- [ ] Monitoring plan in place (how often to check logs)
- [ ] Error response plan (what to do if something breaks)
- [ ] Backup/recovery plan (how to fix if needed)
- [ ] Gmail sending limits calculated and acceptable
- [ ] Privacy policy updated
- [ ] Unsubscribe process defined

**Documentation**:
- [ ] Setup guide reviewed and accurate
- [ ] Testing procedures followed
- [ ] Known issues documented
- [ ] Admin contact info added to system

---

## Ongoing Testing

After launch, continue testing:

**Week 1**: Daily checks
- Check Executions log for errors
- Verify new submissions process correctly
- Monitor email deliverability
- Check Error Log tab daily

**Week 2-4**: 2-3 times per week
- Spot-check random participants
- Verify scheduled emails are sending
- Monitor trigger queue

**After 28 days**:
- Verify reassessment emails sent
- Check reassessment response rates
- Gather user feedback
- Test any system changes thoroughly before deploying

---

## Test Data Cleanup

After testing, clean up test data:

1. **Participants tab**: Delete all test rows
2. **Form Responses 1**: Delete test responses
3. **Triggers**: Click Triggers (⏰) → Delete test user triggers
4. **Script Properties**: Run `clearAllProperties()` (optional)
5. **Error Log**: Review and clear if desired

**Then reset**:
1. Run `setupAllTriggers()` again
2. System is now ready for production

---

## Quick Reference: Testing Functions

| Function | Purpose | When to Use |
|----------|---------|-------------|
| `testReadSheet()` | Verify sheet access | Initial setup, after changes |
| `testWelcomeEmail()` | Test welcome email | Before launch, after content changes |
| `testEmotionEmail()` | Test specific emotion email | Verify email content |
| `setupAllTriggers()` | Initialize automation | Initial setup, after removing triggers |
| `removeAllTriggers()` | Disable automation | During testing, maintenance |
| `checkForNewSubmissions()` | Manual processing | Test backup mechanism |
| `listAllTriggers()` | View scheduled emails | Debugging, monitoring |
| `clearAllProperties()` | Clear stored data | Reset after testing |
| `manualProcessRow()` | Process specific row | Debugging individual issues |

---

**Remember**: Testing saves time, prevents errors, and ensures a smooth experience for your participants. Take the time to test thoroughly before going live!
