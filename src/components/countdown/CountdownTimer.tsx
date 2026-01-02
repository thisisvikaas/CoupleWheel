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
      <div className="bg-slate-800/80 rounded-xl px-3 md:px-4 py-2 md:py-3 border border-yellow-500/30 inline-flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
        <span className="text-purple-400 text-xs sm:text-sm">⏰ Next task:</span>
        <span className="text-yellow-400 font-bold tracking-wide text-sm sm:text-base">
          {days > 0 && <>{days}d : </>}
          {hrs}h : {mins}m : {secs}s
        </span>
      </div>
    );
  }

  // Full card variant
  return (
    <div className="card-neon">
      <div className="text-center">
        <h3 className="text-base md:text-xl font-bold text-purple-400 mb-3 md:mb-4">⏰ Time to next task</h3>
        
        {/* Inline countdown display */}
        <div className="bg-slate-900/60 rounded-xl p-3 md:p-4 border border-yellow-500/40 mb-3 md:mb-4">
          <div className="text-lg sm:text-xl md:text-3xl font-bold text-yellow-400 glow-gold tracking-wide md:tracking-wider">
            {timeRemaining.days > 0 && (
              <span>{String(timeRemaining.days).padStart(2, '0')}d : </span>
            )}
            <span>{String(timeRemaining.hours).padStart(2, '0')}h</span>
            <span className="text-purple-400 mx-0.5 md:mx-1">:</span>
            <span>{String(timeRemaining.minutes).padStart(2, '0')}m</span>
            <span className="text-purple-400 mx-0.5 md:mx-1">:</span>
            <span>{String(timeRemaining.seconds).padStart(2, '0')}s</span>
          </div>
        </div>

        {/* Individual boxes for visual appeal */}
        <div className="grid grid-cols-4 gap-2 md:gap-3 max-w-md mx-auto">
          <div className="bg-slate-800/80 rounded-lg p-2 md:p-3 border border-purple-500/30">
            <div className="text-xl md:text-2xl font-bold text-yellow-400">{String(timeRemaining.days).padStart(2, '0')}</div>
            <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider">Days</div>
          </div>
          <div className="bg-slate-800/80 rounded-lg p-2 md:p-3 border border-purple-500/30">
            <div className="text-xl md:text-2xl font-bold text-yellow-400">{String(timeRemaining.hours).padStart(2, '0')}</div>
            <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider">Hours</div>
          </div>
          <div className="bg-slate-800/80 rounded-lg p-2 md:p-3 border border-purple-500/30">
            <div className="text-xl md:text-2xl font-bold text-yellow-400">{String(timeRemaining.minutes).padStart(2, '0')}</div>
            <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider">Mins</div>
          </div>
          <div className="bg-slate-800/80 rounded-lg p-2 md:p-3 border border-purple-500/30">
            <div className="text-xl md:text-2xl font-bold text-yellow-400">{String(timeRemaining.seconds).padStart(2, '0')}</div>
            <div className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider">Secs</div>
          </div>
        </div>
        
        <p className="mt-3 md:mt-4 text-xs md:text-sm text-purple-300">
          Sunday 11:00 PM - Get ready to spin! 🎡
        </p>
      </div>
    </div>
  );
}
