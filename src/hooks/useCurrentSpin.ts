import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { spinService } from '@/services/spinService';
import { taskService } from '@/services/taskService';
import { vetoService } from '@/services/vetoService';
import { CurrentWeekView } from '@/types';

export default function useCurrentSpin() {
  const { user, partner } = useAuthStore();
  const [currentWeek, setCurrentWeek] = useState<CurrentWeekView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCurrentSpin = async () => {
    if (!user || !partner) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get current week's spin
      const { spin, error: spinError } = await spinService.getCurrentWeekSpin(user.id);

      if (spinError) throw spinError;

      if (!spin) {
        setCurrentWeek(null);
        setLoading(false);
        return;
      }

      // Determine which task is for which user
      const isUserA = spin.user_a_id === user.id;
      const myTaskId = isUserA ? spin.user_a_task_id : spin.user_b_task_id;
      const partnerTaskId = isUserA ? spin.user_b_task_id : spin.user_a_task_id;

      // Fetch tasks
      const { tasks, error: tasksError } = await taskService.getTasksByIds([
        myTaskId,
        partnerTaskId,
      ]);

      if (tasksError) throw tasksError;

      const myTask = tasks.find((t) => t.id === myTaskId);
      const partnerTask = tasks.find((t) => t.id === partnerTaskId);

      if (!myTask || !partnerTask) {
        throw new Error('Tasks not found');
      }

      // Check veto availability
      const { available: vetoAvailable } = await vetoService.checkVetoAvailability(
        user.id
      );

      // Calculate days remaining
      const weekStart = new Date(spin.week_start_date);
      const nextSunday = new Date(weekStart);
      nextSunday.setDate(nextSunday.getDate() + 7);
      const now = new Date();
      const daysRemaining = Math.ceil(
        (nextSunday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      setCurrentWeek({
        myTask,
        partnerTask,
        weekStartDate: weekStart,
        daysRemaining: Math.max(0, daysRemaining),
        vetoAvailable,
        myTaskAssignedTo: partner.name,
        partnerTaskAssignedTo: user.name,
        spinId: spin.id,
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentSpin();
  }, [user, partner]);

  return { currentWeek, loading, error, reload: loadCurrentSpin };
}

