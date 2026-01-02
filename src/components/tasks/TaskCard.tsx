import { useState } from 'react';
import { Task } from '@/types';
import { taskService } from '@/services/taskService';
import { useTaskStore } from '@/store/taskStore';
import CategoryTag from './CategoryTag';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [editCategory, setEditCategory] = useState(task.category || '');
  const [loading, setLoading] = useState(false);
  const { updateTask, deleteTask } = useTaskStore();

  const handleUpdate = async () => {
    setLoading(true);
    const { task: updatedTask, error } = await taskService.updateTask(task.id, {
      text: editText,
      category: editCategory || undefined,
    });

    if (!error && updatedTask) {
      updateTask(task.id, updatedTask);
      setIsEditing(false);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('🗑️ Delete this challenge?')) return;

    setLoading(true);
    const { error } = await taskService.deleteTask(task.id);

    if (!error) {
      deleteTask(task.id);
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setEditText(task.text);
    setEditCategory(task.category || '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="card-neon">
        <div className="space-y-3">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="input-field resize-none w-full"
            rows={3}
            disabled={loading}
          />
          <input
            type="text"
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
            className="input-field"
            placeholder="Category (optional)"
            disabled={loading}
          />
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="btn-primary flex-1"
              disabled={loading || !editText.trim()}
            >
              💾 Save
            </button>
            <button
              onClick={handleCancel}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card hover:border-yellow-500/50 transition-all group">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-gray-200 mb-3">{task.text}</p>
          <div className="flex items-center gap-2">
            <CategoryTag category={task.category} />
            <span
              className={`text-xs px-2 py-1 rounded-lg font-bold ${
                task.status === 'available'
                  ? 'bg-green-900/50 text-green-400 border border-green-500/30'
                  : task.status === 'completed'
                  ? 'bg-purple-900/50 text-purple-400 border border-purple-500/30'
                  : 'bg-yellow-900/50 text-yellow-400 border border-yellow-500/30'
              }`}
            >
              {task.status === 'available' ? '✅ Ready' : task.status === 'completed' ? '🏆 Done' : '⏳ Active'}
            </span>
          </div>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 text-sm bg-blue-600/30 text-blue-400 rounded-lg hover:bg-blue-600/50 transition-colors"
            disabled={loading}
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1 text-sm bg-red-600/30 text-red-400 rounded-lg hover:bg-red-600/50 transition-colors"
            disabled={loading}
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
