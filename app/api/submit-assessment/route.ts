/**
 * API Route: Submit Assessment
 * POST /api/submit-assessment
 * Receives assessment answers, calculates scores, saves to Google Sheets
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  validateAnswers,
  calculateAllScores,
  calculateTotalScore,
  identifyLowestEmotions,
} from '@/lib/scoring';
import { appendAssessmentData, findOriginalAssessment } from '@/lib/googleSheets';
import { AssessmentSubmission } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { email, answers, isReassessment } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required and must be a string' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Validate answers
    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Answers must be an array' },
        { status: 400 }
      );
    }

    try {
      validateAnswers(answers);
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : 'Invalid answers provided',
        },
        { status: 400 }
      );
    }

    // Calculate scores
    const scores = calculateAllScores(answers);
    const totalScore = calculateTotalScore(answers);
    const lowestEmotions = identifyLowestEmotions(scores);

    // Prepare submission data
    const submission: AssessmentSubmission = {
      email,
      answers,
      scores,
      totalScore,
      lowestEmotions,
      timestamp: new Date(),
    };

    // Check if this is a reassessment and find original data
    let originalData = null;
    if (isReassessment) {
      try {
        originalData = await findOriginalAssessment(email);
      } catch (error) {
        console.error('Error finding original assessment:', error);
        // Continue even if we can't find original - save as regular reassessment
      }
    }

    // Save to Google Sheets
    try {
      await appendAssessmentData(
        submission,
        isReassessment || false,
        originalData?.timestamp
      );
    } catch (error) {
      console.error('Error saving to Google Sheets:', error);
      return NextResponse.json(
        {
          error: 'Failed to save assessment data. Please try again.',
          details:
            error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      );
    }

    // Return results to frontend
    if (isReassessment && originalData) {
      // Return comparison data
      return NextResponse.json({
        success: true,
        isComparison: true,
        comparison: {
          original: {
            scores: originalData.scores,
            totalScore: originalData.totalScore,
            timestamp: originalData.timestamp,
          },
          current: {
            scores,
            totalScore,
            timestamp: submission.timestamp.toISOString(),
          },
        },
      });
    } else {
      // Return regular results
      return NextResponse.json({
        success: true,
        isComparison: false,
        results: {
          scores,
          totalScore,
          lowestEmotions,
        },
      });
    }
  } catch (error) {
    console.error('Unexpected error in submit-assessment:', error);
    return NextResponse.json(
      {
        error: 'An unexpected error occurred. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Disable for other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
