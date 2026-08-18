import React, { useState, useEffect } from 'react';
import { X, Save, Pin, Sparkles, Plus } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import { htmlToZendeskPlainText } from '../utils/zendeskClipboard';

export default function SnippetEditorModal({ 
  snippet, 
  onSave, 
  onClose, 
  existingCategories = [],
  onAddNewCategory
}) {
  const [title, setTitle] = useState('');
  const [command, setCommand] = useState('');
  const [category, setCategory] = useState('General');
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCat, setShowCustomCat] = useState(false);
  const [description, setDescription] = useState('');
  const [html, setHtml] = useState('');
  const [tags, setTags] = useState('');
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    if (snippet) {
      setTitle(snippet.title || '');
      setCommand(snippet.command || '');
      setCategory(snippet.category || 'General');
      setDescription(snippet.description || '');
      setHtml(snippet.html || '');
      setTags(Array.isArray(snippet.tags) ? snippet.tags.join(', ') : '');
      setPinned(!!snippet.pinned);
    } else {
      setTitle('');
      setCommand('');
      setCategory('General');
      setDescription('');
      setHtml('<p></p>');
      setTags('');
      setPinned(false);
    }
  }, [snippet]);

  const handleCommandInput = (val) => {
    const clean = val.replace(/\s+/g, '-').toLowerCase();
    setCommand(clean);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a snippet title');
      return;
    }

    let finalCommand = command.trim();
    if (finalCommand && !finalCommand.startsWith('/')) {
      finalCommand = '/' + finalCommand;
    }

    let finalCategory = category;
    if (showCustomCat && customCategory.trim()) {
      finalCategory = customCategory.trim();
      if (onAddNewCategory) {
        onAddNewCategory(finalCategory);
      }
    }

    const finalTags = tags
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    const plainText = htmlToZendeskPlainText(html);

    const updatedSnippet = {
      id: snippet?.id || `snip-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: title.trim(),
      command: finalCommand,
      category: finalCategory,
      description: description.trim(),
      html: html,
      plainText: plainText,
      tags: finalTags,
      pinned: pinned,
      createdAt: snippet?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(updatedSnippet);
  };

  const selectableCategories = existingCategories.filter(c => c !== 'All');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm animate-fade-in select-text">
      <div className="bg-white dark:bg-surface-900 border border-slate-200 dark:border-surface-700/80 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-slide-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-surface-800 bg-slate-50/80 dark:bg-surface-950/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {snippet ? 'Edit Snippet' : 'Create New Snippet'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Formatted for Zendesk rich notes & email responses
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setPinned(!pinned)}
              className={`p-1.5 rounded-lg border transition-colors ${
                pinned 
                  ? 'bg-amber-50 dark:bg-amber-500/20 border-amber-300 dark:border-amber-500/40 text-amber-600 dark:text-amber-300' 
                  : 'bg-white dark:bg-surface-800/80 border-slate-200 dark:border-surface-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title={pinned ? "Pinned to top" : "Pin to top"}
            >
              <Pin className={`w-4 h-4 ${pinned ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-5 space-y-4 overflow-y-auto flex-1">
            {/* Title & Slash Command */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Snippet Heading / Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. DNS PC or Denial Notice"
                  className="w-full px-3.5 py-2 bg-white dark:bg-surface-950/80 border border-slate-200 dark:border-surface-700/80 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-indigo-600 dark:text-indigo-300 flex items-center justify-between">
                  <span>Slash Command</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">e.g. /pcdns</span>
                </label>
                <input
                  type="text"
                  value={command}
                  onChange={(e) => handleCommandInput(e.target.value)}
                  placeholder="/pcdns or /denial"
                  className="w-full px-3.5 py-2 bg-white dark:bg-surface-950/80 border border-slate-200 dark:border-surface-700/80 rounded-xl text-sm font-mono text-indigo-600 dark:text-indigo-300 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-xs"
                />
              </div>
            </div>

            {/* Category & Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Category</span>
                  <button
                    type="button"
                    onClick={() => setShowCustomCat(!showCustomCat)}
                    className="text-[10px] text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-0.5"
                  >
                    <Plus className="w-2.5 h-2.5" />
                    <span>{showCustomCat ? 'Select Existing' : 'New Category'}</span>
                  </button>
                </label>

                {showCustomCat ? (
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Enter custom category name..."
                    className="w-full px-3.5 py-2 bg-white dark:bg-surface-950/80 border border-slate-200 dark:border-surface-700/80 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 shadow-xs"
                  />
                ) : (
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white dark:bg-surface-950/80 border border-slate-200 dark:border-surface-700/80 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 shadow-xs"
                  >
                    {selectableCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Search Tags</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">comma separated</span>
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="dns, network, connection, ticket"
                  className="w-full px-3.5 py-2 bg-white dark:bg-surface-950/80 border border-slate-200 dark:border-surface-700/80 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 shadow-xs"
                />
              </div>
            </div>

            {/* Description / Note */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Summary / Agent Context <span className="text-slate-500 dark:text-slate-400 font-normal text-[11px]">(optional quick hint)</span>
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="When to use this snippet..."
                className="w-full px-3.5 py-2 bg-white dark:bg-surface-950/80 border border-slate-200 dark:border-surface-700/80 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 shadow-xs"
              />
            </div>

            {/* Rich Text Editor */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Snippet Content (Zendesk Rich Text & Bullet Points)
                </label>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Use <code className="text-indigo-600 dark:text-indigo-300 font-mono">{"{{Variable}}"}</code> for placeholders
                </span>
              </div>
              
              <RichTextEditor
                content={html}
                onChange={setHtml}
                placeholder="Type your note here. Click the bullet icon or type '-' at the start of a line for bullet points..."
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-200 dark:border-surface-800 bg-slate-50/80 dark:bg-surface-950/60 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-surface-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-600/25 transition-all active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Snippet</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
