'use client';

import { EmotionScore } from '@/lib/types';
import { EMOTION_DESCRIPTIONS, EMOTION_COLORS } from '@/lib/constants';

interface ResultsChartProps {
  emotionScores: EmotionScore[];
}

export default function ResultsChart({ emotionScores }: ResultsChartProps) {
  const maxScore = 20;

  return (
    <div className="space-y-4">
      {emotionScores.map(({ emotion, score, level }) => {
        const percentage = (score / maxScore) * 100;
        const color = EMOTION_COLORS[emotion];

        // Determine color class based on level
        let levelColorClass = 'bg-red-500';
        if (level === 'High') levelColorClass = 'bg-green-500';
        else if (level === 'Moderate') levelColorClass = 'bg-yellow-500';

        return (
          <div key={emotion} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{emotion}</h3>
                <p className="text-sm text-gray-600">{EMOTION_DESCRIPTIONS[emotion]}</p>
              </div>
              <div className="text-right ml-4">
                <div className="text-2xl font-bold text-gray-900">{score}</div>
                <div className="text-xs text-gray-500">out of 20</div>
              </div>
            </div>

            {/* Bar */}
            <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-4 rounded-full transition-all duration-500 ease-out ${levelColorClass}`}
                style={{
                  width: `${percentage}%`,
                  backgroundColor: color,
                }}
              />
            </div>

            {/* Level indicator */}
            <div className="mt-2 flex items-center justify-between text-sm">
              <span
                className={`px-2 py-1 rounded text-white font-medium ${
                  level === 'High'
                    ? 'bg-green-600'
                    : level === 'Moderate'
                    ? 'bg-yellow-600'
                    : 'bg-red-600'
                }`}
              >
                {level}
              </span>
              <span className="text-gray-500">
                {level === 'High' && 'Good access to this emotion'}
                {level === 'Moderate' && 'Some access with room for growth'}
                {level === 'Low' && 'Significant opportunity for growth'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
