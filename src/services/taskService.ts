import { supabase } from '@/supabaseClient';
import { Task } from '@/types';
import { selectRandomTasks as selectRandomTasksUtil } from '@/utils/randomSelection';

export const taskService = {
  /**
   * Create a new task
   */
  async createTask(
    userId: string,
    text: string,
    category?: string
  ): Promise<{ task: Task | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: userId,
          text,
          category: category || null,
          status: 'available',
        })
        .select()
        .single();

      if (error) throw error;

      return { task: data, error: null };
    } catch (error) {
      return { task: null, error: error as Error };
    }
  },

  /**
   * Get all tasks for a user
   */
  async getUserTasks(
    userId: string
  ): Promise<{ tasks: Task[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { tasks: data || [], error: null };
    } catch (error) {
      return { tasks: [], error: error as Error };
    }
  },

  /**
   * Get available tasks (not completed)
   */
  async getAvailableTasks(
    userId: string
  ): Promise<{ tasks: Task[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { tasks: data || [], error: null };
    } catch (error) {
      return { tasks: [], error: error as Error };
    }
  },

  /**
   * Update a task
   */
  async updateTask(
    taskId: string,
    updates: Partial<Task>
  ): Promise<{ task: Task | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;

      return { task: data, error: null };
    } catch (error) {
      return { task: null, error: error as Error };
    }
  },

  /**
   * Delete a task
   */
  async deleteTask(taskId: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  /**
   * Select random tasks from a pool
   */
  selectRandomTasks(tasks: Task[], count: number = 6): Task[] {
    return selectRandomTasksUtil(tasks, count);
  },

  /**
   * Get tasks by IDs
   */
  async getTasksByIds(
    taskIds: string[]
  ): Promise<{ tasks: Task[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .in('id', taskIds);

      if (error) throw error;

      return { tasks: data || [], error: null };
    } catch (error) {
      return { tasks: [], error: error as Error };
    }
  },
};

