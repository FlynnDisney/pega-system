/**
 * Google Sheets Integration
 * Handles writing assessment data to Google Sheets
 */

import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { AssessmentSubmission } from './types';

/**
 * Initialize and authenticate Google Sheets client
 */
export async function getGoogleSheetsClient(): Promise<GoogleSpreadsheet> {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!serviceAccountEmail || !privateKey || !sheetId) {
    throw new Error(
      'Missing required Google Sheets environment variables. Please check GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_SHEET_ID.'
    );
  }

  // Create JWT auth client
  const serviceAccountAuth = new JWT({
    email: serviceAccountEmail,
    key: privateKey.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  // Initialize the sheet
  const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
  await doc.loadInfo();

  return doc;
}

/**
 * Append assessment data to Google Sheets
 * Schema follows documentation:
 * Column A: Timestamp
 * Column B: Email
 * Columns C-AQ: Q1-Q40
 * Column AR-BA: Emotion Scores (Joy, Gratitude, Serenity, Interest, Hope, Pride, Amusement, Inspiration, Awe, Love)
 * Column BB: Total_Score
 * Column BC-BE: Lowest_Emotion_1, Lowest_Emotion_2, Lowest_Emotion_3
 * Column BF: Email_Sequence_Started
 */
export async function appendAssessmentData(
  data: AssessmentSubmission
): Promise<void> {
  try {
    const doc = await getGoogleSheetsClient();

    // Get the first sheet (or create it if it doesn't exist)
    let sheet = doc.sheetsByIndex[0];

    if (!sheet) {
      sheet = await doc.addSheet({
        headerValues: [
          'Timestamp',
          'Email',
          ...Array.from({ length: 40 }, (_, i) => `Q${i + 1}`),
          'Joy_Score',
          'Gratitude_Score',
          'Serenity_Score',
          'Interest_Score',
          'Hope_Score',
          'Pride_Score',
          'Amusement_Score',
          'Inspiration_Score',
          'Awe_Score',
          'Love_Score',
          'Total_Score',
          'Lowest_Emotion_1',
          'Lowest_Emotion_2',
          'Lowest_Emotion_3',
          'Email_Sequence_Started',
        ]
      });
    }

    // Prepare row data
    const rowData = {
      Timestamp: data.timestamp.toISOString(),
      Email: data.email,
      // Q1-Q40
      ...Object.fromEntries(
        data.answers.map((answer, index) => [`Q${index + 1}`, answer])
      ),
      // Emotion scores
      Joy_Score: data.scores.Joy,
      Gratitude_Score: data.scores.Gratitude,
      Serenity_Score: data.scores.Serenity,
      Interest_Score: data.scores.Interest,
      Hope_Score: data.scores.Hope,
      Pride_Score: data.scores.Pride,
      Amusement_Score: data.scores.Amusement,
      Inspiration_Score: data.scores.Inspiration,
      Awe_Score: data.scores.Awe,
      Love_Score: data.scores.Love,
      Total_Score: data.totalScore,
      // Lowest emotions
      Lowest_Emotion_1: data.lowestEmotions[0],
      Lowest_Emotion_2: data.lowestEmotions[1],
      Lowest_Emotion_3: data.lowestEmotions[2],
      // Email sequence flag
      Email_Sequence_Started: 'FALSE',
    };

    // Add the row
    await sheet.addRow(rowData);
  } catch (error) {
    console.error('Error appending to Google Sheets:', error);
    throw new Error(
      `Failed to save assessment data: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Test the Google Sheets connection
 * Useful for debugging
 */
export async function testGoogleSheetsConnection(): Promise<boolean> {
  try {
    const doc = await getGoogleSheetsClient();
    console.log('Successfully connected to Google Sheet:', doc.title);
    return true;
  } catch (error) {
    console.error('Failed to connect to Google Sheets:', error);
    return false;
  }
}
