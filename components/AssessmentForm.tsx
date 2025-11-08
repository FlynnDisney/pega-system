'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { QUESTIONS } from '@/lib/constants';
import QuestionItem from './QuestionItem';
import ProgressBar from './ProgressBar';

export default function AssessmentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isReassessment = searchParams.get('reassessment') === 'true';
  const [email, setEmail] = useState('');
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(40).fill(null)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  const answeredCount = answers.filter((a) => a !== null).length;
  const allAnswered = answeredCount === 40;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    // Scroll to first unanswered question when form loads
    const firstUnanswered = answers.findIndex((a) => a === null);
    if (firstUnanswered !== -1) {
      const element = document.getElementById(`question-${firstUnanswered + 1}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, []);

  const handleAnswerChange = (questionIndex: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);
    setError('');
  };

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailError('');

    // Validate email
    if (!validateEmail(email)) {
      return;
    }

    // Validate all questions answered
    if (!allAnswered) {
      setError('Please answer all 40 questions before submitting.');
      // Scroll to first unanswered question
      const firstUnanswered = answers.findIndex((a) => a === null);
      if (firstUnanswered !== -1) {
        const element = document.getElementById(`question-${firstUnanswered + 1}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/submit-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          answers: answers as number[],
          isReassessment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit assessment');
      }

      // Store results in sessionStorage and redirect
      sessionStorage.setItem('assessmentEmail', email);

      if (data.isComparison && data.comparison) {
        // This is a reassessment with comparison data
        sessionStorage.setItem('comparisonResults', JSON.stringify(data.comparison));
        router.push('/results/comparison');
      } else {
        // Regular assessment
        sessionStorage.setItem('assessmentResults', JSON.stringify(data.results));
        router.push('/results');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred. Please try again.'
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProgressBar current={answeredCount} total={40} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isReassessment ? 'PEGA Reassessment' : 'Positive Emotion Growth Assessment'}
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            {isReassessment
              ? 'Measure your emotional growth over the past month'
              : 'Discover your positive emotion profile and receive a personalised course'}
          </p>
          <p className="text-sm text-gray-500">
            Takes approximately 8-10 minutes • All responses are confidential
          </p>
          {isReassessment && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800">
                📊 Your results will compare to your original assessment, showing your growth in each emotion.
              </p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-3">
            How to Complete This Assessment
          </h2>
          <p className="text-blue-800 mb-3">
            Please rate each statement based on how true it feels for you in your daily life.
            Use the following scale:
          </p>
          <ul className="space-y-1 text-sm text-blue-800">
            <li><strong>1 - Not at all true:</strong> This doesn&apos;t describe me at all</li>
            <li><strong>2 - Slightly true:</strong> This describes me a little</li>
            <li><strong>3 - Somewhat true:</strong> This describes me moderately</li>
            <li><strong>4 - Mostly true:</strong> This describes me well</li>
            <li><strong>5 - Very true:</strong> This describes me very well</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email Collection */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
            <label htmlFor="email" className="block text-lg font-medium text-gray-900 mb-2">
              Email Address
            </label>
            <p className="text-sm text-gray-600 mb-4">
              We&apos;ll send your personalized results and email courses here
            </p>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError('');
              }}
              onBlur={() => validateEmail(email)}
              className={`w-full px-4 py-3 border ${
                emailError ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg`}
              placeholder="your.email@example.com"
              required
            />
            {emailError && (
              <p className="mt-2 text-sm text-red-600">{emailError}</p>
            )}
          </div>

          {/* Questions */}
          <div className="space-y-4">
            {QUESTIONS.map((question, index) => (
              <div key={question.id} id={`question-${question.id}`}>
                <QuestionItem
                  questionNumber={question.id}
                  questionText={question.text}
                  value={answers[index]}
                  onChange={(value) => handleAnswerChange(index, value)}
                />
              </div>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 shadow-lg mt-8 p-6">
            <div className="max-w-4xl mx-auto">
              <button
                type="submit"
                disabled={!allAnswered || !isEmailValid || isSubmitting}
                className={`w-full py-4 px-6 rounded-lg text-lg font-semibold transition-all ${
                  allAnswered && isEmailValid && !isSubmitting
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  `Submit Assessment ${allAnswered ? '✓' : `(${answeredCount}/40)`}`
                )}
              </button>
              {!allAnswered && (
                <p className="text-center text-sm text-gray-500 mt-2">
                  Please answer all questions to submit
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
