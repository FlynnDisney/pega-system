'use client';

import { RATING_SCALE } from '@/lib/constants';

interface QuestionItemProps {
  questionNumber: number;
  questionText: string;
  value: number | null;
  onChange: (value: number) => void;
}

export default function QuestionItem({
  questionNumber,
  questionText,
  value,
  onChange,
}: QuestionItemProps) {
  return (
    <div className="mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">
        <p className="text-lg font-medium text-gray-900">
          <span className="text-blue-600 mr-2">{questionNumber}.</span>
          {questionText}
        </p>
      </div>

      <div className="space-y-2">
        {RATING_SCALE.map((option) => (
          <label
            key={option.value}
            className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <input
              type="radio"
              name={`question-${questionNumber}`}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <span className="ml-3 text-base text-gray-700 select-none">
              <span className="font-medium">{option.value}.</span> {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
