import useCountdown from '@/hooks/useCountdown';

export default function CountdownTimer() {
  const timeRemaining = useCountdown();

  if (timeRemaining.total <= 0) {
    return null;
  }

  return (
    <div className="card bg-gradient-to-r from-purple-500 to-pink-500 text-white">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">Next Spin In</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{timeRemaining.days}</span>
            <span className="text-sm opacity-90">Days</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{timeRemaining.hours}</span>
            <span className="text-sm opacity-90">Hours</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{timeRemaining.minutes}</span>
            <span className="text-sm opacity-90">Minutes</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{timeRemaining.seconds}</span>
            <span className="text-sm opacity-90">Seconds</span>
          </div>
        </div>
        <p className="mt-4 text-sm opacity-90">
          Until Sunday at 11:00 PM - Get ready to spin the wheel! 🎡
        </p>
      </div>
    </div>
  );
}

