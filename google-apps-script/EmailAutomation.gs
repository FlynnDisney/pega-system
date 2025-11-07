/**
 * PEGA Email Automation - Google Apps Script
 *
 * This script automates sending personalized email sequences based on
 * users' lowest-scoring emotions from the PEGA assessment.
 *
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet
 * 2. Go to Extensions → Apps Script
 * 3. Delete any existing code
 * 4. Paste this entire script
 * 5. Save (Ctrl/Cmd + S)
 * 6. Run 'setupTrigger' function once to set up automatic checks
 * 7. Authorize the script when prompted
 *
 * The script will automatically:
 * - Check for new assessment submissions every hour
 * - Send the welcome email immediately
 * - Schedule 13 personalized emails over 4 weeks (12 emotion + 1 reassessment)
 * - Send reassessment email on Day 28
 * - Mark rows as processed to avoid duplicates
 */

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  SHEET_NAME: 'Sheet1', // Change if your sheet has a different name
  FROM_NAME: 'Flynn Disney',
  FROM_EMAIL: 'your-email@example.com', // Change to your email
  CHECK_INTERVAL_HOURS: 1, // How often to check for new submissions

  // Column indices (0-based) - match your Google Sheet schema
  COLUMNS: {
    TIMESTAMP: 0,
    EMAIL: 1,
    // Q1-Q40 are columns 2-41
    LOWEST_EMOTION_1: 54, // Column BC
    LOWEST_EMOTION_2: 55, // Column BD
    LOWEST_EMOTION_3: 56, // Column BE
    EMAIL_SEQUENCE_STARTED: 57 // Column BF
  }
};

// ============================================
// MAIN FUNCTIONS
// ============================================

/**
 * Set up hourly trigger to check for new submissions
 * Run this function once manually to set up automation
 */
function setupTrigger() {
  // Delete existing triggers to avoid duplicates
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));

  // Create new hourly trigger
  ScriptApp.newTrigger('checkForNewSubmissions')
    .timeBased()
    .everyHours(CONFIG.CHECK_INTERVAL_HOURS)
    .create();

  Logger.log('Trigger set up successfully. Will check for new submissions every ' + CONFIG.CHECK_INTERVAL_HOURS + ' hour(s)');
}

/**
 * Check for new submissions and start email sequences
 * This function runs automatically via trigger
 */
function checkForNewSubmissions() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  const data = sheet.getDataRange().getValues();

  // Skip header row
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const emailSequenceStarted = row[CONFIG.COLUMNS.EMAIL_SEQUENCE_STARTED];

    // Check if this row needs processing
    if (emailSequenceStarted !== 'TRUE') {
      const email = row[CONFIG.COLUMNS.EMAIL];
      const lowestEmotions = [
        row[CONFIG.COLUMNS.LOWEST_EMOTION_1],
        row[CONFIG.COLUMNS.LOWEST_EMOTION_2],
        row[CONFIG.COLUMNS.LOWEST_EMOTION_3]
      ];

      // Start email sequence
      startEmailSequence(email, lowestEmotions);

      // Mark as processed
      sheet.getRange(i + 1, CONFIG.COLUMNS.EMAIL_SEQUENCE_STARTED + 1).setValue('TRUE');

      Logger.log('Started email sequence for: ' + email);
    }
  }
}

/**
 * Start the email sequence for a user
 * Sends welcome email immediately and schedules all 13 future emails
 */
function startEmailSequence(email, lowestEmotions) {
  // Send welcome email immediately
  sendWelcomeEmail(email);

  // Schedule emails for each emotion
  const emotionSchedule = [
    { emotion: lowestEmotions[0], startDay: 0 },   // Primary deficit
    { emotion: lowestEmotions[1], startDay: 7 },   // Secondary deficit
    { emotion: lowestEmotions[2], startDay: 14 }   // Tertiary deficit
  ];

  emotionSchedule.forEach(({ emotion, startDay }) => {
    // Schedule 4 emails for this emotion
    scheduleEmotionSequence(email, emotion, startDay);
  });

  // Schedule reassessment email on Day 28
  scheduleReassessmentEmail(email, lowestEmotions, 28);
}

/**
 * Schedule all 4 emails for a specific emotion
 */
function scheduleEmotionSequence(email, emotion, startDay) {
  const emailDays = [0, 1, 3, 5]; // Relative days for the 4 emails

  emailDays.forEach((relativeDay, index) => {
    const absoluteDay = startDay + relativeDay;
    const emailNumber = index + 1;

    // Schedule this email
    scheduleEmail(email, emotion, emailNumber, absoluteDay);
  });
}

/**
 * Schedule a single email to be sent at a specific time
 */
function scheduleEmail(email, emotion, emailNumber, daysFromNow) {
  const sendDate = new Date();
  sendDate.setDate(sendDate.getDate() + daysFromNow);
  sendDate.setHours(9, 0, 0, 0); // Send at 9 AM

  const triggerFunction = `sendEmail_${emotion}_${emailNumber}`;

  // Create time-based trigger
  ScriptApp.newTrigger(triggerFunction)
    .timeBased()
    .at(sendDate)
    .create();

  // Store email info in script properties for the trigger to access
  const props = PropertiesService.getScriptProperties();
  const key = `${triggerFunction}_${sendDate.getTime()}`;
  props.setProperty(key, JSON.stringify({
    email: email,
    emotion: emotion,
    emailNumber: emailNumber
  }));
}

/**
 * Send welcome email
 */
function sendWelcomeEmail(email) {
  const subject = 'Welcome to Your Positive Emotion Growth Course';
  const body = getWelcomeEmailBody();

  GmailApp.sendEmail(email, subject, body, {
    name: CONFIG.FROM_NAME
  });
}

/**
 * Schedule reassessment email
 */
function scheduleReassessmentEmail(email, lowestEmotions, daysFromNow) {
  const sendDate = new Date();
  sendDate.setDate(sendDate.getDate() + daysFromNow);
  sendDate.setHours(9, 0, 0, 0); // Send at 9 AM

  const triggerFunction = 'sendReassessmentEmail';

  // Create time-based trigger
  ScriptApp.newTrigger(triggerFunction)
    .timeBased()
    .at(sendDate)
    .create();

  // Store email info in script properties
  const props = PropertiesService.getScriptProperties();
  const key = `${triggerFunction}_${sendDate.getTime()}`;
  props.setProperty(key, JSON.stringify({
    email: email,
    lowestEmotions: lowestEmotions
  }));
}

/**
 * Send reassessment email (called by trigger)
 */
function sendReassessmentEmail() {
  const props = PropertiesService.getScriptProperties();
  const allProps = props.getProperties();

  // Find the matching property
  const now = new Date().getTime();
  const matchKey = Object.keys(allProps).find(key => {
    if (key.startsWith('sendReassessmentEmail_')) {
      const timestamp = parseInt(key.split('_')[1]);
      return Math.abs(now - timestamp) < 3600000; // Within 1 hour
    }
    return false;
  });

  if (!matchKey) {
    Logger.log('No reassessment data found');
    return;
  }

  const data = JSON.parse(allProps[matchKey]);
  const subject = 'Time to measure your positive emotion growth';
  const body = getReassessmentEmailBody(data.lowestEmotions);

  GmailApp.sendEmail(data.email, subject, body, {
    name: CONFIG.FROM_NAME
  });

  // Clean up
  props.deleteProperty(matchKey);
  Logger.log(`Sent reassessment email to ${data.email}`);
}

// ============================================
// EMAIL CONTENT - WELCOME
// ============================================

function getWelcomeEmailBody() {
  return `Hey! Thank you for completing the Positive Emotion Growth Assessment.

By filling out that form, you enrolled for three weeks of personalised interventions, designed to help you develop the positive emotions you're less familiar with.

Feeling good isn't just about feeling good. Distinct positive emotions give you specific psychological resources. For example pride gives you motivation, joy gives you openness and love gives you connection. Each time you experience a positive emotion, you're planting a seed that grows — if it's nurtured regularly and attentively.

This mini course provides you with "interventions" – activities that enhance particular positive emotions. For example, if you scored low on amusement, you'll receive exercises to develop your sense of humour. To create the best interventions possible, I've adapted the works of scientific researchers and meditation teachers into simple tasks, explained step by step.

Keeping a notebook will help you make the most of the course – as reflecting on your experiences helps you to remember them. Pen and paper is best because it's the easiest way to look back over your reflections – but using a note taking app or even a voice recorder is fine, too.

Finishing the course, you'll receive the assessment again – and if you'd like to, you can measure your positive emotional development. This helps you to track your progress, and it gives me some scientific data to work with. If you'd prefer not to be included in the data set, just tell me – but remember that your name won't be included in any published work.

Tomorrow, you'll receive your first positive emotion to work with!`;
}

/**
 * Get reassessment email body
 */
function getReassessmentEmailBody(lowestEmotions) {
  const emotion1 = lowestEmotions[0];
  const emotion2 = lowestEmotions[1];
  const emotion3 = lowestEmotions[2];

  return `Hey!

Three weeks ago, you started working with ${emotion1}, ${emotion2}, and ${emotion3}.

Time to measure your growth.

Take the reassessment: https://flynndisney.com/joy-assessment

Same 40 questions. Answer honestly based on the past month. You'll see your before and after scores.

Remember: positive emotions develop like muscles - consistent practice over time creates lasting change. Whether you see big shifts or small ones, the data helps you understand where you are.

If you want to go deeper with this work, the Joy Study Teacher Training offers six months of structured practice with direct feedback and peer support.

Learn more: https://flynndisney.com/joy

Thanks for your engagement with this practice.

Flynn`;
}

// ============================================
// EMAIL SENDER FUNCTIONS (Called by Triggers)
// ============================================

/**
 * Generic function to send emotion emails
 * Called by dynamically created triggers
 */
function sendEmotionEmail(emotion, emailNumber, triggeredAt) {
  const props = PropertiesService.getScriptProperties();
  const key = `sendEmail_${emotion}_${emailNumber}_${triggeredAt}`;
  const dataStr = props.getProperty(key);

  if (!dataStr) {
    Logger.log('No data found for trigger: ' + key);
    return;
  }

  const data = JSON.parse(dataStr);
  const subject = getEmailSubject(emotion, emailNumber);
  const body = getEmailBody(emotion, emailNumber);

  GmailApp.sendEmail(data.email, subject, body, {
    name: CONFIG.FROM_NAME
  });

  // Clean up
  props.deleteProperty(key);
  Logger.log(`Sent ${emotion} email ${emailNumber} to ${data.email}`);
}

/**
 * Get email subject for specific emotion and email number
 */
function getEmailSubject(emotion, emailNumber) {
  const subjects = EMAIL_SUBJECTS[emotion];
  return subjects ? subjects[emailNumber] : `${emotion} ${emailNumber}`;
}

/**
 * Get email body for specific emotion and email number
 */
function getEmailBody(emotion, emailNumber) {
  const bodies = EMAIL_BODIES[emotion];
  return bodies ? bodies[emailNumber] : 'Email content not found.';
}

// ============================================
// EMAIL CONTENT - SUBJECTS
// ============================================

const EMAIL_SUBJECTS = {
  'Pride': {
    1: 'Pride 1: Understanding Pride',
    2: 'Pride 2: Finding pride in past achievements',
    3: 'Pride 3: Building pride into your routine',
    4: 'Pride 4: Integrating Pride'
  },
  'Inspiration': {
    1: 'Inspiration 1: Understanding Inspiration',
    2: 'Inspiration 2: What inspires you',
    3: 'Inspiration 3: Making space for inspiration',
    4: 'Inspiration 4: Integrating Inspiration'
  },
  'Gratitude': {
    1: 'Gratitude 1: Understanding Gratitude',
    2: 'Gratitude 2: Gratitude starts with noticing',
    3: 'Gratitude 3: The receiving side of gratitude',
    4: 'Gratitude 4: Integrating Gratitude'
  },
  'Hope': {
    1: 'Hope 1: Understanding Hope',
    2: 'Hope 2: Building hope from fear',
    3: 'Hope 3: How your inner voice builds hope',
    4: 'Hope 4: Integrating Hope'
  },
  'Amusement': {
    1: 'Amusement 1: Understanding Amusement',
    2: 'Amusement 2: Playing with words',
    3: 'Amusement 3: How to develop your sense of humour',
    4: 'Amusement 4: Integrating Amusement'
  },
  'Love': {
    1: 'Love 1: Understanding Love',
    2: 'Love 2: Where does love appear',
    3: 'Love 3: Creating the conditions of love',
    4: 'Love 4: Integrating Love'
  },
  'Interest': {
    1: 'Interest 1: Understanding Interest',
    2: 'Interest 2: Finding your interest',
    3: 'Interest 3: Having interesting conversations',
    4: 'Interest 4: Integrating Interest'
  },
  'Awe': {
    1: 'Awe 1: Understanding Awe',
    2: 'Awe 2: Rediscovering awe',
    3: 'Awe 3: Everyday awe',
    4: 'Awe 4: Integrating Awe'
  },
  'Serenity': {
    1: 'Serenity 1: Understanding Serenity',
    2: 'Serenity 2: Serenity starts with the eyes',
    3: 'Serenity 3: Deeply letting go',
    4: 'Serenity 4: Integrating Serenity'
  },
  'Joy': {
    1: 'Joy 1: Understanding Joy',
    2: 'Joy 2: Shaking off the blocks to joy',
    3: 'Joy 3: Joy beyond thinking',
    4: 'Joy 4: Integrating Joy'
  }
};

// ============================================
// EMAIL CONTENT - BODIES
// Note: Due to character limits, you'll need to add
// all email bodies here. See the separate
// EMAIL_CONTENT.md file for all email text.
// ============================================

const EMAIL_BODIES = {
  'Pride': {
    1: `You're receiving this email to develop your emotion of Pride.

Pride is the positive emotion related to motivation, specifically the motivation to seek greater challenges.

When you feel pride, you literally hold your head up high. That embodied confidence helps you manage anxiety, commit to your goals and stay true to yourself in any situation.

Authentic pride comes from appreciating your efforts, not your abilities. Research shows that recognising effort is what builds self-esteem and the willingness to keep trying, whereas attributing success to talent often leads to anti-social arrogance – and the fear of failure.

You'll feel the most pride when your efforts align with what your community values. In this way, pride strengthens both personal motivation and social connection.

In the next email, you'll learn a simple intervention for developing authentic pride.

Are you a coach, clinician or teacher interested in the power of positive emotions? Can you imagine your clients or students with more motivation, confidence, and authentic self-esteem? Join the Joy Study Teacher Training for six months of science-based, peer-supported education based on direct experience and personal feedback. Find more information at www.flynndisney.com/joy`,
    // Add emails 2, 3, 4 for Pride here...
  },
  // Add all other emotions here...
};

// ============================================
// TESTING FUNCTIONS
// ============================================

/**
 * Test function - send welcome email to yourself
 */
function testWelcomeEmail() {
  const testEmail = 'your-test-email@example.com'; // Change this
  sendWelcomeEmail(testEmail);
  Logger.log('Test welcome email sent to: ' + testEmail);
}

/**
 * Test function - check sheet reading
 */
function testReadSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  const data = sheet.getDataRange().getValues();

  Logger.log('Total rows: ' + data.length);
  Logger.log('Headers: ' + data[0]);

  if (data.length > 1) {
    const testRow = data[1];
    Logger.log('First data row email: ' + testRow[CONFIG.COLUMNS.EMAIL]);
    Logger.log('Lowest emotions: ' + [
      testRow[CONFIG.COLUMNS.LOWEST_EMOTION_1],
      testRow[CONFIG.COLUMNS.LOWEST_EMOTION_2],
      testRow[CONFIG.COLUMNS.LOWEST_EMOTION_3]
    ]);
  }
}
