import { Task } from '@/types';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  emptyMessage?: string;
}

export default function TaskList({ tasks, emptyMessage = 'No tasks yet' }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 card">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

