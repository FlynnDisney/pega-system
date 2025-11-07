'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ResultsChart from '@/components/ResultsChart';
import { EmotionScores, Emotion } from '@/lib/types';
import { calculateAssessmentResults } from '@/lib/scoring';

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<{
    scores: EmotionScores;
    totalScore: number;
    lowestEmotions: [Emotion, Emotion, Emotion];
  } | null>(null);
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve results from sessionStorage
    const storedResults = sessionStorage.getItem('assessmentResults');
    const storedEmail = sessionStorage.getItem('assessmentEmail');

    if (!storedResults || !storedEmail) {
      // No results found, redirect to home
      router.push('/');
      return;
    }

    try {
      const parsedResults = JSON.parse(storedResults);
      setResults(parsedResults);
      setEmail(storedEmail);
      setLoading(false);
    } catch (error) {
      console.error('Error parsing results:', error);
      router.push('/');
    }
  }, [router]);

  if (loading || !results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  // Calculate emotion scores with levels for display
  const emotionScoresArray = (Object.entries(results.scores) as [Emotion, number][])
    .map(([emotion, score]) => {
      let level: 'Low' | 'Moderate' | 'High';
      if (score >= 15) level = 'High';
      else if (score >= 9) level = 'Moderate';
      else level = 'Low';

      return { emotion, score, level };
    })
    .sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Positive Emotion Profile
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Results for <span className="font-semibold">{email}</span>
          </p>
        </div>

        {/* Total Score Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-8 mb-8 shadow-lg">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Your Total PEGA Score</h2>
            <div className="text-6xl font-bold mb-2">{results.totalScore}</div>
            <p className="text-xl">out of 200 points</p>
            <p className="mt-4 text-blue-100">
              This score represents your overall positive emotion experience across all 10 emotions
            </p>
          </div>
        </div>

        {/* Lowest Emotions Notice */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8 rounded-r-lg">
          <h2 className="text-xl font-semibold text-yellow-900 mb-3">
            📬 Check Your Email!
          </h2>
          <p className="text-yellow-800 mb-3">
            Based on your results, you&apos;ll receive personalized email courses focused on your
            three greatest opportunities for growth:
          </p>
          <div className="flex flex-wrap gap-2">
            {results.lowestEmotions.map((emotion, index) => (
              <span
                key={emotion}
                className="px-4 py-2 bg-yellow-200 text-yellow-900 rounded-full font-semibold"
              >
                {index + 1}. {emotion}
              </span>
            ))}
          </div>
          <p className="text-sm text-yellow-700 mt-3">
            You&apos;ll receive 12 emails over the next 3 weeks with research-backed exercises and insights
            to help you cultivate these emotions.
          </p>
        </div>

        {/* Emotion Scores Chart */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Your Emotion Scores
          </h2>
          <ResultsChart emotionScores={emotionScoresArray} />
        </div>

        {/* What This Means Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Understanding Your Results
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Your results are based on the <strong>Positive Emotion Growth Assessment (PEGA)</strong>,
              which measures ten positive emotions identified in Barbara Fredrickson&apos;s broaden-and-build
              research.
            </p>
            <div className="grid md:grid-cols-3 gap-4 my-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-green-700 font-semibold mb-1">High (15-20)</div>
                <div className="text-sm text-green-600">Good access to this emotion in daily life</div>
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="text-yellow-700 font-semibold mb-1">Moderate (9-14)</div>
                <div className="text-sm text-yellow-600">Some access with room for growth</div>
              </div>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-red-700 font-semibold mb-1">Low (4-8)</div>
                <div className="text-sm text-red-600">Significant opportunity for growth</div>
              </div>
            </div>
            <p>
              The personalized email courses you&apos;ll receive focus on your three lowest-scoring emotions,
              providing evidence-based interventions to help you cultivate these emotions more regularly.
            </p>
          </div>
        </div>

        {/* CTA Section - Joy Study Teacher Training */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-8 shadow-xl mb-8">
          <h2 className="text-3xl font-bold mb-4">Want to Go Deeper?</h2>
          <p className="text-lg mb-6">
            The <strong>Joy Study Teacher Training</strong> provides comprehensive training in teaching
            positive emotion cultivation to others. Learn the research, master the interventions,
            and become certified to teach this transformative work.
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
            ← Take the assessment again
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
