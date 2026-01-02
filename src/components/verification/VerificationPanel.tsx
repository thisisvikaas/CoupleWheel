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
      <div className="card-gold max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-yellow-400 glow-gold mb-6">
          ✅ Last Week's Challenges
        </h2>
        
        <div className="space-y-4 mb-6">
          <div className="bg-slate-900/50 rounded-xl p-4 border border-blue-500/30">
            <h3 className="font-bold text-blue-400 mb-2">Your Challenge Was:</h3>
            <p className="text-gray-200">{userTask.text}</p>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-4 border border-pink-500/30">
            <h3 className="font-bold text-pink-400 mb-2">{partnerName}'s Challenge Was:</h3>
            <p className="text-gray-200">{partnerTask.text}</p>
          </div>
        </div>

        <div className="text-center space-y-3">
          <div className="flex items-center justify-center text-green-400">
            <span className="text-2xl mr-2">✅</span>
            <span className="font-bold">You've verified!</span>
          </div>
          {partnerHasVerified ? (
            <div className="flex items-center justify-center text-green-400">
              <span className="text-2xl mr-2">✅</span>
              <span className="font-bold">{partnerName} has verified!</span>
            </div>
          ) : (
            <div className="flex items-center justify-center text-yellow-400">
              <span className="text-2xl mr-2 animate-pulse">⏳</span>
              <span>Waiting for {partnerName}...</span>
            </div>
          )}
          {partnerHasVerified && (
            <div className="mt-4 p-4 bg-green-900/30 border border-green-500/30 rounded-xl">
              <p className="text-green-400 font-bold">
                🎰 Both verified! Wheel unlocks at 11:00 PM tonight!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="card-neon max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">
        <span className="neon-text">⚡ VERIFICATION TIME ⚡</span>
      </h2>

      {error && (
        <div className="bg-red-900/50 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl mb-4">
          ❌ {error}
        </div>
      )}

      <div className="space-y-4 mb-6">
        <div className="bg-slate-900/50 rounded-xl p-4 border border-blue-500/30">
          <h3 className="font-bold text-blue-400 mb-2">🎯 Your Challenge Was:</h3>
          <p className="text-gray-200">{userTask.text}</p>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 border border-pink-500/30">
          <h3 className="font-bold text-pink-400 mb-2">💕 {partnerName}'s Challenge Was:</h3>
          <p className="text-gray-200">{partnerTask.text}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="font-bold text-yellow-400 mb-3 text-center text-lg">
            Did {partnerName} complete their challenge? 🤔
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setPartnerCompleted(true)}
              className={`flex-1 py-4 px-4 rounded-xl border-2 transition-all text-lg font-bold ${
                partnerCompleted === true
                  ? 'border-green-500 bg-green-900/50 text-green-400 scale-105'
                  : 'border-gray-700 hover:border-green-500/50 text-gray-300'
              }`}
            >
              ✅ YES!
            </button>
            <button
              onClick={() => setPartnerCompleted(false)}
              className={`flex-1 py-4 px-4 rounded-xl border-2 transition-all text-lg font-bold ${
                partnerCompleted === false
                  ? 'border-red-500 bg-red-900/50 text-red-400 scale-105'
                  : 'border-gray-700 hover:border-red-500/50 text-gray-300'
              }`}
            >
              ❌ NO
            </button>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={partnerCompleted === null || loading}
          className="btn-primary w-full text-lg py-4"
        >
          {loading ? '⏳ Submitting...' : '🎲 SUBMIT VERIFICATION'}
        </button>

        <p className="text-sm text-gray-500 text-center">
          Be honest! This helps track your progress together. 💕
        </p>
      </div>
    </div>
  );
}
