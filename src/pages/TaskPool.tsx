import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useTaskStore } from '@/store/taskStore';
import { taskService } from '@/services/taskService';
import TaskForm from '@/components/tasks/TaskForm';
import TaskList from '@/components/tasks/TaskList';

export default function TaskPool() {
  const { user, partner } = useAuthStore();
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
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-yellow-500/30 rounded-full"></div>
          <div className="w-20 h-20 border-4 border-t-yellow-400 rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="mt-6 text-yellow-400 font-bold text-lg animate-pulse">Loading Tasks...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-black mb-2">
          <span className="neon-text">📝 TASK POOL 📝</span>
        </h1>
        <p className="text-purple-300">
          Create challenges for <span className="text-pink-400 font-bold">{partner?.name || 'your partner'}</span>
        </p>
        
        {availableCount < 20 && (
          <div className="mt-4 card-gold inline-block px-6 py-3">
            <p className="text-sm">
              💡 <span className="text-yellow-400 font-bold">{availableCount}/20</span> tasks ready
              <span className="text-gray-400 ml-2">- Add {20 - availableCount} more for variety!</span>
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <TaskForm />

          <div className="card">
            <h3 className="text-lg font-bold text-yellow-400 mb-4">📊 Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Tasks</span>
                <span className="slot-number text-2xl">{tasks.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Available</span>
                <span className="text-green-400 font-bold text-xl">{availableCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Completed</span>
                <span className="text-purple-400 font-bold text-xl">{completedCount}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress to 20</span>
                <span>{Math.min(100, (availableCount / 20) * 100).toFixed(0)}%</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, (availableCount / 20) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              🎯 All ({tasks.length})
            </button>
            <button
              onClick={() => setFilter('available')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                filter === 'available'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-black'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              ✅ Available ({availableCount})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                filter === 'completed'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              🏆 Completed ({completedCount})
            </button>
          </div>

          <TaskList
            tasks={filteredTasks}
            emptyMessage={
              filter === 'all'
                ? 'No tasks yet. Create your first challenge! 🎲'
                : `No ${filter} tasks.`
            }
          />
        </div>
      </div>
    </div>
  );
}
