import { useState } from 'react';
import { WeeklySpin, Task } from '@/types';
import { supabase } from '@/supabaseClient';

interface VerificationPanelProps {
  spin: WeeklySpin;
  userId: string;
  userTask: Task;
  partnerTask: Task;
  partnerName: string;
  onVerificationComplete: () => void;
}

export default function VerificationPanel({
  spin,
  userId,
  userTask,
  partnerTask,
  partnerName,
  onVerificationComplete,
}: VerificationPanelProps) {
  const [partnerCompleted, setPartnerCompleted] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isUserA = spin.user_a_id === userId;
  const hasVerified = isUserA
    ? spin.user_a_verified_by_partner !== null
    : spin.user_b_verified_by_partner !== null;
  const partnerHasVerified = isUserA
    ? spin.user_b_verified_by_partner !== null
    : spin.user_a_verified_by_partner !== null;

  const handleSubmit = async () => {
    if (partnerCompleted === null) {
      setError('Please indicate if your partner completed their task');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const updateField = isUserA
        ? 'user_b_verified_by_partner'
        : 'user_a_verified_by_partner';

      const { error: updateError } = await supabase
        .from('weekly_spins')
        .update({ [updateField]: partnerCompleted })
        .eq('id', spin.id);

      if (updateError) throw updateError;

      onVerificationComplete();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (hasVerified) {
    return (
      <div className="card max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">Last Week's Tasks</h2>
        
        <div className="space-y-4 mb-6">
          <div className="card bg-blue-50 border border-blue-200">
            <h3 className="font-semibold mb-2">Your Task:</h3>
            <p className="text-gray-800">{userTask.text}</p>
          </div>

          <div className="card bg-purple-50 border border-purple-200">
            <h3 className="font-semibold mb-2">{partnerName}'s Task:</h3>
            <p className="text-gray-800">{partnerTask.text}</p>
          </div>
        </div>

        <div className="text-center space-y-2">
          <div className="flex items-center justify-center text-green-600">
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-medium">You've verified!</span>
          </div>
          {partnerHasVerified ? (
            <div className="flex items-center justify-center text-green-600">
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="font-medium">{partnerName} has verified!</span>
            </div>
          ) : (
            <p className="text-gray-600">Waiting for {partnerName} to verify...</p>
          )}
          {partnerHasVerified && (
            <p className="text-purple-600 font-medium mt-4">
              ✨ Both verified! The spinner will be available at 11:00 PM tonight.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">
        Verify Last Week's Tasks
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4 mb-6">
        <div className="card bg-blue-50 border border-blue-200">
          <h3 className="font-semibold mb-2">Your Task Was:</h3>
          <p className="text-gray-800">{userTask.text}</p>
        </div>

        <div className="card bg-purple-50 border border-purple-200">
          <h3 className="font-semibold mb-2">{partnerName}'s Task Was:</h3>
          <p className="text-gray-800">{partnerTask.text}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="font-medium mb-3">Did {partnerName} complete their task?</p>
          <div className="flex space-x-4">
            <button
              onClick={() => setPartnerCompleted(true)}
              className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                partnerCompleted === true
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 hover:border-green-300'
              }`}
            >
              ✓ Yes, they did!
            </button>
            <button
              onClick={() => setPartnerCompleted(false)}
              className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                partnerCompleted === false
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-300 hover:border-red-300'
              }`}
            >
              ✗ No, they didn't
            </button>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={partnerCompleted === null || loading}
          className="btn-primary w-full"
        >
          {loading ? 'Submitting...' : 'Submit Verification'}
        </button>

        <p className="text-sm text-gray-500 text-center">
          Be honest! This helps track your progress together.
        </p>
      </div>
    </div>
  );
}

