import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useTaskStore } from '@/store/taskStore';
import { taskService } from '@/services/taskService';
import TaskForm from '@/components/tasks/TaskForm';
import TaskList from '@/components/tasks/TaskList';

export default function TaskPool() {
  const { user } = useAuthStore();
  const { tasks, setTasks, loading, setLoading } = useTaskStore();
  const [filter, setFilter] = useState<'all' | 'available' | 'completed'>('all');

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    if (!user) return;

    setLoading(true);
    const { tasks: fetchedTasks, error } = await taskService.getUserTasks(user.id);

    if (!error) {
      setTasks(fetchedTasks);
    }
    setLoading(false);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const availableCount = tasks.filter((t) => t.status === 'available').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Pool</h1>
        <p className="text-gray-600">
          Create tasks for your partner to complete. They'll randomly spin one each week!
        </p>
        {availableCount < 20 && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
            <p className="text-sm">
              💡 <strong>Tip:</strong> Create at least 20 tasks to ensure variety. You currently have{' '}
              <strong>{availableCount}</strong> available tasks.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <TaskForm />

          <div className="card mt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Statistics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Tasks:</span>
                <span className="font-medium">{tasks.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Available:</span>
                <span className="font-medium text-green-600">{availableCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completed:</span>
                <span className="font-medium text-gray-600">{completedCount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="mb-4 flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All ({tasks.length})
            </button>
            <button
              onClick={() => setFilter('available')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'available'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Available ({availableCount})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'completed'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>

          <TaskList
            tasks={filteredTasks}
            emptyMessage={
              filter === 'all'
                ? 'No tasks yet. Add your first task above!'
                : `No ${filter} tasks.`
            }
          />
        </div>
      </div>
    </div>
  );
}

