import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskApi } from '../api/taskApi';
import ConfirmDialog from '../components/ConfirmDialog';
import type { Task, TaskCreateRequest, TaskUpdateRequest } from '../api/types';

const TaskList = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    taskId: string | null;
    taskTitle: string;
  }>({
    isOpen: false,
    taskId: null,
    taskTitle: '',
  });
  const [editForm, setEditForm] = useState<TaskUpdateRequest>({
    title: '',
    description: '',
    priority: 'low',
  });
  const [form, setForm] = useState<TaskCreateRequest>({
    title: '',
    description: '',
    priority: 'low',
  });

  const fetchTasks = async () => {
    if (!categoryId) return;
    try {
      setLoading(true);
      setError('');
      const data = await taskApi.getByCategory(categoryId);
      setTasks(data);
    } catch (e: unknown) {
      const error = e as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) return;
    try {
      setLoading(true);
      setError('');
      const created = await taskApi.create(categoryId, form);
      setTasks((prev) => [created, ...prev]);
      setForm({ title: '', description: '', priority: 'low' });
    } catch (e: unknown) {
      const error = e as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingId(task._id);
    setEditForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      isCompleted: task.isCompleted,
    });
  };

  const handleUpdate = async (id: string) => {
    try {
      setLoading(true);
      setError('');
      const updated = await taskApi.update(id, editForm);
      setTasks((prev) => prev.map((task) => (task._id === id ? updated : task)));
      setEditingId(null);
      setEditForm({ title: '', description: '', priority: 'low' });
    } catch (e: unknown) {
      const error = e as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (task: Task) => {
    setDeleteDialog({
      isOpen: true,
      taskId: task._id,
      taskTitle: task.title,
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({
      isOpen: false,
      taskId: null,
      taskTitle: '',
    });
  };

  const handleDelete = async () => {
    if (!deleteDialog.taskId) return;

    try {
      setLoading(true);
      setError('');
      await taskApi.remove(deleteDialog.taskId);
      setTasks((prev) =>
        prev.filter((task) => task._id !== deleteDialog.taskId)
      );
      closeDeleteDialog();
    } catch (e: unknown) {
      const error = e as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to delete task');
      closeDeleteDialog();
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      setLoading(true);
      setError('');
      const updated = await taskApi.update(task._id, {
        isCompleted: !task.isCompleted,
      });
      setTasks((prev) => prev.map((t) => (t._id === task._id ? updated : t)));
    } catch (e: unknown) {
      const error = e as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: '', description: '', priority: 'low' });
  };

  useEffect(() => {
    fetchTasks();
  }, [categoryId]);

  return (
    <div className="min-h-screen bg-gray-900 p-6 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/categories')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Categories
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-white">Tasks</h1>
      </div>

      {/* Create Task Form */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <form
          onSubmit={handleCreate}
          className="flex flex-col md:flex-row gap-2 w-full"
        >
          <input
            type="text"
            placeholder="Task title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="flex-1 p-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder-gray-400"
            required
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={form.description || ''}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="flex-1 p-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder-gray-400"
          />
          <select
            value={form.priority || 'low'}
            onChange={(e) =>
              setForm({
                ...form,
                priority: e.target.value as TaskCreateRequest['priority'],
              })
            }
            className="p-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {loading && !tasks.length && (
        <p className="text-gray-400 text-sm">Loading tasks...</p>
      )}

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((task) => (
          <div
            key={task._id}
            className={`bg-gray-800 p-4 rounded-lg shadow-lg border transition-all duration-200 ${
              task.isCompleted
                ? 'border-green-700/50 opacity-75'
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            {editingId === task._id ? (
              // Edit Mode
              <div className="space-y-3">
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Task title"
                />
                <input
                  type="text"
                  value={editForm.description || ''}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Description"
                />
                <select
                  value={editForm.priority || 'low'}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      priority: e.target.value as TaskUpdateRequest['priority'],
                    })
                  }
                  className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.isCompleted || false}
                      onChange={(e) =>
                        setEditForm({ ...editForm, isCompleted: e.target.checked })
                      }
                      className="w-4 h-4 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    Completed
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(task._id)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors duration-200 text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors duration-200 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <>
                <div className="flex items-start justify-between mb-2">
                  <h2
                    className={`text-xl font-semibold ${
                      task.isCompleted ? 'text-gray-500 line-through' : 'text-white'
                    }`}
                  >
                    {task.title}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleComplete(task)}
                      className={`${
                        task.isCompleted
                          ? 'text-green-400 hover:text-green-300'
                          : 'text-gray-400 hover:text-green-400'
                      } transition-colors duration-200`}
                      title={task.isCompleted ? 'Mark as pending' : 'Mark as complete'}
                    >
                      {task.isCompleted ? (
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(task)}
                      className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
                      title="Edit"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => openDeleteDialog(task)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-200"
                      title="Delete"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-gray-400 mb-3">{task.description || 'No description'}</p>
                <div className="flex items-center justify-between">
                  <p
                    className={`font-medium ${
                      task.priority === 'high'
                        ? 'text-red-400'
                        : task.priority === 'medium'
                        ? 'text-yellow-400'
                        : 'text-green-400'
                    }`}
                  >
                    {task.priority.toUpperCase()}
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      task.isCompleted ? 'text-green-400' : 'text-yellow-400'
                    }`}
                  >
                    {task.isCompleted ? 'Completed ✅' : 'Pending ⏳'}
                  </p>
                </div>
              </>
            )}
          </div>
        ))}
        {tasks.length === 0 && !loading && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400 text-lg">No tasks yet. Create one above!</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteDialog.taskTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={closeDeleteDialog}
        variant="danger"
      />
    </div>
  );
};

export default TaskList;
