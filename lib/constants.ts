/**
 * PEGA Assessment Constants
 * Questions, emotion mappings, and configuration
 */

import { Emotion, Question } from './types';

// Emotion to item indices mapping (0-indexed for array access)
export const EMOTION_ITEMS: Record<Emotion, number[]> = {
  Joy: [8, 11, 20, 33],           // items 9, 12, 21, 34
  Gratitude: [2, 9, 28, 23],      // items 3, 10, 29, 24
  Serenity: [30, 25, 13, 5],      // items 31, 26, 14, 6
  Interest: [15, 34, 1, 21],      // items 16, 35, 2, 22
  Hope: [3, 26, 7, 12],           // items 4, 27, 8, 13
  Pride: [14, 22, 17, 35],        // items 15, 23, 18, 36
  Amusement: [29, 36, 4, 16],     // items 30, 37, 5, 17
  Inspiration: [6, 38, 24, 39],   // items 7, 39, 25, 40
  Awe: [19, 10, 37, 31],          // items 20, 11, 38, 32
  Love: [0, 18, 32, 27],          // items 1, 19, 33, 28
};

// All 40 PEGA assessment questions
export const QUESTIONS: Question[] = [
  // Love items
  { id: 1, emotion: 'Love', text: 'I feel close and connected to people who are important to me.' },

  // Interest items
  { id: 2, emotion: 'Interest', text: 'I become absorbed in what I\'m doing.' },

  // Gratitude items
  { id: 3, emotion: 'Gratitude', text: 'I find myself thinking about how lucky I am.' },

  // Hope items
  { id: 4, emotion: 'Hope', text: 'I feel confident that I can deal with what the future holds.' },

  // Amusement items
  { id: 5, emotion: 'Amusement', text: 'I find myself laughing and smiling easily.' },

  // Serenity items
  { id: 6, emotion: 'Serenity', text: 'I feel peaceful and tranquil.' },

  // Inspiration items
  { id: 7, emotion: 'Inspiration', text: 'I see possibilities for my own life that inspire me to take action.' },

  // Hope items
  { id: 8, emotion: 'Hope', text: 'I look forward to the future with optimism.' },

  // Joy items
  { id: 9, emotion: 'Joy', text: 'I feel happy and content.' },

  // Gratitude items
  { id: 10, emotion: 'Gratitude', text: 'I have much in my life to be grateful for.' },

  // Awe items
  { id: 11, emotion: 'Awe', text: 'I feel awe or wonder when I encounter great beauty.' },

  // Joy items
  { id: 12, emotion: 'Joy', text: 'I feel a sense of well-being.' },

  // Hope items
  { id: 13, emotion: 'Hope', text: 'I believe good things will happen in my future.' },

  // Serenity items
  { id: 14, emotion: 'Serenity', text: 'I feel calm and at ease.' },

  // Pride items
  { id: 15, emotion: 'Pride', text: 'I feel proud of myself and my accomplishments.' },

  // Interest items
  { id: 16, emotion: 'Interest', text: 'I am eager to learn new things.' },

  // Amusement items
  { id: 17, emotion: 'Amusement', text: 'I experience playfulness in my daily activities.' },

  // Pride items
  { id: 18, emotion: 'Pride', text: 'I feel confident in my abilities.' },

  // Love items
  { id: 19, emotion: 'Love', text: 'I experience warm feelings toward people in my life.' },

  // Awe items
  { id: 20, emotion: 'Awe', text: 'I am struck with wonder at the beauty of nature.' },

  // Joy items
  { id: 21, emotion: 'Joy', text: 'I take pleasure in small things.' },

  // Interest items
  { id: 22, emotion: 'Interest', text: 'I am curious about what\'s going on around me.' },

  // Pride items
  { id: 23, emotion: 'Pride', text: 'I achieve the goals I set for myself.' },

  // Gratitude items
  { id: 24, emotion: 'Gratitude', text: 'I appreciate the people and things in my life.' },

  // Inspiration items
  { id: 25, emotion: 'Inspiration', text: 'Witnessing human excellence motivates me to become my best self.' },

  // Serenity items
  { id: 26, emotion: 'Serenity', text: 'I experience moments of deep contentment.' },

  // Hope items
  { id: 27, emotion: 'Hope', text: 'I approach challenges with a sense that things will work out.' },

  // Love items
  { id: 28, emotion: 'Love', text: 'I trust people in my life to be there when I need them.' },

  // Gratitude items
  { id: 29, emotion: 'Gratitude', text: 'I feel blessed and fortunate.' },

  // Amusement items
  { id: 30, emotion: 'Amusement', text: 'I find humor in everyday situations.' },

  // Serenity items
  { id: 31, emotion: 'Serenity', text: 'I feel relaxed and free from tension.' },

  // Awe items
  { id: 32, emotion: 'Awe', text: 'I am moved by experiences that are greater than myself.' },

  // Love items
  { id: 33, emotion: 'Love', text: 'I share affection openly with people close to me.' },

  // Joy items
  { id: 34, emotion: 'Joy', text: 'I feel joyful and lighthearted.' },

  // Interest items
  { id: 35, emotion: 'Interest', text: 'I find many topics fascinating and want to explore them further.' },

  // Pride items
  { id: 36, emotion: 'Pride', text: 'I recognize and celebrate my own successes.' },

  // Amusement items
  { id: 37, emotion: 'Amusement', text: 'Laughter comes naturally to me throughout the day.' },

  // Awe items
  { id: 38, emotion: 'Awe', text: 'I experience wonder when I encounter something vast or profound.' },

  // Inspiration items
  { id: 39, emotion: 'Inspiration', text: 'When I see others achieve great things, I feel inspired to do great things myself.' },

  // Inspiration items
  { id: 40, emotion: 'Inspiration', text: 'I witness acts of human goodness that move me to be a better person.' },
];

// Rating scale options
export const RATING_SCALE = [
  { value: 1, label: 'Not at all true' },
  { value: 2, label: 'Slightly true' },
  { value: 3, label: 'Somewhat true' },
  { value: 4, label: 'Mostly true' },
  { value: 5, label: 'Very true' },
];

// Score interpretation thresholds
export const SCORE_THRESHOLDS = {
  LOW: { min: 4, max: 8 },
  MODERATE: { min: 9, max: 14 },
  HIGH: { min: 15, max: 20 },
};

// Emotion descriptions for results page
export const EMOTION_DESCRIPTIONS: Record<Emotion, string> = {
  Joy: 'Openness and lightness when things go better than expected - felt throughout your whole body as energy and ease',
  Gratitude: 'A relational emotion that builds secure relationships through responsive, relevant care - noticing needs and acknowledging thoughtfulness',
  Serenity: 'Inner peace that comes from concentration, sensory clarity, and equanimity - feeling settled regardless of external circumstances',
  Interest: 'A pull toward learning created by knowledge gaps that feel closeable and relevant - sustaining engagement through challenges',
  Hope: 'Confidence and motivation through adversity - rooted in realistic planning, personal capability, meaningful goals, and social support',
  Pride: 'Motivation to seek greater challenges from recognising your efforts and contributions - holding your head high with authentic confidence',
  Amusement: 'Emotional flexibility and resilience through playful perspective-taking - finding multiple meanings that create surprise',
  Inspiration: 'Creative energy and motivation for excellence from witnessing quality - like breathing in new possibilities that move you to action',
  Awe: 'Perspective expansion through experiences of vastness and complexity - temporarily changing how you see yourself and the world',
  Love: 'Momentary positivity resonance - sharing positive emotions with mutual care and behavioural synchrony',
};

// Colors for emotion visualization
export const EMOTION_COLORS: Record<Emotion, string> = {
  Joy: '#FFD700',
  Gratitude: '#FF6B9D',
  Serenity: '#87CEEB',
  Interest: '#9370DB',
  Hope: '#98FB98',
  Pride: '#FF8C00',
  Amusement: '#FFB6C1',
  Inspiration: '#FF1493',
  Awe: '#4169E1',
  Love: '#DC143C',
};
