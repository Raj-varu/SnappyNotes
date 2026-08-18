import React from 'react';
import { Plus, UserCheck, Sparkles, FolderOpen } from 'lucide-react';

export default function TopNav({ 
  onCreateNew, 
  agentName, 
  onUpdateAgentName, 
  snippetCount,
  onOpenSettings,
  isCompact 
}) {
  return (
    <div className="px-4 py-2.5 bg-white dark:bg-surface-900 border-b border-slate-200 dark:border-surface-800/80 flex items-center justify-between gap-3 select-none flex-shrink-0 transition-colors">
      <div className="flex items-center space-x-2">
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
          <span>Support Snippets</span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30">
            {snippetCount} saved
          </span>
        </span>
      </div>

      <div className="flex items-center space-x-2">
        {/* Agent Profile */}
        {!isCompact && (
          <button
            onClick={() => {
              const name = prompt('Set default Agent Name (auto-fills {{Agent Name}} in snippets):', agentName || '');
              if (name !== null) {
                onUpdateAgentName(name.trim());
              }
            }}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-surface-800 hover:bg-slate-200 dark:hover:bg-surface-700 text-slate-700 dark:text-slate-300 text-xs border border-slate-200 dark:border-surface-700 transition-all"
            title="Set your default Agent Name for auto-replacing {{Agent Name}}"
          >
            <UserCheck className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span className="text-[11px] font-medium truncate max-w-[110px]">
              {agentName ? agentName : 'Set Agent Name'}
            </span>
          </button>
        )}

        {/* New Snippet Button */}
        <button
          onClick={onCreateNew}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-xs shadow-brand-600/20 active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Snippet</span>
        </button>
      </div>
    </div>
  );
}
