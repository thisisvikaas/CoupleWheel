import { create } from 'zustand';
import { TaskState } from '@/types';

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  loading: false,
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
    })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),
  setLoading: (loading) => set({ loading }),
}));

