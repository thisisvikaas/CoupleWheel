import { useState } from 'react';
import { taskService } from '@/services/taskService';
import { useAuthStore } from '@/store/authStore';
import { useTaskStore } from '@/store/taskStore';

export default function TaskForm() {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const { addTask } = useTaskStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError('');
    setLoading(true);

    const { task, error: createError } = await taskService.createTask(
      user.id,
      text,
      category || undefined
    );

    if (createError) {
      setError(createError.message);
      setLoading(false);
      return;
    }

    if (task) {
      addTask(task);
      setText('');
      setCategory('');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3 className="text-lg font-semibold mb-4">Add New Task</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
            Task Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="input-field resize-none"
            rows={3}
            required
            disabled={loading}
            placeholder="E.g., Cook a special dinner together"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category (Optional)
          </label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
            disabled={loading}
            placeholder="E.g., Date Night, Adventure, Creative"
          />
          <p className="text-xs text-gray-500 mt-1">
            Categories help distribute tasks evenly when spinning
          </p>
        </div>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </div>
    </form>
  );
}

