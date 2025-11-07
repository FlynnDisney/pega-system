/**
 * PEGA Assessment Scoring Logic
 * Calculates emotion subscale scores and identifies lowest emotions
 */

import { Emotion, EmotionScores, AssessmentResults, ScoreLevel, EmotionScore } from './types';
import { EMOTION_ITEMS, SCORE_THRESHOLDS } from './constants';

/**
 * Calculate score for a single emotion subscale
 * @param answers - Array of 40 answers (1-5)
 * @param itemIndices - Indices of items for this emotion
 * @returns Score for the emotion (4-20)
 */
export function calculateEmotionScore(
  answers: number[],
  itemIndices: number[]
): number {
  if (answers.length !== 40) {
    throw new Error('Answers array must contain exactly 40 items');
  }

  if (itemIndices.length !== 4) {
    throw new Error('Each emotion must have exactly 4 items');
  }

  // Sum the scores for the 4 items
  const score = itemIndices.reduce((sum, index) => {
    const answer = answers[index];
    if (answer < 1 || answer > 5) {
      throw new Error(`Invalid answer value: ${answer}. Must be between 1 and 5.`);
    }
    return sum + answer;
  }, 0);

  return score;
}

/**
 * Calculate all 10 emotion subscale scores
 * @param answers - Array of 40 answers (1-5)
 * @returns Object with scores for all 10 emotions
 */
export function calculateAllScores(answers: number[]): EmotionScores {
  const emotions: Emotion[] = [
    'Joy',
    'Gratitude',
    'Serenity',
    'Interest',
    'Hope',
    'Pride',
    'Amusement',
    'Inspiration',
    'Awe',
    'Love',
  ];

  const scores: Partial<EmotionScores> = {};

  emotions.forEach((emotion) => {
    scores[emotion] = calculateEmotionScore(answers, EMOTION_ITEMS[emotion]);
  });

  return scores as EmotionScores;
}

/**
 * Calculate total PEGA score (sum of all 40 items)
 * @param answers - Array of 40 answers (1-5)
 * @returns Total score (40-200)
 */
export function calculateTotalScore(answers: number[]): number {
  if (answers.length !== 40) {
    throw new Error('Answers array must contain exactly 40 items');
  }

  return answers.reduce((sum, answer) => sum + answer, 0);
}

/**
 * Determine score level based on score value
 * @param score - Emotion subscale score (4-20)
 * @returns Score level (Low, Moderate, or High)
 */
export function getScoreLevel(score: number): ScoreLevel {
  if (score >= SCORE_THRESHOLDS.HIGH.min && score <= SCORE_THRESHOLDS.HIGH.max) {
    return 'High';
  } else if (
    score >= SCORE_THRESHOLDS.MODERATE.min &&
    score <= SCORE_THRESHOLDS.MODERATE.max
  ) {
    return 'Moderate';
  } else {
    return 'Low';
  }
}

/**
 * Identify the 3 lowest-scoring emotions
 * In case of ties, maintains alphabetical order for consistency
 * @param scores - Object with scores for all 10 emotions
 * @returns Array of 3 lowest-scoring emotions
 */
export function identifyLowestEmotions(
  scores: EmotionScores
): [Emotion, Emotion, Emotion] {
  // Convert to array of {emotion, score} objects
  const emotionScoreArray = (Object.entries(scores) as [Emotion, number][]).map(
    ([emotion, score]) => ({
      emotion,
      score,
    })
  );

  // Sort by score ascending, then by emotion name alphabetically for ties
  emotionScoreArray.sort((a, b) => {
    if (a.score !== b.score) {
      return a.score - b.score;
    }
    return a.emotion.localeCompare(b.emotion);
  });

  // Return the 3 lowest
  return [
    emotionScoreArray[0].emotion,
    emotionScoreArray[1].emotion,
    emotionScoreArray[2].emotion,
  ];
}

/**
 * Calculate complete assessment results
 * @param answers - Array of 40 answers (1-5)
 * @returns Complete assessment results with scores and lowest emotions
 */
export function calculateAssessmentResults(answers: number[]): AssessmentResults {
  const scores = calculateAllScores(answers);
  const totalScore = calculateTotalScore(answers);
  const lowestEmotions = identifyLowestEmotions(scores);

  // Create array with emotion scores and levels
  const emotionScoresArray: EmotionScore[] = (
    Object.entries(scores) as [Emotion, number][]
  ).map(([emotion, score]) => ({
    emotion,
    score,
    level: getScoreLevel(score),
  }));

  // Sort by score descending for display
  emotionScoresArray.sort((a, b) => b.score - a.score);

  return {
    scores,
    totalScore,
    lowestEmotions,
    emotionScoresArray,
  };
}

/**
 * Validate assessment answers
 * @param answers - Array of answers to validate
 * @returns true if valid, throws error otherwise
 */
export function validateAnswers(answers: number[]): boolean {
  if (!Array.isArray(answers)) {
    throw new Error('Answers must be an array');
  }

  if (answers.length !== 40) {
    throw new Error('Must provide exactly 40 answers');
  }

  answers.forEach((answer, index) => {
    if (typeof answer !== 'number') {
      throw new Error(`Answer at index ${index} must be a number`);
    }
    if (answer < 1 || answer > 5) {
      throw new Error(`Answer at index ${index} must be between 1 and 5`);
    }
    if (!Number.isInteger(answer)) {
      throw new Error(`Answer at index ${index} must be an integer`);
    }
  });

  return true;
}
