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
      <div className="card bg-gray-50 border border-gray-300">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-700">Veto Power</h3>
            <p className="text-sm text-gray-600">Used this month</p>
          </div>
          <div className="text-3xl opacity-50">🚫</div>
        </div>
      </div>
    );
  }

  if (showConfirm) {
    return (
      <div className="card bg-orange-50 border-2 border-orange-300">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-3 text-sm">
            {error}
          </div>
        )}
        
        <h3 className="font-semibold mb-2">Use Your Veto?</h3>
        <p className="text-sm text-gray-700 mb-4">
          This will swap the task assignments. You'll get your partner's current task, and
          they'll get yours. You can only veto once per month!
        </p>
        <div className="flex space-x-2">
          <button
            onClick={handleVeto}
            disabled={loading}
            className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Yes, Use Veto'}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            disabled={loading}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-orange-50 border-2 border-orange-300 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-orange-800">Veto Power Available</h3>
          <p className="text-sm text-orange-700">Swap tasks (1 per month)</p>
        </div>
        <button
          onClick={() => setShowConfirm(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
        >
          Use Veto 🔄
        </button>
      </div>
    </div>
  );
}

