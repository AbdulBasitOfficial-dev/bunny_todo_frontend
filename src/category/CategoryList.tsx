import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { categoryApi } from "../api/categoryApi";
import { authApi } from "../api/authApi";
import ConfirmDialog from "../components/ConfirmDialog";
import type {
  Category,
  CategoryCreateRequest,
  CategoryUpdateRequest,
} from "../api/types";

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    categoryId: string | null;
    categoryName: string;
  }>({
    isOpen: false,
    categoryId: null,
    categoryName: "",
  });
  const [editForm, setEditForm] = useState<CategoryUpdateRequest>({
    name: "",
    discription: "",
  });
  const navigate = useNavigate();
  const [form, setForm] = useState<CategoryCreateRequest>({
    name: "",
    discription: "",
  });

  const handleLogout = () => {
    authApi.logout();
    navigate("/login");
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await categoryApi.getMyCategories();
      // Ensure data is always an array
      setCategories(Array.isArray(data) ? data : []);
    } catch (e: unknown) {
      const error = e as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Failed to load categories");
      setCategories([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const created = await categoryApi.create(form);
      // Ensure prev is always an array before spreading
      setCategories((prev) => {
        const prevArray = Array.isArray(prev) ? prev : [];
        return [created, ...prevArray];
      });
      setForm({ name: "", discription: "" });
    } catch (e: unknown) {
      const error = e as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category._id);
    setEditForm({
      name: category.name,
      discription: category.discription || "",
    });
  };

  const handleUpdate = async (id: string) => {
    try {
      setLoading(true);
      setError("");
      const updated = await categoryApi.update(id, editForm);
      setCategories((prev) =>
        prev.map((cat) => (cat._id === id ? updated : cat))
      );
      setEditingId(null);
      setEditForm({ name: "", discription: "" });
    } catch (e: unknown) {
      const error = e as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (category: Category) => {
    setDeleteDialog({
      isOpen: true,
      categoryId: category._id,
      categoryName: category.name,
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({
      isOpen: false,
      categoryId: null,
      categoryName: "",
    });
  };

  const handleDelete = async () => {
    if (!deleteDialog.categoryId) return;

    try {
      setLoading(true);
      setError("");
      await categoryApi.remove(deleteDialog.categoryId);
      setCategories((prev) =>
        prev.filter((cat) => cat._id !== deleteDialog.categoryId)
      );
      closeDeleteDialog();
    } catch (e: unknown) {
      const error = e as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Failed to delete category");
      closeDeleteDialog();
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", discription: "" });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-6 space-y-6">
      {/* Header with Logout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-white">Your Categories</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 self-start sm:self-auto"
        >
          Logout
        </button>
      </div>

      {/* Create Category Form */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <form
          onSubmit={handleCreate}
          className="flex flex-col sm:flex-row gap-2 w-full"
        >
          <input
            type="text"
            placeholder="New category name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="flex-1 p-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder-gray-400"
            required
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={form.discription || ""}
            onChange={(e) => setForm({ ...form, discription: e.target.value })}
            className="flex-1 p-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
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

      {loading && !categories.length && (
        <p className="text-gray-400 text-sm">Loading categories...</p>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.length > 0 &&
          categories?.map((cat) => (
            <div
              key={cat._id}
              className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 hover:border-gray-600 transition-all duration-200"
            >
              {editingId === cat._id ? (
                // Edit Mode
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Category name"
                  />
                  <input
                    type="text"
                    value={editForm.discription || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, discription: e.target.value })
                    }
                    className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Description"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(cat._id)}
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
                  <h2 className="text-xl font-semibold text-white mb-2">
                    {cat.name}
                  </h2>
                  <p className="text-gray-400 mb-4">
                    {cat.discription || "No description"}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      to={`/tasks/${cat._id}`}
                      className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
                    >
                      View Tasks →
                    </Link>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(cat)}
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
                        onClick={() => openDeleteDialog(cat)}
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
                </>
              )}
            </div>
          ))}
        {categories.length === 0 && !loading && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400 text-lg">
              No categories yet. Create one above!
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteDialog.categoryName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={closeDeleteDialog}
        variant="danger"
      />
    </div>
  );
};

export default CategoryList;
