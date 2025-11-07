'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EmotionScores, Emotion } from '@/lib/types';
import { EMOTION_COLORS, EMOTION_DESCRIPTIONS } from '@/lib/constants';

interface ComparisonData {
  original: {
    scores: EmotionScores;
    totalScore: number;
    timestamp: string;
  };
  current: {
    scores: EmotionScores;
    totalScore: number;
    timestamp: string;
  };
}

export default function ComparisonResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<ComparisonData | null>(null);
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve comparison data from sessionStorage
    const storedData = sessionStorage.getItem('comparisonResults');
    const storedEmail = sessionStorage.getItem('assessmentEmail');

    if (!storedData || !storedEmail) {
      // No comparison data, redirect to regular results
      const regularResults = sessionStorage.getItem('assessmentResults');
      if (regularResults) {
        router.push('/results');
      } else {
        router.push('/');
      }
      return;
    }

    try {
      const parsedData = JSON.parse(storedData);
      setData(parsedData);
      setEmail(storedEmail);
      setLoading(false);
    } catch (error) {
      console.error('Error parsing comparison data:', error);
      router.push('/');
    }
  }, [router]);

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your comparison...</p>
        </div>
      </div>
    );
  }

  // Calculate gains for each emotion
  const emotions: Emotion[] = ['Joy', 'Gratitude', 'Serenity', 'Interest', 'Hope', 'Pride', 'Amusement', 'Inspiration', 'Awe', 'Love'];
  const comparisons = emotions.map(emotion => {
    const originalScore = data.original.scores[emotion];
    const currentScore = data.current.scores[emotion];
    const gain = currentScore - originalScore;
    const percentChange = originalScore > 0 ? ((gain / originalScore) * 100).toFixed(1) : '0';

    return {
      emotion,
      originalScore,
      currentScore,
      gain,
      percentChange: parseFloat(percentChange),
    };
  });

  // Sort by gain (highest improvement first)
  const sortedComparisons = [...comparisons].sort((a, b) => b.gain - a.gain);

  const totalGain = data.current.totalScore - data.original.totalScore;
  const totalPercentChange = ((totalGain / data.original.totalScore) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Positive Emotion Growth
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Comparing your progress for <span className="font-semibold">{email}</span>
          </p>
          <p className="text-sm text-gray-500">
            Original: {new Date(data.original.timestamp).toLocaleDateString()} •
            Reassessment: {new Date(data.current.timestamp).toLocaleDateString()}
          </p>
        </div>

        {/* Total Score Comparison */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-8 mb-8 shadow-lg">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Total PEGA Score Change</h2>
            <div className="flex items-center justify-center gap-8 mb-4">
              <div>
                <div className="text-sm opacity-90">Original</div>
                <div className="text-4xl font-bold">{data.original.totalScore}</div>
              </div>
              <div className="text-3xl">→</div>
              <div>
                <div className="text-sm opacity-90">Current</div>
                <div className="text-4xl font-bold">{data.current.totalScore}</div>
              </div>
            </div>
            <div className="text-xl">
              {totalGain >= 0 ? (
                <span className="text-green-200">
                  ▲ +{totalGain} points ({totalPercentChange}% increase)
                </span>
              ) : (
                <span className="text-red-200">
                  ▼ {totalGain} points ({totalPercentChange}% decrease)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Emotion-by-Emotion Comparison */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Growth by Emotion
          </h2>
          <div className="space-y-4">
            {sortedComparisons.map(({ emotion, originalScore, currentScore, gain, percentChange }) => {
              const color = EMOTION_COLORS[emotion];

              return (
                <div key={emotion} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{emotion}</h3>
                      <p className="text-sm text-gray-600">{EMOTION_DESCRIPTIONS[emotion]}</p>
                    </div>
                    <div className="text-right ml-4">
                      {gain > 0 ? (
                        <div className="text-2xl font-bold text-green-600">
                          +{gain}
                        </div>
                      ) : gain < 0 ? (
                        <div className="text-2xl font-bold text-red-600">
                          {gain}
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-gray-500">
                          0
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        {percentChange > 0 ? `+${percentChange}%` : `${percentChange}%`}
                      </div>
                    </div>
                  </div>

                  {/* Visual comparison bars */}
                  <div className="space-y-2">
                    {/* Original score */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Original</span>
                        <span className="text-gray-700 font-medium">{originalScore}/20</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="h-3 rounded-full bg-gray-400"
                          style={{
                            width: `${(originalScore / 20) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Current score */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Current</span>
                        <span className="text-gray-900 font-bold">{currentScore}/20</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="h-3 rounded-full transition-all"
                          style={{
                            width: `${(currentScore / 20) * 100}%`,
                            backgroundColor: color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Insights Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your Progress
          </h2>
          <div className="space-y-4 text-gray-700">
            {totalGain > 0 ? (
              <p className="text-lg text-green-700 font-semibold">
                🎉 Congratulations! Your overall positive emotion score increased by {totalGain} points.
              </p>
            ) : totalGain < 0 ? (
              <p className="text-lg text-gray-700">
                Your score decreased by {Math.abs(totalGain)} points. Remember that emotions naturally fluctuate - what matters is the long-term trend and consistent practice.
              </p>
            ) : (
              <p className="text-lg text-gray-700">
                Your score remained the same. Positive emotions develop gradually with consistent practice.
              </p>
            )}

            <p>
              Positive emotions develop like muscles - consistent practice over time creates lasting change.
              The interventions you've received are designed for ongoing use, not just a one-time experience.
            </p>

            {sortedComparisons[0].gain > 0 && (
              <p>
                Your biggest improvement was in <strong>{sortedComparisons[0].emotion}</strong>,
                which increased by {sortedComparisons[0].gain} points. Keep practicing the interventions for this emotion!
              </p>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-8 shadow-xl mb-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Go Deeper?</h2>
          <p className="text-lg mb-6">
            The <strong>Joy Study Teacher Training</strong> offers six months of structured practice
            with direct feedback, peer support, and comprehensive training in teaching positive emotion
            cultivation to others.
          </p>
          <a
            href="https://flynndisney.com/joy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-purple-600 font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Learn More About Joy Study Teacher Training →
          </a>
        </div>

        {/* Footer Actions */}
        <div className="text-center space-y-4">
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Take another assessment
          </button>
          <div className="text-sm text-gray-500">
            <a href="https://flynndisney.com" className="hover:text-gray-700">
              Return to flynndisney.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
