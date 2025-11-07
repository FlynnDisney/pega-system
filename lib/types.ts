/**
 * PEGA Assessment Types
 * Type definitions for the Positive Emotion Growth Assessment
 */

export type Emotion =
  | 'Joy'
  | 'Gratitude'
  | 'Serenity'
  | 'Interest'
  | 'Hope'
  | 'Pride'
  | 'Amusement'
  | 'Inspiration'
  | 'Awe'
  | 'Love';

export type ScoreLevel = 'Low' | 'Moderate' | 'High';

export interface EmotionScores {
  Joy: number;
  Gratitude: number;
  Serenity: number;
  Interest: number;
  Hope: number;
  Pride: number;
  Amusement: number;
  Inspiration: number;
  Awe: number;
  Love: number;
}

export interface EmotionScore {
  emotion: Emotion;
  score: number;
  level: ScoreLevel;
}

export interface AssessmentSubmission {
  email: string;
  answers: number[]; // 40 items, each 1-5
  scores: EmotionScores;
  totalScore: number;
  lowestEmotions: [Emotion, Emotion, Emotion];
  timestamp: Date;
}

export interface AssessmentResults {
  scores: EmotionScores;
  totalScore: number;
  lowestEmotions: [Emotion, Emotion, Emotion];
  emotionScoresArray: EmotionScore[];
}

export interface Question {
  id: number;
  text: string;
  emotion: Emotion;
}
