import React, { useRef, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  X, 
  Sparkles
} from 'lucide-react';

export default function BottomSearchBar({ 
  searchQuery, 
  onSearchChange, 
  onCreateNew,
  isCompact
}) {
  const searchInputRef = useRef(null);

  // Global keydown: pressing '/' or 'Ctrl+F' focuses the bottom search bar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === '/' && 
        document.activeElement.tagName !== 'INPUT' && 
        document.activeElement.tagName !== 'TEXTAREA' && 
        !document.activeElement.isContentEditable
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
      if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        if (searchQuery) {
          onSearchChange('');
        } else {
          searchInputRef.current?.blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery, onSearchChange]);

  return (
    <div className="fixed bottom-3.5 inset-x-0 flex justify-center items-center z-40 px-4 pointer-events-none">
      <div className="w-full max-w-xl md:max-w-2xl pointer-events-auto flex items-center gap-2">
        {/* Floating Capsule Search Bar */}
        <div className="relative flex-1 bg-white/95 dark:bg-surface-900/95 backdrop-blur-md border border-slate-300 dark:border-surface-700 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-2xl dark:shadow-black/50 transition-all focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Search className="w-4 h-4" />
          </div>

          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              isCompact 
                ? "Search or type /command..." 
                : "Type /command or search (e.g. /pcdns, denial, refund)..."
            }
            className="w-full pl-10 pr-14 py-3 bg-transparent text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none font-sans"
          />

          {/* Right clear button or keyboard hint */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-1">
            {searchQuery ? (
              <button
                onClick={() => {
                  onSearchChange('');
                  searchInputRef.current?.focus();
                }}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-surface-800 transition-colors"
                title="Clear search (Esc)"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-surface-800 border border-slate-200 dark:border-surface-700 rounded-md">
                /
              </kbd>
            )}
          </div>
        </div>

        {/* Quick New Snippet Button on Floating Bar */}
        <button
          onClick={onCreateNew}
          className="p-3 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl shadow-xl shadow-brand-600/30 active:scale-95 transition-all flex items-center justify-center flex-shrink-0"
          title="Create New Snippet (Ctrl+N)"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
