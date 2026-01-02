import useCurrentSpin from '@/hooks/useCurrentSpin';
import { useAuthStore } from '@/store/authStore';
import VetoButton from '@/components/veto/VetoButton';
import CategoryTag from '@/components/tasks/CategoryTag';

export default function CurrentWeek() {
  const { user, partner } = useAuthStore();
  const { currentWeek, loading, error, reload } = useCurrentSpin();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-yellow-500/30 rounded-full"></div>
          <div className="w-20 h-20 border-4 border-t-yellow-400 rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="mt-6 text-yellow-400 font-bold text-lg animate-pulse">Loading Challenge...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card-neon text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!currentWeek) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card-gold text-center animate-pulse-glow">
          <div className="text-6xl mb-4 animate-float">🎡</div>
          <h2 className="text-2xl font-bold text-yellow-400 glow-gold mb-4">No Active Challenge</h2>
          <p className="text-gray-300">
            Spin the wheel on Sunday at 11:00 PM to get your weekly challenge!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black mb-2">
          <span className="neon-text">🎯 THIS WEEK'S CHALLENGE 🎯</span>
        </h1>
        <p className="text-purple-300">
          {currentWeek.daysRemaining > 0
            ? `⏰ ${currentWeek.daysRemaining} day${currentWeek.daysRemaining !== 1 ? 's' : ''} remaining`
            : '🔥 Final day! Make it count!'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Your Challenge */}
        <div className="card-gold animate-pulse-glow">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-bold text-yellow-400 glow-gold">🎯 YOUR MISSION</h2>
            <div className="text-4xl animate-float">🏆</div>
          </div>
          
          <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
            <p className="text-white text-lg leading-relaxed">{currentWeek.myTask.text}</p>
          </div>

          {currentWeek.myTask.category && (
            <CategoryTag category={currentWeek.myTask.category} />
          )}

          <div className="mt-4 pt-4 border-t border-yellow-500/30">
            <p className="text-sm text-gray-400">
              Created by: <span className="text-pink-400 font-bold">{currentWeek.myTaskAssignedTo}</span>
            </p>
          </div>
        </div>

        {/* Partner's Challenge */}
        <div className="card-neon">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-bold text-pink-400">💕 {partner?.name}'s MISSION</h2>
            <div className="text-4xl animate-float" style={{ animationDelay: '0.5s' }}>👀</div>
          </div>
          
          <div className="bg-slate-900/50 rounded-xl p-4 mb-4">
            <p className="text-gray-300 text-lg leading-relaxed">{currentWeek.partnerTask.text}</p>
          </div>

          {currentWeek.partnerTask.category && (
            <CategoryTag category={currentWeek.partnerTask.category} />
          )}

          <div className="mt-4 pt-4 border-t border-pink-500/30">
            <p className="text-sm text-gray-400">
              Created by: <span className="text-yellow-400 font-bold">{currentWeek.partnerTaskAssignedTo}</span>
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

      {/* How It Works */}
      <div className="card mt-6">
        <h3 className="text-lg font-bold text-yellow-400 mb-4">🎰 How To Win</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">📝</div>
            <p className="text-gray-300 text-sm">Complete your challenge</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">📸</div>
            <p className="text-gray-300 text-sm">Document the fun</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">✅</div>
            <p className="text-gray-300 text-sm">Get verified Sunday</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🏆</div>
            <p className="text-gray-300 text-sm">Celebrate together!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
