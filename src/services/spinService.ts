import { supabase } from '@/supabaseClient';
import { WeeklySpin, Task } from '@/types';
import { taskService } from './taskService';
import { formatDateAsString, getCurrentWeekStart } from '@/utils/dateUtils';

export const spinService = {
  /**
   * Create a new weekly spin record
   */
  async createWeeklySpin(
    userAId: string,
    userBId: string,
    taskAId: string,
    taskBId: string
  ): Promise<{ spin: WeeklySpin | null; error: Error | null }> {
    try {
      const weekStart = getCurrentWeekStart();

      const { data, error } = await supabase
        .from('weekly_spins')
        .insert({
          week_start_date: formatDateAsString(weekStart),
          user_a_id: userAId,
          user_b_id: userBId,
          user_a_task_id: taskAId,
          user_b_task_id: taskBId,
          user_a_completed: null,
          user_b_completed: null,
          user_a_verified_by_partner: null,
          user_b_verified_by_partner: null,
          user_a_vetoed: false,
          user_b_vetoed: false,
        })
        .select()
        .single();

      if (error) throw error;

      return { spin: data, error: null };
    } catch (error) {
      return { spin: null, error: error as Error };
    }
  },

  /**
   * Get current week's spin
   */
  async getCurrentWeekSpin(
    userId: string
  ): Promise<{ spin: WeeklySpin | null; error: Error | null }> {
    try {
      const weekStart = getCurrentWeekStart();
      const weekStartStr = formatDateAsString(weekStart);

      const { data, error } = await supabase
        .from('weekly_spins')
        .select('*')
        .eq('week_start_date', weekStartStr)
        .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No spin found
          return { spin: null, error: null };
        }
        throw error;
      }

      return { spin: data, error: null };
    } catch (error) {
      return { spin: null, error: error as Error };
    }
  },

  /**
   * Select random tasks for spinning
   */
  async selectRandomTasksForSpin(
    partnerId: string
  ): Promise<{ tasks: Task[]; error: Error | null }> {
    try {
      const { tasks, error } = await taskService.getAvailableTasks(partnerId);

      if (error) throw error;

      if (tasks.length < 6) {
        throw new Error(
          `Your partner needs at least 6 available tasks. They currently have ${tasks.length}.`
        );
      }

      const selectedTasks = taskService.selectRandomTasks(tasks, 6);

      return { tasks: selectedTasks, error: null };
    } catch (error) {
      return { tasks: [], error: error as Error };
    }
  },

  /**
   * Check if both users have spun
   */
  async getSpinStatus(
    spinId: string
  ): Promise<{
    bothSpun: boolean;
    userASpun: boolean;
    userBSpun: boolean;
    error: Error | null;
  }> {
    try {
      const { data, error } = await supabase
        .from('weekly_spins')
        .select('user_a_task_id, user_b_task_id')
        .eq('id', spinId)
        .single();

      if (error) throw error;

      const userASpun = !!data.user_a_task_id;
      const userBSpun = !!data.user_b_task_id;

      return {
        bothSpun: userASpun && userBSpun,
        userASpun,
        userBSpun,
        error: null,
      };
    } catch (error) {
      return { bothSpun: false, userASpun: false, userBSpun: false, error: error as Error };
    }
  },

  /**
   * Update spin with selected task
   */
  async updateSpinWithTask(
    spinId: string,
    _userId: string,
    taskId: string,
    isUserA: boolean
  ): Promise<{ spin: WeeklySpin | null; error: Error | null }> {
    try {
      const updateField = isUserA ? 'user_a_task_id' : 'user_b_task_id';

      const { data, error } = await supabase
        .from('weekly_spins')
        .update({ [updateField]: taskId })
        .eq('id', spinId)
        .select()
        .single();

      if (error) throw error;

      return { spin: data, error: null };
    } catch (error) {
      return { spin: null, error: error as Error };
    }
  },

  /**
   * Get previous week's spin for verification
   */
  async getPreviousWeekSpin(
    userId: string
  ): Promise<{ spin: WeeklySpin | null; error: Error | null }> {
    try {
      const weekStart = getCurrentWeekStart();
      const previousWeek = new Date(weekStart);
      previousWeek.setDate(previousWeek.getDate() - 7);
      const previousWeekStr = formatDateAsString(previousWeek);

      const { data, error } = await supabase
        .from('weekly_spins')
        .select('*')
        .eq('week_start_date', previousWeekStr)
        .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return { spin: null, error: null };
        }
        throw error;
      }

      return { spin: data, error: null };
    } catch (error) {
      return { spin: null, error: error as Error };
    }
  },
};

