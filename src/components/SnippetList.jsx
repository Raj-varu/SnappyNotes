import React from 'react';
import SnippetCard from './SnippetCard';
import { Pin, SearchX, Plus, Sparkles, Settings2, FolderPlus } from 'lucide-react';

export default function SnippetList({
  snippets,
  allCategories,
  selectedCategory,
  onSelectCategory,
  onlyPinned,
  onToggleOnlyPinned,
  selectedIndex,
  onSelectSnippet,
  onCopySnippet,
  onEditSnippet,
  onDeleteSnippet,
  onTogglePinSnippet,
  onPreviewSnippet,
  onOpenCategoryManager,
  onCreateNew,
  searchQuery,
  isCompact
}) {
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-slate-50/50 dark:bg-surface-950/30">
      {/* Category Pills & Filters Bar */}
      <div className="px-4 py-2.5 bg-white/80 dark:bg-surface-950/70 border-b border-slate-200/90 dark:border-surface-800/80 flex items-center justify-between gap-2 overflow-x-auto select-none flex-shrink-0 backdrop-blur-sm transition-colors">
        <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5 no-scrollbar">
          {/* Pinned filter toggle */}
          <button
            onClick={onToggleOnlyPinned}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
              onlyPinned
                ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 shadow-xs'
                : 'bg-white dark:bg-surface-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-surface-800'
            }`}
            title="Filter to only pinned snippets"
          >
            <Pin className={`w-3 h-3 ${onlyPinned ? 'fill-current text-amber-600 dark:text-amber-400' : ''}`} />
            <span>Pinned</span>
          </button>

          <div className="w-[1px] h-4 bg-slate-200 dark:bg-surface-800 flex-shrink-0 mx-0.5" />

          {/* "All" Category Pill */}
          <button
            onClick={() => onSelectCategory('All')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 ${
              selectedCategory === 'All'
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/25'
                : 'bg-white dark:bg-surface-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-800/80 border border-slate-200 dark:border-surface-800'
            }`}
          >
            All
          </button>

          {/* User Categories */}
          {allCategories.filter(c => c !== 'All').map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/25'
                  : 'bg-white dark:bg-surface-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-800/80 border border-slate-200 dark:border-surface-800'
              }`}
            >
              {cat}
            </button>
          ))}

          {/* Manage / Add Categories Button */}
          <button
            onClick={onOpenCategoryManager}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-500/10 border border-dashed border-brand-300 dark:border-brand-500/40 transition-colors flex-shrink-0"
            title="Add or Remove Categories"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Manage Categories</span>
          </button>
        </div>

        {/* Snippet count */}
        <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex-shrink-0 hidden sm:block">
          {snippets.length} snippet{snippets.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Snippet Grid / Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 pb-24 min-h-0">
        {snippets.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 dark:text-slate-400 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-surface-900 border border-slate-200 dark:border-surface-800 flex items-center justify-center text-slate-400 dark:text-slate-400 mb-3.5 shadow-sm">
              {searchQuery ? <SearchX className="w-7 h-7 text-slate-400" /> : <Sparkles className="w-7 h-7 text-brand-500" />}
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
              {searchQuery ? 'No snippets found' : 'No snippets yet'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4 leading-relaxed">
              {searchQuery
                ? `No matches found for "${searchQuery}". Try a different keyword, check for typos, or reset your filters.`
                : 'Create your first Zendesk note snippet. You can assign commands like /pcdns, /denial, or /refund for instant access.'}
            </p>
            <button
              onClick={onCreateNew}
              className="flex items-center space-x-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-600/25 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create First Snippet</span>
            </button>
          </div>
        ) : (
          <div className={`grid gap-3.5 ${
            isCompact 
              ? 'grid-cols-1' 
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {snippets.map((snippet, idx) => (
              <SnippetCard
                key={snippet.id}
                snippet={snippet}
                isSelected={idx === selectedIndex}
                onSelect={() => onSelectSnippet(idx)}
                onCopy={onCopySnippet}
                onEdit={onEditSnippet}
                onDelete={onDeleteSnippet}
                onTogglePin={onTogglePinSnippet}
                onPreview={onPreviewSnippet}
                isCompact={isCompact}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
