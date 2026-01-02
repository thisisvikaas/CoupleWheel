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
    if (!confirm('Are you sure you want to delete this task?')) return;

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
      <div className="card">
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
          <div className="flex space-x-2">
            <button
              onClick={handleUpdate}
              className="btn-primary flex-1"
              disabled={loading || !editText.trim()}
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-gray-800 mb-2">{task.text}</p>
          <div className="flex items-center space-x-2">
            <CategoryTag category={task.category} />
            <span
              className={`text-xs px-2 py-1 rounded ${
                task.status === 'available'
                  ? 'bg-green-100 text-green-700'
                  : task.status === 'completed'
                  ? 'bg-gray-100 text-gray-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {task.status}
            </span>
          </div>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-700 text-sm"
            disabled={loading}
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 text-sm"
            disabled={loading}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

