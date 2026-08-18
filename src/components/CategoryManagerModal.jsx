import React, { useState } from 'react';
import { X, Plus, Trash2, Folder, Sparkles, Check } from 'lucide-react';

export default function CategoryManagerModal({
  categories,
  onAddCategory,
  onDeleteCategory,
  onClose
}) {
  const [newCatName, setNewCatName] = useState('');
  const [error, setError] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    const clean = newCatName.trim();
    if (!clean) return;

    if (clean.toLowerCase() === 'all') {
      setError('"All" is a reserved category name');
      return;
    }

    if (categories.some(c => c.toLowerCase() === clean.toLowerCase())) {
      setError('Category already exists');
      return;
    }

    onAddCategory(clean);
    setNewCatName('');
    setError('');
  };

  const handleDelete = (catName) => {
    if (catName.toLowerCase() === 'general') {
      if (categories.length === 1) {
        alert('"General" is the default fallback category.');
        return;
      }
    }
    if (window.confirm(`Delete category "${catName}"? Snippets in this category will be moved to "General".`)) {
      onDeleteCategory(catName);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm animate-fade-in select-text">
      <div className="bg-white dark:bg-surface-900 border border-slate-200 dark:border-surface-700/80 rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden animate-slide-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-surface-800 bg-slate-50/80 dark:bg-surface-950/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-500/20">
              <Folder className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Manage Categories</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Add or remove snippet categories</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Add New Category Form */}
          <form onSubmit={handleAdd} className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Add New Category
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => {
                  setNewCatName(e.target.value);
                  setError('');
                }}
                placeholder="e.g. DNS, Billing, Escalations..."
                className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-surface-950/80 border border-slate-200 dark:border-surface-700/80 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 shadow-xs"
              />
              <button
                type="submit"
                className="flex items-center space-x-1 px-3.5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-xs shadow-brand-600/20 active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
            {error && <p className="text-xs text-rose-500">{error}</p>}
          </form>

          {/* Categories List */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-surface-800">
            <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Your Categories ({categories.length})
            </h4>

            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {categories.map((cat) => (
                <div
                  key={cat}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-surface-950/60 border border-slate-200 dark:border-surface-800/80 hover:border-slate-300 dark:hover:border-surface-700 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Folder className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{cat}</span>
                    {cat.toLowerCase() === 'general' && (
                      <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-200 dark:bg-surface-800 text-slate-600 dark:text-slate-400">
                        Default
                      </span>
                    )}
                  </div>

                  {cat.toLowerCase() !== 'general' && (
                    <button
                      type="button"
                      onClick={() => handleDelete(cat)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                      title={`Remove category "${cat}"`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end px-5 py-3 border-t border-slate-200 dark:border-surface-800 bg-slate-50/80 dark:bg-surface-950/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white rounded-xl shadow-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
