import useCountdown from '@/hooks/useCountdown';

export default function CountdownTimer() {
  const timeRemaining = useCountdown();

  if (timeRemaining.total <= 0) {
    return (
      <div className="card-gold text-center animate-pulse-glow">
        <h3 className="text-2xl font-bold text-yellow-400 glow-gold mb-2">
          🎰 THE WHEEL IS READY! 🎰
        </h3>
        <p className="text-gray-300">Refresh to spin!</p>
      </div>
    );
  }

  return (
    <div className="card-neon">
      <div className="text-center">
        <h3 className="text-xl font-bold text-purple-400 mb-6">⏰ Next Spin Unlocks In</h3>
        
        <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
          <div className="bg-slate-800/80 rounded-xl p-4 border border-yellow-500/30">
            <div className="slot-number">{String(timeRemaining.days).padStart(2, '0')}</div>
            <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Days</div>
          </div>
          <div className="bg-slate-800/80 rounded-xl p-4 border border-yellow-500/30">
            <div className="slot-number">{String(timeRemaining.hours).padStart(2, '0')}</div>
            <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Hours</div>
          </div>
          <div className="bg-slate-800/80 rounded-xl p-4 border border-yellow-500/30">
            <div className="slot-number">{String(timeRemaining.minutes).padStart(2, '0')}</div>
            <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Mins</div>
          </div>
          <div className="bg-slate-800/80 rounded-xl p-4 border border-yellow-500/30">
            <div className="slot-number">{String(timeRemaining.seconds).padStart(2, '0')}</div>
            <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Secs</div>
          </div>
        </div>
        
        <p className="mt-6 text-sm text-purple-300">
          Sunday 11:00 PM - Get ready to spin the wheel! 🎡
        </p>
      </div>
    </div>
  );
}
