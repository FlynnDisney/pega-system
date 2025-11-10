/**
 * ============================================
 * PEGA EMAIL AUTOMATION SYSTEM
 * Complete Google Apps Script for Email Automation
 * ============================================
 *
 * This script automates personalized 28-day email sequences based on
 * users' lowest-scoring emotions from the PEGA assessment.
 *
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet with PEGA data
 * 2. Go to Extensions → Apps Script
 * 3. Delete default code and paste this entire script
 * 4. Update CONFIG section below with your details
 * 5. Add all 40 email bodies in EMAIL_CONTENT section (search for "ADD YOUR EMAIL CONTENT")
 * 6. Save (Ctrl/Cmd + S)
 * 7. Run 'setupAllTriggers' function once
 * 8. Authorize when prompted
 *
 * FEATURES:
 * - Immediate welcome email on form submission
 * - 12 personalized emotion-specific emails (days 0-20)
 * - Reminder email (day 23)
 * - Reassessment email (day 28)
 * - Total: 14 emails per user over 28 days
 * - Hourly backup check for missed submissions
 * - Duplicate prevention via Email_Sequence_Started flag
 * - All emails sent at 9:00 AM local time
 *
 * AUTHOR: Flynn Disney / Movement & Psychology
 * VERSION: 2.0
 * LAST UPDATED: 2025-01-10
 */

// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================

const CONFIG = {
  // Sheet Configuration
  PARTICIPANTS_SHEET_NAME: 'Participants',  // Name of the tab with calculated scores

  // Email Configuration
  FROM_NAME: 'Flynn Disney',
  FROM_EMAIL: 'contact@flynndisney.com',  // Must match your Google account

  // Automation Settings
  CHECK_INTERVAL_HOURS: 1,  // How often to check for new submissions
  EMAIL_SEND_HOUR: 9,        // Hour to send emails (24-hour format, 0-23)
  EMAIL_SEND_MINUTE: 0,      // Minute to send emails (0-59)

  // Column indices for Participants tab (0-based)
  // Adjust these if your sheet structure is different
  COLUMNS: {
    ID: 0,                      // Column A: Auto-number ID
    TIMESTAMP: 1,               // Column B: Timestamp
    EMAIL: 2,                   // Column C: Email address
    NAME: 3,                    // Column D: Name
    // Columns 4-6: Status, Total Score, Total %
    // Columns 7-16: 10 emotion scores (Joy, Gratitude, Serenity, etc.)
    FOCUS_1: 17,                // Column R: Lowest emotion name
    FOCUS_2: 18,                // Column S: 2nd lowest emotion name
    FOCUS_3: 19,                // Column T: 3rd lowest emotion name
    // Columns 20-26: Current Day, Current Emotion, Last Email, etc.
    EMAIL_SEQUENCE_STARTED: 27  // Column AB: TRUE/FALSE flag
  }
};

// ============================================
// SETUP FUNCTIONS - RUN ONCE
// ============================================

/**
 * MAIN SETUP FUNCTION - Run this once to initialize all triggers
 * This sets up both the form submission trigger and hourly backup check
 */
function setupAllTriggers() {
  try {
    // Remove any existing triggers first to avoid duplicates
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'onFormSubmit' ||
          trigger.getHandlerFunction() === 'checkForNewSubmissions') {
        ScriptApp.deleteTrigger(trigger);
      }
    });

    // Setup form submission trigger (immediate response)
    const sheet = SpreadsheetApp.getActiveSpreadsheet();
    const formUrl = sheet.getFormUrl();

    if (formUrl) {
      ScriptApp.newTrigger('onFormSubmit')
        .forSpreadsheet(sheet)
        .onFormSubmit()
        .create();
      Logger.log('✓ Form submission trigger created');
    } else {
      Logger.log('⚠ No form attached to this sheet. Form submission trigger not created.');
    }

    // Setup hourly backup check
    ScriptApp.newTrigger('checkForNewSubmissions')
      .timeBased()
      .everyHours(CONFIG.CHECK_INTERVAL_HOURS)
      .create();
    Logger.log('✓ Hourly backup trigger created (checks every ' + CONFIG.CHECK_INTERVAL_HOURS + ' hour)');

    Logger.log('\n✓ Setup complete! Email automation is now active.');
    Logger.log('Test with a form submission or run checkForNewSubmissions manually.');

  } catch (error) {
    Logger.log('✗ Setup failed: ' + error.message);
    throw error;
  }
}

/**
 * Remove all automation triggers (use to disable system)
 */
function removeAllTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  let count = 0;
  triggers.forEach(trigger => {
    ScriptApp.deleteTrigger(trigger);
    count++;
  });
  Logger.log('Removed ' + count + ' triggers. Email automation is now disabled.');
}

// ============================================
// FORM SUBMISSION HANDLER
// ============================================

/**
 * Triggered immediately when form is submitted
 * Processes the new submission and starts email sequence
 */
function onFormSubmit(e) {
  try {
    Logger.log('Form submitted - processing...');

    // Get the Participants sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.PARTICIPANTS_SHEET_NAME);

    if (!sheet) {
      Logger.log('✗ Error: Participants sheet not found. Check CONFIG.PARTICIPANTS_SHEET_NAME');
      return;
    }

    // Process all unprocessed rows (in case multiple submissions happened)
    processNewSubmissions(sheet);

  } catch (error) {
    Logger.log('✗ Error in onFormSubmit: ' + error.message);
    logError('onFormSubmit', error);
  }
}

// ============================================
// HOURLY BACKUP CHECK
// ============================================

/**
 * Runs every hour as a backup to catch any missed form submissions
 */
function checkForNewSubmissions() {
  try {
    Logger.log('Running hourly backup check...');

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.PARTICIPANTS_SHEET_NAME);

    if (!sheet) {
      Logger.log('✗ Error: Participants sheet not found. Check CONFIG.PARTICIPANTS_SHEET_NAME');
      return;
    }

    processNewSubmissions(sheet);

  } catch (error) {
    Logger.log('✗ Error in checkForNewSubmissions: ' + error.message);
    logError('checkForNewSubmissions', error);
  }
}

// ============================================
// CORE PROCESSING LOGIC
// ============================================

/**
 * Process all unprocessed submissions in the Participants sheet
 */
function processNewSubmissions(sheet) {
  const data = sheet.getDataRange().getValues();
  let processedCount = 0;

  // Skip header row (row 0)
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const emailSequenceStarted = row[CONFIG.COLUMNS.EMAIL_SEQUENCE_STARTED];

    // Check if this row needs processing
    if (emailSequenceStarted !== true && emailSequenceStarted !== 'TRUE') {
      const email = row[CONFIG.COLUMNS.EMAIL];
      const name = row[CONFIG.COLUMNS.NAME];
      const lowestEmotions = [
        row[CONFIG.COLUMNS.FOCUS_1],
        row[CONFIG.COLUMNS.FOCUS_2],
        row[CONFIG.COLUMNS.FOCUS_3]
      ];

      // Validate data
      if (!email || !lowestEmotions[0] || !lowestEmotions[1] || !lowestEmotions[2]) {
        Logger.log('⚠ Row ' + (i + 1) + ': Incomplete data, skipping');
        continue;
      }

      try {
        // Start email sequence
        startEmailSequence(email, name, lowestEmotions);

        // Mark as processed
        sheet.getRange(i + 1, CONFIG.COLUMNS.EMAIL_SEQUENCE_STARTED + 1).setValue('TRUE');

        processedCount++;
        Logger.log('✓ Row ' + (i + 1) + ': Started email sequence for ' + email);

      } catch (error) {
        Logger.log('✗ Row ' + (i + 1) + ': Failed to start sequence - ' + error.message);
        logError('processNewSubmissions', error, { row: i + 1, email: email });
      }
    }
  }

  if (processedCount === 0) {
    Logger.log('No new submissions to process');
  } else {
    Logger.log('✓ Processed ' + processedCount + ' new submission(s)');
  }
}

/**
 * Start the complete email sequence for a user
 * Sends welcome email immediately and schedules all future emails
 */
function startEmailSequence(email, name, lowestEmotions) {
  Logger.log('Starting sequence for ' + email + ' with emotions: ' + lowestEmotions.join(', '));

  // Send welcome email immediately
  sendWelcomeEmail(email, name);
  Logger.log('  ✓ Welcome email sent');

  // Schedule emotion emails for each of the 3 lowest emotions
  const emotionSchedule = [
    { emotion: lowestEmotions[0], startDay: 0 },   // Primary deficit: Days 0, 1, 3, 5
    { emotion: lowestEmotions[1], startDay: 7 },   // Secondary deficit: Days 7, 8, 10, 12
    { emotion: lowestEmotions[2], startDay: 14 }   // Tertiary deficit: Days 14, 15, 17, 19
  ];

  let scheduledCount = 0;
  emotionSchedule.forEach(({ emotion, startDay }) => {
    scheduledCount += scheduleEmotionSequence(email, name, emotion, startDay);
  });
  Logger.log('  ✓ Scheduled ' + scheduledCount + ' emotion emails');

  // Schedule Day 23 reminder email
  scheduleReminderEmail(email, name, lowestEmotions, 23);
  Logger.log('  ✓ Scheduled Day 23 reminder');

  // Schedule Day 28 reassessment email
  scheduleReassessmentEmail(email, name, lowestEmotions, 28);
  Logger.log('  ✓ Scheduled Day 28 reassessment');

  Logger.log('✓ Complete: 14 emails scheduled for ' + email);
}

/**
 * Schedule all 4 emails for a specific emotion
 * Returns the number of emails scheduled
 */
function scheduleEmotionSequence(email, name, emotion, startDay) {
  const emailDays = [0, 1, 3, 5]; // Relative days for the 4 emotion emails
  let count = 0;

  emailDays.forEach((relativeDay, index) => {
    const absoluteDay = startDay + relativeDay;
    const emailNumber = index + 1;

    try {
      scheduleEmotionEmail(email, name, emotion, emailNumber, absoluteDay);
      count++;
    } catch (error) {
      Logger.log('    ✗ Failed to schedule ' + emotion + ' email ' + emailNumber + ': ' + error.message);
    }
  });

  return count;
}

/**
 * Schedule a single emotion email
 */
function scheduleEmotionEmail(email, name, emotion, emailNumber, daysFromNow) {
  const sendDate = calculateSendDate(daysFromNow);
  const functionName = 'sendEmail_' + emotion + '_' + emailNumber;

  // Create trigger
  ScriptApp.newTrigger(functionName)
    .timeBased()
    .at(sendDate)
    .create();

  // Store email data for later retrieval
  const key = functionName + '_' + sendDate.getTime();
  const data = JSON.stringify({
    email: email,
    name: name,
    emotion: emotion,
    emailNumber: emailNumber
  });

  PropertiesService.getScriptProperties().setProperty(key, data);
}

/**
 * Schedule Day 23 reminder email
 */
function scheduleReminderEmail(email, name, lowestEmotions, daysFromNow) {
  const sendDate = calculateSendDate(daysFromNow);

  ScriptApp.newTrigger('sendReminderEmail')
    .timeBased()
    .at(sendDate)
    .create();

  const key = 'sendReminderEmail_' + sendDate.getTime();
  const data = JSON.stringify({
    email: email,
    name: name,
    lowestEmotions: lowestEmotions
  });

  PropertiesService.getScriptProperties().setProperty(key, data);
}

/**
 * Schedule Day 28 reassessment email
 */
function scheduleReassessmentEmail(email, name, lowestEmotions, daysFromNow) {
  const sendDate = calculateSendDate(daysFromNow);

  ScriptApp.newTrigger('sendReassessmentEmail')
    .timeBased()
    .at(sendDate)
    .create();

  const key = 'sendReassessmentEmail_' + sendDate.getTime();
  const data = JSON.stringify({
    email: email,
    name: name,
    lowestEmotions: lowestEmotions
  });

  PropertiesService.getScriptProperties().setProperty(key, data);
}

/**
 * Calculate the send date for an email
 */
function calculateSendDate(daysFromNow) {
  const sendDate = new Date();
  sendDate.setDate(sendDate.getDate() + daysFromNow);
  sendDate.setHours(CONFIG.EMAIL_SEND_HOUR, CONFIG.EMAIL_SEND_MINUTE, 0, 0);
  return sendDate;
}

// ============================================
// EMAIL SENDING FUNCTIONS
// ============================================

/**
 * Send welcome email (called immediately, not scheduled)
 */
function sendWelcomeEmail(email, name) {
  const subject = 'Welcome to Your Positive Emotion Growth Course';
  const body = EMAIL_CONTENT.welcome.body;

  try {
    GmailApp.sendEmail(email, subject, body, {
      name: CONFIG.FROM_NAME
    });
  } catch (error) {
    Logger.log('✗ Failed to send welcome email to ' + email + ': ' + error.message);
    throw error;
  }
}

/**
 * Generic function to send emotion emails
 * Called by all 40 specific emotion email functions
 */
function sendEmotionEmailGeneric(functionName) {
  try {
    // Extract emotion and email number from function name
    // Example: sendEmail_Pride_1 → emotion="Pride", emailNumber=1
    const parts = functionName.split('_');
    const emotion = parts[2];
    const emailNumber = parseInt(parts[3]);

    // Find the stored data for this trigger
    const props = PropertiesService.getScriptProperties();
    const now = new Date().getTime();
    const allProps = props.getProperties();

    let matchKey = null;
    const searchPrefix = functionName + '_';

    // Find property key that matches this function and was scheduled for around now
    // (within 2 hours to account for execution delays)
    for (let key in allProps) {
      if (key.startsWith(searchPrefix)) {
        const timestamp = parseInt(key.substring(searchPrefix.length));
        if (Math.abs(now - timestamp) < 7200000) { // Within 2 hours
          matchKey = key;
          break;
        }
      }
    }

    if (!matchKey) {
      Logger.log('✗ No matching data found for ' + functionName);
      return;
    }

    // Retrieve and parse the stored data
    const data = JSON.parse(allProps[matchKey]);

    // Get email content
    const subject = EMAIL_CONTENT.emotions[emotion][emailNumber].subject;
    const body = EMAIL_CONTENT.emotions[emotion][emailNumber].body;

    // Send email
    GmailApp.sendEmail(data.email, subject, body, {
      name: CONFIG.FROM_NAME
    });

    // Clean up
    props.deleteProperty(matchKey);

    Logger.log('✓ Sent ' + emotion + ' email ' + emailNumber + ' to ' + data.email);

  } catch (error) {
    Logger.log('✗ Error in ' + functionName + ': ' + error.message);
    logError(functionName, error);
  }
}

/**
 * Send Day 23 reminder email
 */
function sendReminderEmail() {
  try {
    const props = PropertiesService.getScriptProperties();
    const now = new Date().getTime();
    const allProps = props.getProperties();

    let matchKey = null;
    for (let key in allProps) {
      if (key.startsWith('sendReminderEmail_')) {
        const timestamp = parseInt(key.substring('sendReminderEmail_'.length));
        if (Math.abs(now - timestamp) < 7200000) {
          matchKey = key;
          break;
        }
      }
    }

    if (!matchKey) {
      Logger.log('✗ No reminder data found');
      return;
    }

    const data = JSON.parse(allProps[matchKey]);
    const subject = 'Prepare for your reassessment';
    const body = EMAIL_CONTENT.reminder.body;

    GmailApp.sendEmail(data.email, subject, body, {
      name: CONFIG.FROM_NAME
    });

    props.deleteProperty(matchKey);
    Logger.log('✓ Sent reminder email to ' + data.email);

  } catch (error) {
    Logger.log('✗ Error in sendReminderEmail: ' + error.message);
    logError('sendReminderEmail', error);
  }
}

/**
 * Send Day 28 reassessment email
 */
function sendReassessmentEmail() {
  try {
    const props = PropertiesService.getScriptProperties();
    const now = new Date().getTime();
    const allProps = props.getProperties();

    let matchKey = null;
    for (let key in allProps) {
      if (key.startsWith('sendReassessmentEmail_')) {
        const timestamp = parseInt(key.substring('sendReassessmentEmail_'.length));
        if (Math.abs(now - timestamp) < 7200000) {
          matchKey = key;
          break;
        }
      }
    }

    if (!matchKey) {
      Logger.log('✗ No reassessment data found');
      return;
    }

    const data = JSON.parse(allProps[matchKey]);
    const emotion1 = data.lowestEmotions[0];
    const emotion2 = data.lowestEmotions[1];
    const emotion3 = data.lowestEmotions[2];

    const subject = 'Time to measure your positive emotion growth';
    const body = EMAIL_CONTENT.reassessment.body
      .replace('{{EMOTION_1}}', emotion1)
      .replace('{{EMOTION_2}}', emotion2)
      .replace('{{EMOTION_3}}', emotion3);

    GmailApp.sendEmail(data.email, subject, body, {
      name: CONFIG.FROM_NAME
    });

    props.deleteProperty(matchKey);
    Logger.log('✓ Sent reassessment email to ' + data.email);

  } catch (error) {
    Logger.log('✗ Error in sendReassessmentEmail: ' + error.message);
    logError('sendReassessmentEmail', error);
  }
}

// ============================================
// 40 EXPLICIT EMAIL SENDER FUNCTIONS
// One function for each emotion/number combination
// All call the generic handler
// ============================================

// Pride emails (4)
function sendEmail_Pride_1() { sendEmotionEmailGeneric('sendEmail_Pride_1'); }
function sendEmail_Pride_2() { sendEmotionEmailGeneric('sendEmail_Pride_2'); }
function sendEmail_Pride_3() { sendEmotionEmailGeneric('sendEmail_Pride_3'); }
function sendEmail_Pride_4() { sendEmotionEmailGeneric('sendEmail_Pride_4'); }

// Gratitude emails (4)
function sendEmail_Gratitude_1() { sendEmotionEmailGeneric('sendEmail_Gratitude_1'); }
function sendEmail_Gratitude_2() { sendEmotionEmailGeneric('sendEmail_Gratitude_2'); }
function sendEmail_Gratitude_3() { sendEmotionEmailGeneric('sendEmail_Gratitude_3'); }
function sendEmail_Gratitude_4() { sendEmotionEmailGeneric('sendEmail_Gratitude_4'); }

// Serenity emails (4)
function sendEmail_Serenity_1() { sendEmotionEmailGeneric('sendEmail_Serenity_1'); }
function sendEmail_Serenity_2() { sendEmotionEmailGeneric('sendEmail_Serenity_2'); }
function sendEmail_Serenity_3() { sendEmotionEmailGeneric('sendEmail_Serenity_3'); }
function sendEmail_Serenity_4() { sendEmotionEmailGeneric('sendEmail_Serenity_4'); }

// Interest emails (4)
function sendEmail_Interest_1() { sendEmotionEmailGeneric('sendEmail_Interest_1'); }
function sendEmail_Interest_2() { sendEmotionEmailGeneric('sendEmail_Interest_2'); }
function sendEmail_Interest_3() { sendEmotionEmailGeneric('sendEmail_Interest_3'); }
function sendEmail_Interest_4() { sendEmotionEmailGeneric('sendEmail_Interest_4'); }

// Hope emails (4)
function sendEmail_Hope_1() { sendEmotionEmailGeneric('sendEmail_Hope_1'); }
function sendEmail_Hope_2() { sendEmotionEmailGeneric('sendEmail_Hope_2'); }
function sendEmail_Hope_3() { sendEmotionEmailGeneric('sendEmail_Hope_3'); }
function sendEmail_Hope_4() { sendEmotionEmailGeneric('sendEmail_Hope_4'); }

// Amusement emails (4)
function sendEmail_Amusement_1() { sendEmotionEmailGeneric('sendEmail_Amusement_1'); }
function sendEmail_Amusement_2() { sendEmotionEmailGeneric('sendEmail_Amusement_2'); }
function sendEmail_Amusement_3() { sendEmotionEmailGeneric('sendEmail_Amusement_3'); }
function sendEmail_Amusement_4() { sendEmotionEmailGeneric('sendEmail_Amusement_4'); }

// Love emails (4)
function sendEmail_Love_1() { sendEmotionEmailGeneric('sendEmail_Love_1'); }
function sendEmail_Love_2() { sendEmotionEmailGeneric('sendEmail_Love_2'); }
function sendEmail_Love_3() { sendEmotionEmailGeneric('sendEmail_Love_3'); }
function sendEmail_Love_4() { sendEmotionEmailGeneric('sendEmail_Love_4'); }

// Inspiration emails (4)
function sendEmail_Inspiration_1() { sendEmotionEmailGeneric('sendEmail_Inspiration_1'); }
function sendEmail_Inspiration_2() { sendEmotionEmailGeneric('sendEmail_Inspiration_2'); }
function sendEmail_Inspiration_3() { sendEmotionEmailGeneric('sendEmail_Inspiration_3'); }
function sendEmail_Inspiration_4() { sendEmotionEmailGeneric('sendEmail_Inspiration_4'); }

// Awe emails (4)
function sendEmail_Awe_1() { sendEmotionEmailGeneric('sendEmail_Awe_1'); }
function sendEmail_Awe_2() { sendEmotionEmailGeneric('sendEmail_Awe_2'); }
function sendEmail_Awe_3() { sendEmotionEmailGeneric('sendEmail_Awe_3'); }
function sendEmail_Awe_4() { sendEmotionEmailGeneric('sendEmail_Awe_4'); }

// Joy emails (4)
function sendEmail_Joy_1() { sendEmotionEmailGeneric('sendEmail_Joy_1'); }
function sendEmail_Joy_2() { sendEmotionEmailGeneric('sendEmail_Joy_2'); }
function sendEmail_Joy_3() { sendEmotionEmailGeneric('sendEmail_Joy_3'); }
function sendEmail_Joy_4() { sendEmotionEmailGeneric('sendEmail_Joy_4'); }

// ============================================
// EMAIL CONTENT
// ADD YOUR EMAIL CONTENT HERE
// ============================================

/**
 * INSTRUCTIONS FOR ADDING EMAIL CONTENT:
 *
 * Replace the placeholder text below with your complete email content.
 * Structure must match: EMAIL_CONTENT.emotions[EmotionName][emailNumber]
 *
 * For each emotion, you need 4 emails with subjects and bodies.
 * Maintain the exact structure shown below.
 *
 * The welcome, reminder, and reassessment bodies are already populated
 * from your existing content. You need to add the 40 emotion-specific emails.
 */

const EMAIL_CONTENT = {
  // Welcome email (Day 0)
  welcome: {
    subject: 'Welcome to Your Positive Emotion Growth Course',
    body: `Hey! Thank you for completing the Positive Emotion Growth Assessment.

By filling out that form, you enrolled for three weeks of personalised interventions, designed to help you develop the positive emotions you're less familiar with.

Feeling good isn't just about feeling good. Distinct positive emotions give you specific psychological resources. For example pride gives you motivation, joy gives you openness and love gives you connection. Each time you experience a positive emotion, you're planting a seed that grows — if it's nurtured regularly and attentively.

This mini course provides you with "interventions" – activities that enhance particular positive emotions. For example, if you scored low on amusement, you'll receive exercises to develop your sense of humour. To create the best interventions possible, I've adapted the works of scientific researchers and meditation teachers into simple tasks, explained step by step.

Keeping a notebook will help you make the most of the course – as reflecting on your experiences helps you to remember them. Pen and paper is best because it's the easiest way to look back over your reflections – but using a note taking app or even a voice recorder is fine, too.

Finishing the course, you'll receive the assessment again – and if you'd like to, you can measure your positive emotional development. This helps you to track your progress, and it gives me some scientific data to work with. If you'd prefer not to be included in the data set, just tell me – but remember that your name won't be included in any published work.

Tomorrow, you'll receive your first positive emotion to work with!`
  },

  // Day 23 reminder
  reminder: {
    subject: 'Prepare for your reassessment',
    body: `Hey!

You're five days away from reassessing your positive emotion growth.

Over the past three weeks, you've worked with three emotions through structured interventions. The reassessment shows whether your practice has created measurable change.

What to expect on Day 28:
- Same 40 questions from the initial assessment
- Your scores will show before and after comparison
- You'll see which emotions shifted and by how much

The data matters. Small shifts are still shifts. Large changes indicate significant neural adaptation. Either way, you'll have concrete information about your emotional development.

Keep practicing the interventions from your emails. The final five days of consistent practice can consolidate the neural patterns you've been building.

You'll receive the reassessment link in five days.

Flynn`
  },

  // Day 28 reassessment
  reassessment: {
    subject: 'Time to measure your positive emotion growth',
    body: `Hey!

Three weeks ago, you started working with {{EMOTION_1}}, {{EMOTION_2}}, and {{EMOTION_3}}.

Time to measure your growth.

Take the reassessment: https://flynndisney.com/joy-assessment

Same 40 questions. Answer honestly based on the past month. You'll see your before and after scores.

Remember: positive emotions develop like muscles - consistent practice over time creates lasting change. Whether you see big shifts or small ones, the data helps you understand where you are.

If you want to go deeper with this work, the Joy Study Teacher Training offers six months of structured practice with direct feedback and peer support.

Learn more: https://flynndisney.com/joy

Thanks for your engagement with this practice.

Flynn`
  },

  // ============================================
  // 40 EMOTION-SPECIFIC EMAILS
  // ADD YOUR COMPLETE EMAIL CONTENT BELOW
  // ============================================

  emotions: {
    // Pride emails (4)
    Pride: {
      1: {
        subject: 'Pride 1: Understanding Pride',
        body: `You're receiving this email to develop your emotion of Pride.

Pride is the positive emotion related to motivation, specifically the motivation to seek greater challenges.

When you feel pride, you literally hold your head up high. That embodied confidence helps you manage anxiety, commit to your goals and stay true to yourself in any situation.

Authentic pride comes from appreciating your efforts, not your abilities. Research shows that recognising effort is what builds self-esteem and the willingness to keep trying, whereas attributing success to talent often leads to anti-social arrogance – and the fear of failure.

You'll feel the most pride when your efforts align with what your community values. In this way, pride strengthens both personal motivation and social connection.

In the next email, you'll learn a simple intervention for developing authentic pride.

Are you a coach, clinician or teacher interested in the power of positive emotions? Can you imagine your clients or students with more motivation, confidence, and authentic self-esteem? Join the Joy Study Teacher Training for six months of science-based, peer-supported education based on direct experience and personal feedback. Find more information at www.flynndisney.com/joy`
      },
      2: {
        subject: 'Pride 2: Finding pride in past achievements',
        body: `[ADD PRIDE EMAIL 2 CONTENT HERE - Copy from your complete email document]`
      },
      3: {
        subject: 'Pride 3: Building pride into your routine',
        body: `[ADD PRIDE EMAIL 3 CONTENT HERE - Copy from your complete email document]`
      },
      4: {
        subject: 'Pride 4: Integrating Pride',
        body: `[ADD PRIDE EMAIL 4 CONTENT HERE - Copy from your complete email document]`
      }
    },

    // Gratitude emails (4)
    Gratitude: {
      1: {
        subject: 'Gratitude 1: Understanding Gratitude',
        body: `[ADD GRATITUDE EMAIL 1 CONTENT HERE]`
      },
      2: {
        subject: 'Gratitude 2: Gratitude starts with noticing',
        body: `[ADD GRATITUDE EMAIL 2 CONTENT HERE]`
      },
      3: {
        subject: 'Gratitude 3: The receiving side of gratitude',
        body: `[ADD GRATITUDE EMAIL 3 CONTENT HERE]`
      },
      4: {
        subject: 'Gratitude 4: Integrating Gratitude',
        body: `[ADD GRATITUDE EMAIL 4 CONTENT HERE]`
      }
    },

    // Serenity emails (4)
    Serenity: {
      1: {
        subject: 'Serenity 1: Understanding Serenity',
        body: `[ADD SERENITY EMAIL 1 CONTENT HERE]`
      },
      2: {
        subject: 'Serenity 2: Serenity starts with the eyes',
        body: `[ADD SERENITY EMAIL 2 CONTENT HERE]`
      },
      3: {
        subject: 'Serenity 3: Deeply letting go',
        body: `[ADD SERENITY EMAIL 3 CONTENT HERE]`
      },
      4: {
        subject: 'Serenity 4: Integrating Serenity',
        body: `[ADD SERENITY EMAIL 4 CONTENT HERE]`
      }
    },

    // Interest emails (4)
    Interest: {
      1: {
        subject: 'Interest 1: Understanding Interest',
        body: `[ADD INTEREST EMAIL 1 CONTENT HERE]`
      },
      2: {
        subject: 'Interest 2: Finding your interest',
        body: `[ADD INTEREST EMAIL 2 CONTENT HERE]`
      },
      3: {
        subject: 'Interest 3: Having interesting conversations',
        body: `[ADD INTEREST EMAIL 3 CONTENT HERE]`
      },
      4: {
        subject: 'Interest 4: Integrating Interest',
        body: `[ADD INTEREST EMAIL 4 CONTENT HERE]`
      }
    },

    // Hope emails (4)
    Hope: {
      1: {
        subject: 'Hope 1: Understanding Hope',
        body: `[ADD HOPE EMAIL 1 CONTENT HERE]`
      },
      2: {
        subject: 'Hope 2: Building hope from fear',
        body: `[ADD HOPE EMAIL 2 CONTENT HERE]`
      },
      3: {
        subject: 'Hope 3: How your inner voice builds hope',
        body: `[ADD HOPE EMAIL 3 CONTENT HERE]`
      },
      4: {
        subject: 'Hope 4: Integrating Hope',
        body: `[ADD HOPE EMAIL 4 CONTENT HERE]`
      }
    },

    // Amusement emails (4)
    Amusement: {
      1: {
        subject: 'Amusement 1: Understanding Amusement',
        body: `[ADD AMUSEMENT EMAIL 1 CONTENT HERE]`
      },
      2: {
        subject: 'Amusement 2: Playing with words',
        body: `[ADD AMUSEMENT EMAIL 2 CONTENT HERE]`
      },
      3: {
        subject: 'Amusement 3: How to develop your sense of humour',
        body: `[ADD AMUSEMENT EMAIL 3 CONTENT HERE]`
      },
      4: {
        subject: 'Amusement 4: Integrating Amusement',
        body: `[ADD AMUSEMENT EMAIL 4 CONTENT HERE]`
      }
    },

    // Love emails (4)
    Love: {
      1: {
        subject: 'Love 1: Understanding Love',
        body: `[ADD LOVE EMAIL 1 CONTENT HERE]`
      },
      2: {
        subject: 'Love 2: Where does love appear',
        body: `[ADD LOVE EMAIL 2 CONTENT HERE]`
      },
      3: {
        subject: 'Love 3: Creating the conditions of love',
        body: `[ADD LOVE EMAIL 3 CONTENT HERE]`
      },
      4: {
        subject: 'Love 4: Integrating Love',
        body: `[ADD LOVE EMAIL 4 CONTENT HERE]`
      }
    },

    // Inspiration emails (4)
    Inspiration: {
      1: {
        subject: 'Inspiration 1: Understanding Inspiration',
        body: `[ADD INSPIRATION EMAIL 1 CONTENT HERE]`
      },
      2: {
        subject: 'Inspiration 2: What inspires you',
        body: `[ADD INSPIRATION EMAIL 2 CONTENT HERE]`
      },
      3: {
        subject: 'Inspiration 3: Making space for inspiration',
        body: `[ADD INSPIRATION EMAIL 3 CONTENT HERE]`
      },
      4: {
        subject: 'Inspiration 4: Integrating Inspiration',
        body: `[ADD INSPIRATION EMAIL 4 CONTENT HERE]`
      }
    },

    // Awe emails (4)
    Awe: {
      1: {
        subject: 'Awe 1: Understanding Awe',
        body: `[ADD AWE EMAIL 1 CONTENT HERE]`
      },
      2: {
        subject: 'Awe 2: Rediscovering awe',
        body: `[ADD AWE EMAIL 2 CONTENT HERE]`
      },
      3: {
        subject: 'Awe 3: Everyday awe',
        body: `[ADD AWE EMAIL 3 CONTENT HERE]`
      },
      4: {
        subject: 'Awe 4: Integrating Awe',
        body: `[ADD AWE EMAIL 4 CONTENT HERE]`
      }
    },

    // Joy emails (4)
    Joy: {
      1: {
        subject: 'Joy 1: Understanding Joy',
        body: `[ADD JOY EMAIL 1 CONTENT HERE]`
      },
      2: {
        subject: 'Joy 2: Shaking off the blocks to joy',
        body: `[ADD JOY EMAIL 2 CONTENT HERE]`
      },
      3: {
        subject: 'Joy 3: Joy beyond thinking',
        body: `[ADD JOY EMAIL 3 CONTENT HERE]`
      },
      4: {
        subject: 'Joy 4: Integrating Joy',
        body: `[ADD JOY EMAIL 4 CONTENT HERE]`
      }
    }
  }
};

// ============================================
// ERROR LOGGING
// ============================================

/**
 * Log errors to a separate sheet for monitoring
 */
function logError(functionName, error, additionalData) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let errorSheet = ss.getSheetByName('Error Log');

    // Create error log sheet if it doesn't exist
    if (!errorSheet) {
      errorSheet = ss.insertSheet('Error Log');
      errorSheet.appendRow(['Timestamp', 'Function', 'Error Message', 'Additional Data']);
    }

    const timestamp = new Date().toISOString();
    const additionalStr = additionalData ? JSON.stringify(additionalData) : '';

    errorSheet.appendRow([timestamp, functionName, error.message, additionalStr]);

  } catch (logError) {
    // If error logging fails, at least log to Apps Script logger
    Logger.log('Failed to log error: ' + logError.message);
  }
}

// ============================================
// TESTING FUNCTIONS
// ============================================

/**
 * Test welcome email - run this to test email sending
 */
function testWelcomeEmail() {
  const testEmail = 'your-email@example.com'; // CHANGE THIS
  const testName = 'Test User';

  try {
    sendWelcomeEmail(testEmail, testName);
    Logger.log('✓ Test welcome email sent to ' + testEmail);
    Logger.log('Check your inbox!');
  } catch (error) {
    Logger.log('✗ Test failed: ' + error.message);
  }
}

/**
 * Test sheet reading - verify configuration
 */
function testReadSheet() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.PARTICIPANTS_SHEET_NAME);

    if (!sheet) {
      Logger.log('✗ Sheet "' + CONFIG.PARTICIPANTS_SHEET_NAME + '" not found!');
      Logger.log('Available sheets:');
      SpreadsheetApp.getActiveSpreadsheet().getSheets().forEach(s => {
        Logger.log('  - ' + s.getName());
      });
      return;
    }

    const data = sheet.getDataRange().getValues();
    Logger.log('✓ Sheet found: ' + CONFIG.PARTICIPANTS_SHEET_NAME);
    Logger.log('Total rows: ' + data.length);

    if (data.length > 1) {
      const testRow = data[1];
      Logger.log('\nFirst data row:');
      Logger.log('  Email: ' + testRow[CONFIG.COLUMNS.EMAIL]);
      Logger.log('  Name: ' + testRow[CONFIG.COLUMNS.NAME]);
      Logger.log('  Focus 1: ' + testRow[CONFIG.COLUMNS.FOCUS_1]);
      Logger.log('  Focus 2: ' + testRow[CONFIG.COLUMNS.FOCUS_2]);
      Logger.log('  Focus 3: ' + testRow[CONFIG.COLUMNS.FOCUS_3]);
      Logger.log('  Sequence Started: ' + testRow[CONFIG.COLUMNS.EMAIL_SEQUENCE_STARTED]);
    } else {
      Logger.log('\n⚠ No data rows found (only header row)');
    }

  } catch (error) {
    Logger.log('✗ Test failed: ' + error.message);
  }
}

/**
 * Test a specific emotion email (for development)
 */
function testEmotionEmail() {
  const testEmail = 'your-email@example.com'; // CHANGE THIS
  const testEmotion = 'Pride';
  const testEmailNumber = 1;

  try {
    const subject = EMAIL_CONTENT.emotions[testEmotion][testEmailNumber].subject;
    const body = EMAIL_CONTENT.emotions[testEmotion][testEmailNumber].body;

    GmailApp.sendEmail(testEmail, subject, body, {
      name: CONFIG.FROM_NAME
    });

    Logger.log('✓ Test email sent: ' + testEmotion + ' #' + testEmailNumber);
    Logger.log('To: ' + testEmail);
    Logger.log('Subject: ' + subject);

  } catch (error) {
    Logger.log('✗ Test failed: ' + error.message);
  }
}

/**
 * View all scheduled triggers
 */
function listAllTriggers() {
  const triggers = ScriptApp.getProjectTriggers();

  Logger.log('Total triggers: ' + triggers.length);
  Logger.log('\nScheduled triggers:');

  triggers.forEach((trigger, index) => {
    const handlerFunction = trigger.getHandlerFunction();
    const eventType = trigger.getEventType();

    Logger.log('\n' + (index + 1) + '. ' + handlerFunction);
    Logger.log('   Type: ' + eventType);

    if (eventType === ScriptApp.EventType.CLOCK) {
      try {
        const triggerSource = trigger.getTriggerSource();
        Logger.log('   Source: ' + triggerSource);
      } catch (e) {
        Logger.log('   (Time-based trigger)');
      }
    }
  });
}

/**
 * Clear all stored properties (use carefully!)
 */
function clearAllProperties() {
  const props = PropertiesService.getScriptProperties();
  props.deleteAllProperties();
  Logger.log('✓ All stored properties cleared');
}

/**
 * Manual processing of specific row (for debugging)
 */
function manualProcessRow() {
  const rowNumber = 2; // CHANGE THIS (1-based, so 2 = first data row)

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.PARTICIPANTS_SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    const row = data[rowNumber - 1]; // Convert to 0-based

    const email = row[CONFIG.COLUMNS.EMAIL];
    const name = row[CONFIG.COLUMNS.NAME];
    const lowestEmotions = [
      row[CONFIG.COLUMNS.FOCUS_1],
      row[CONFIG.COLUMNS.FOCUS_2],
      row[CONFIG.COLUMNS.FOCUS_3]
    ];

    Logger.log('Processing row ' + rowNumber);
    Logger.log('Email: ' + email);
    Logger.log('Emotions: ' + lowestEmotions.join(', '));

    startEmailSequence(email, name, lowestEmotions);

    // Mark as processed
    sheet.getRange(rowNumber, CONFIG.COLUMNS.EMAIL_SEQUENCE_STARTED + 1).setValue('TRUE');

    Logger.log('✓ Sequence started successfully');

  } catch (error) {
    Logger.log('✗ Failed: ' + error.message);
  }
}

// ============================================
// END OF SCRIPT
// ============================================

/**
 * NEXT STEPS AFTER PASTING THIS SCRIPT:
 *
 * 1. Update CONFIG section with your details
 * 2. Add all 40 email bodies in EMAIL_CONTENT section
 * 3. Save the script
 * 4. Run testReadSheet() to verify sheet access
 * 5. Run testWelcomeEmail() to verify email sending
 * 6. Run setupAllTriggers() to activate automation
 * 7. Submit a test form to verify end-to-end flow
 *
 * For detailed instructions, see the SETUP_GUIDE.md file
 */
