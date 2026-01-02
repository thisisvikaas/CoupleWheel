import { useState, useEffect } from 'react';
import { getTimeUntilNextSunday } from '@/utils/dateUtils';

export default function useCountdown() {
  const [timeRemaining, setTimeRemaining] = useState(getTimeUntilNextSunday());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getTimeUntilNextSunday());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return timeRemaining;
}

