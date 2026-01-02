/**
 * Date utility functions for the Couples Challenge Wheel app
 */

/**
 * Get the date of the next Sunday at 11 PM
 */
export function getNextSundayAt11PM(): Date {
  const now = new Date();
  const nextSunday = new Date(now);
  
  // Calculate days until next Sunday (0 = Sunday)
  const daysUntilSunday = (7 - now.getDay()) % 7;
  
  if (daysUntilSunday === 0 && (now.getHours() < 23 || (now.getHours() === 23 && now.getMinutes() === 0))) {
    // It's Sunday before 11 PM, return today at 11 PM
    nextSunday.setHours(23, 0, 0, 0);
  } else if (daysUntilSunday === 0) {
    // It's Sunday after 11 PM, return next Sunday
    nextSunday.setDate(now.getDate() + 7);
    nextSunday.setHours(23, 0, 0, 0);
  } else {
    // It's not Sunday, calculate next Sunday
    nextSunday.setDate(now.getDate() + daysUntilSunday);
    nextSunday.setHours(23, 0, 0, 0);
  }
  
  return nextSunday;
}

/**
 * Check if today is Sunday
 */
export function isItSunday(): boolean {
  const now = new Date();
  return now.getDay() === 0;
}

/**
 * Get the start date of the current week (last Sunday at 00:00:00)
 */
export function getCurrentWeekStart(): Date {
  const now = new Date();
  const daysSinceSunday = now.getDay();
  const weekStart = new Date(now);
  
  if (daysSinceSunday === 0) {
    // It's Sunday, check if we're past 11 PM
    if (now.getHours() >= 23) {
      // New week has started
      weekStart.setHours(0, 0, 0, 0);
    } else {
      // Still previous week
      weekStart.setDate(now.getDate() - 7);
      weekStart.setHours(0, 0, 0, 0);
    }
  } else {
    // Go back to last Sunday
    weekStart.setDate(now.getDate() - daysSinceSunday);
    weekStart.setHours(0, 0, 0, 0);
  }
  
  return weekStart;
}

/**
 * Check if it's Sunday after 11 PM (spinner should be enabled)
 */
export function isSundayAfter11PM(): boolean {
  const now = new Date();
  return now.getDay() === 0 && now.getHours() >= 23;
}

/**
 * Calculate time remaining until next Sunday at 11 PM
 */
export function getTimeUntilNextSunday(): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
} {
  const now = new Date();
  const nextSunday = getNextSundayAt11PM();
  const diff = nextSunday.getTime() - now.getTime();
  
  return {
    total: diff,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

/**
 * Format a date as YYYY-MM-DD
 */
export function formatDateAsString(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get the current month in format "YYYY-MM"
 */
export function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

