import useCurrentSpin from '@/hooks/useCurrentSpin';
import { useAuthStore } from '@/store/authStore';
import VetoButton from '@/components/veto/VetoButton';
import CategoryTag from '@/components/tasks/CategoryTag';

export default function CurrentWeek() {
  const { user, partner } = useAuthStore();
  const { currentWeek, loading, error, reload } = useCurrentSpin();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card bg-red-50 border border-red-200">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!currentWeek) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <div className="text-6xl mb-4">📅</div>
          <h2 className="text-2xl font-bold mb-2">No Active Tasks</h2>
          <p className="text-gray-600">
            Wait until Sunday at 11:00 PM to spin the wheel and get your tasks for next
            week!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">This Week's Challenge</h1>
        <p className="text-gray-600">
          {currentWeek.daysRemaining > 0
            ? `${currentWeek.daysRemaining} day${
                currentWeek.daysRemaining !== 1 ? 's' : ''
              } remaining until next spin`
            : 'Last day! Verification starts Sunday.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Your Task */}
        <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300">
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-xl font-bold text-purple-800">Your Challenge</h2>
            <div className="text-3xl">🎯</div>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-800 text-lg mb-2">{currentWeek.myTask.text}</p>
            {currentWeek.myTask.category && (
              <CategoryTag category={currentWeek.myTask.category} />
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-purple-200">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Created by:</span> {currentWeek.myTaskAssignedTo}
            </p>
          </div>
        </div>

        {/* Partner's Task */}
        <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300">
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-xl font-bold text-blue-800">
              {partner?.name}'s Challenge
            </h2>
            <div className="text-3xl">👀</div>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-800 text-lg mb-2">{currentWeek.partnerTask.text}</p>
            {currentWeek.partnerTask.category && (
              <CategoryTag category={currentWeek.partnerTask.category} />
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Created by:</span>{' '}
              {currentWeek.partnerTaskAssignedTo}
            </p>
          </div>
        </div>
      </div>

      {/* Veto Button */}
      {user && (
        <VetoButton
          userId={user.id}
          weekSpinId={currentWeek.spinId}
          vetoAvailable={currentWeek.vetoAvailable}
          onVetoUsed={reload}
        />
      )}

      {/* Progress Info */}
      <div className="card mt-6 bg-gray-50">
        <h3 className="font-semibold mb-3">How It Works</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="mr-2">📝</span>
            <span>Complete your task anytime during the week</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✅</span>
            <span>
              On Sunday, verify if your partner completed their task (be honest!)
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">🎡</span>
            <span>After 11:00 PM Sunday, spin the wheel for next week's tasks</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">🔄</span>
            <span>
              Use your veto power (1 per month) to swap tasks if you really need to
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

