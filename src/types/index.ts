// Database Types
export interface User {
  id: string;
  name: string;
  email: string;
  partner_id: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  text: string;
  category?: string;
  status: 'available' | 'completed' | 'in_progress';
  created_at: string;
  completed_at?: string;
}

export interface WeeklySpin {
  id: string;
  week_start_date: string;
  user_a_id: string;
  user_b_id: string;
  user_a_task_id: string;
  user_b_task_id: string;
  user_a_completed: boolean | null;
  user_b_completed: boolean | null;
  user_a_verified_by_partner: boolean | null;
  user_b_verified_by_partner: boolean | null;
  user_a_vetoed: boolean;
  user_b_vetoed: boolean;
  created_at: string;
}

export interface VetoUsage {
  id: string;
  user_id: string;
  used_date: string;
  week_spin_id: string;
  month: string;
}

// UI Types
export interface CurrentWeekView {
  myTask: Task;
  partnerTask: Task;
  weekStartDate: Date;
  daysRemaining: number;
  vetoAvailable: boolean;
  myTaskAssignedTo: string;
  partnerTaskAssignedTo: string;
  spinId: string;
}

export enum SundayState {
  VERIFICATION_PENDING = 'verification_pending',
  VERIFICATION_COMPLETE = 'verification_complete',
  READY_TO_SPIN = 'ready_to_spin',
  SPIN_COMPLETE = 'spin_complete',
}

export interface AuthState {
  user: User | null;
  partner: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setPartner: (partner: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

