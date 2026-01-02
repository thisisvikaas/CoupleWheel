import { useState } from 'react';
import { vetoService } from '@/services/vetoService';

interface VetoButtonProps {
  userId: string;
  weekSpinId: string;
  vetoAvailable: boolean;
  onVetoUsed: () => void;
}

export default function VetoButton({
  userId,
  weekSpinId,
  vetoAvailable,
  onVetoUsed,
}: VetoButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVeto = async () => {
    setLoading(true);
    setError('');

    const { success, error: vetoError } = await vetoService.useVeto(userId, weekSpinId);

    if (vetoError) {
      setError(vetoError.message);
      setLoading(false);
      return;
    }

    if (success) {
      setShowConfirm(false);
      onVetoUsed();
    }

    setLoading(false);
  };

  if (!vetoAvailable) {
    return (
      <div className="card bg-slate-800/50 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-500">🚫 Veto Power</h3>
            <p className="text-sm text-gray-600">Used this month</p>
          </div>
          <div className="text-4xl opacity-30">🔒</div>
        </div>
      </div>
    );
  }

  if (showConfirm) {
    return (
      <div className="card-neon border-2 border-orange-500/50">
        {error && (
          <div className="bg-red-900/50 border border-red-500/50 text-red-300 px-3 py-2 rounded-xl mb-3 text-sm">
            ❌ {error}
          </div>
        )}
        
        <div className="flex items-start gap-4">
          <div className="text-4xl">⚠️</div>
          <div className="flex-1">
            <h3 className="font-bold text-orange-400 text-lg mb-2">Use Your Veto?</h3>
            <p className="text-sm text-gray-300 mb-4">
              This will <span className="text-yellow-400 font-bold">swap challenges</span> with your partner. 
              You'll get their current challenge and they'll get yours.
              <br /><br />
              <span className="text-orange-400">⚡ You can only veto ONCE per month!</span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleVeto}
                disabled={loading}
                className="btn-danger flex-1"
              >
                {loading ? '⏳ Processing...' : '🔄 YES, SWAP CHALLENGES'}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={loading}
                className="btn-secondary flex-1"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-gradient-to-r from-orange-900/30 to-red-900/30 border-2 border-orange-500/50 hover:border-orange-400/70 transition-all cursor-pointer group"
         onClick={() => setShowConfirm(true)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-4xl group-hover:animate-bounce">🔄</div>
          <div>
            <h3 className="font-bold text-orange-400 text-lg">Veto Power Available!</h3>
            <p className="text-sm text-gray-400">Swap challenges with your partner (1x per month)</p>
          </div>
        </div>
        <button className="btn-danger">
          USE VETO 🎲
        </button>
      </div>
    </div>
  );
}
