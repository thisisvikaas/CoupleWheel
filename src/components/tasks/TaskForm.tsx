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

  const suggestedCategories = ['Date Night', 'Adventure', 'Creative', 'Home', 'Surprise', 'Romantic'];

  return (
    <form onSubmit={handleSubmit} className="card-neon">
      <h3 className="text-lg font-bold text-yellow-400 mb-4">🎲 New Challenge</h3>

      {error && (
        <div className="bg-red-900/50 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl mb-4 text-sm">
          ❌ {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="text" className="block text-sm font-bold text-purple-300 mb-2">
            Challenge Description <span className="text-red-400">*</span>
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="input-field resize-none"
            rows={3}
            required
            disabled={loading}
            placeholder="E.g., Plan a surprise picnic date 🧺"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-bold text-purple-300 mb-2">
            Category (Optional)
          </label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
            disabled={loading}
            placeholder="E.g., Date Night"
          />
          <div className="flex flex-wrap gap-1 mt-2">
            {suggestedCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className="px-2 py-1 text-xs bg-slate-700 text-gray-300 rounded-lg hover:bg-purple-600 hover:text-white transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? '🎲 Adding...' : '➕ Add Challenge'}
        </button>
      </div>
    </form>
  );
}
