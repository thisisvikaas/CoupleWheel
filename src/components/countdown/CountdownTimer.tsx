import useCountdown from '@/hooks/useCountdown';

interface CountdownTimerProps {
  variant?: 'full' | 'compact';
}

export default function CountdownTimer({ variant = 'full' }: CountdownTimerProps) {
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

  // Compact inline variant for navbar/header
  if (variant === 'compact') {
    const days = timeRemaining.days;
    const hrs = String(timeRemaining.hours).padStart(2, '0');
    const mins = String(timeRemaining.minutes).padStart(2, '0');
    const secs = String(timeRemaining.seconds).padStart(2, '0');

    return (
      <div className="bg-slate-800/80 rounded-xl px-4 py-3 border border-yellow-500/30 inline-flex items-center gap-3">
        <span className="text-purple-400 text-sm">⏰ Time to next task:</span>
        <span className="text-yellow-400 font-bold tracking-wide">
          {days > 0 && <>{days}d : </>}
          {hrs} hrs : {mins} min : {secs} sec
        </span>
      </div>
    );
  }

  // Full card variant
  return (
    <div className="card-neon">
      <div className="text-center">
        <h3 className="text-xl font-bold text-purple-400 mb-4">⏰ Time to next task</h3>
        
        {/* Inline countdown display */}
        <div className="bg-slate-900/60 rounded-xl p-4 border border-yellow-500/40 mb-4">
          <div className="text-2xl md:text-3xl font-bold text-yellow-400 glow-gold tracking-wider">
            {timeRemaining.days > 0 && (
              <span>{String(timeRemaining.days).padStart(2, '0')} days : </span>
            )}
            <span>{String(timeRemaining.hours).padStart(2, '0')} hrs</span>
            <span className="text-purple-400 mx-1">:</span>
            <span>{String(timeRemaining.minutes).padStart(2, '0')} min</span>
            <span className="text-purple-400 mx-1">:</span>
            <span>{String(timeRemaining.seconds).padStart(2, '0')} sec</span>
          </div>
        </div>

        {/* Individual boxes for visual appeal */}
        <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
          <div className="bg-slate-800/80 rounded-lg p-3 border border-purple-500/30">
            <div className="text-2xl font-bold text-yellow-400">{String(timeRemaining.days).padStart(2, '0')}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Days</div>
          </div>
          <div className="bg-slate-800/80 rounded-lg p-3 border border-purple-500/30">
            <div className="text-2xl font-bold text-yellow-400">{String(timeRemaining.hours).padStart(2, '0')}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Hours</div>
          </div>
          <div className="bg-slate-800/80 rounded-lg p-3 border border-purple-500/30">
            <div className="text-2xl font-bold text-yellow-400">{String(timeRemaining.minutes).padStart(2, '0')}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Mins</div>
          </div>
          <div className="bg-slate-800/80 rounded-lg p-3 border border-purple-500/30">
            <div className="text-2xl font-bold text-yellow-400">{String(timeRemaining.seconds).padStart(2, '0')}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Secs</div>
          </div>
        </div>
        
        <p className="mt-4 text-sm text-purple-300">
          Sunday 11:00 PM - Get ready to spin the wheel! 🎡
        </p>
      </div>
    </div>
  );
}
