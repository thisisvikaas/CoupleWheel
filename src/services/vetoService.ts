import { supabase } from '@/supabaseClient';
import { getCurrentMonth } from '@/utils/dateUtils';

export const vetoService = {
  /**
   * Check if user has veto available for current month
   */
  async checkVetoAvailability(
    userId: string
  ): Promise<{ available: boolean; error: Error | null }> {
    try {
      const currentMonth = getCurrentMonth();

      const { data, error } = await supabase
        .from('veto_usage')
        .select('id')
        .eq('user_id', userId)
        .eq('month', currentMonth);

      if (error) throw error;

      // Available if no veto used this month
      return { available: data.length === 0, error: null };
    } catch (error) {
      return { available: false, error: error as Error };
    }
  },

  /**
   * Use a veto (swap tasks)
   */
  async useVeto(
    userId: string,
    weekSpinId: string
  ): Promise<{ success: boolean; error: Error | null }> {
    try {
      const currentMonth = getCurrentMonth();

      // Check availability first
      const { available } = await this.checkVetoAvailability(userId);
      if (!available) {
        throw new Error('You have already used your veto this month');
      }

      // Get the current spin
      const { data: spin, error: spinError } = await supabase
        .from('weekly_spins')
        .select('*')
        .eq('id', weekSpinId)
        .single();

      if (spinError) throw spinError;

      const isUserA = spin.user_a_id === userId;

      // Swap the task assignments
      const { error: swapError } = await supabase
        .from('weekly_spins')
        .update({
          user_a_task_id: spin.user_b_task_id,
          user_b_task_id: spin.user_a_task_id,
          [isUserA ? 'user_a_vetoed' : 'user_b_vetoed']: true,
        })
        .eq('id', weekSpinId);

      if (swapError) throw swapError;

      // Record veto usage
      const { error: vetoError } = await supabase.from('veto_usage').insert({
        user_id: userId,
        week_spin_id: weekSpinId,
        month: currentMonth,
        used_date: new Date().toISOString().split('T')[0],
      });

      if (vetoError) throw vetoError;

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  },

  /**
   * Get count of vetos used this month
   */
  async getVetosUsedThisMonth(
    userId: string
  ): Promise<{ count: number; error: Error | null }> {
    try {
      const currentMonth = getCurrentMonth();

      const { data, error } = await supabase
        .from('veto_usage')
        .select('id')
        .eq('user_id', userId)
        .eq('month', currentMonth);

      if (error) throw error;

      return { count: data.length, error: null };
    } catch (error) {
      return { count: 0, error: error as Error };
    }
  },
};

