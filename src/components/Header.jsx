import React, { useRef, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  X, 
  UserCheck
} from 'lucide-react';

export default function Header({ 
  searchQuery, 
  onSearchChange, 
  onCreateNew, 
  agentName,
  onUpdateAgentName,
  isCompact
}) {
  const searchInputRef = useRef(null);

  // Global keydown to focus search when pressing '/' or 'Ctrl+F'
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA' && !document.activeElement.isContentEditable) {
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
    <div className="px-4 py-3 bg-slate-50 dark:bg-surface-900 border-b border-slate-200 dark:border-surface-800/80 flex items-center justify-between gap-3 select-none flex-shrink-0 transition-colors">
      {/* Left Action / Agent Profile (Balances Centered Search) */}
      <div className="flex items-center space-x-2 flex-shrink-0 min-w-[100px] hidden sm:flex">
        {!isCompact && (
          <button
            onClick={() => {
              const name = prompt('Set default Agent Name (auto-fills {{Agent Name}} in snippets):', agentName || '');
              if (name !== null) {
                onUpdateAgentName(name.trim());
              }
            }}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-white dark:bg-surface-800 hover:bg-slate-100 dark:hover:bg-surface-700 text-slate-700 dark:text-slate-300 text-xs border border-slate-200 dark:border-surface-700 shadow-sm transition-all"
            title="Set your Agent Name for auto-fill in snippets"
          >
            <UserCheck className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span className="text-[11px] font-medium truncate max-w-[90px]">
              {agentName ? agentName : 'Agent Name'}
            </span>
          </button>
        )}
      </div>

      {/* Centered Search Bar (ChatGPT / Gemini style) */}
      <div className="flex-1 flex justify-center items-center px-1">
        <div className="relative w-full max-w-lg md:max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            {searchQuery.startsWith('/') ? (
              <span className="font-mono font-bold text-brand-600 dark:text-indigo-400 text-sm">/</span>
            ) : (
              <Search className="w-4 h-4" />
            )}
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              isCompact 
                ? "Search or type /command..." 
                : "Search snippets, typo-tolerant keywords, or /command..."
            }
            className="w-full pl-9 pr-14 py-2.5 bg-white dark:bg-surface-950/80 border border-slate-200 dark:border-surface-700/80 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all font-sans"
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
      </div>

      {/* Right Action: Create New Snippet */}
      <div className="flex items-center space-x-2 flex-shrink-0 min-w-[100px] justify-end">
        <button
          onClick={onCreateNew}
          className="flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm hover:shadow shadow-brand-600/20 active:scale-95 transition-all flex-shrink-0"
          title="Create a new snippet (Ctrl+N)"
        >
          <Plus className="w-4 h-4" />
          <span className={isCompact ? 'hidden' : 'inline'}>New Snippet</span>
        </button>
      </div>
    </div>
  );
}
