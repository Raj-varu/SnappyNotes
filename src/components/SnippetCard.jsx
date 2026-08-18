import React from 'react';
import { 
  Copy, 
  Edit3, 
  Trash2, 
  Pin, 
  Sparkles,
  Eye
} from 'lucide-react';
import { extractPlaceholders } from '../utils/zendeskClipboard';

export default function SnippetCard({ 
  snippet, 
  isSelected, 
  onSelect, 
  onCopy, 
  onEdit, 
  onDelete, 
  onTogglePin,
  onPreview,
  isCompact 
}) {
  const placeholders = extractPlaceholders(snippet.html);
  const hasPlaceholders = placeholders.length > 0;

  const handleCardClick = () => {
    if (onSelect) onSelect(snippet);
  };

  const handleCopyClick = (e) => {
    e.stopPropagation();
    onCopy(snippet);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit(snippet);
  };

  const handlePreviewClick = (e) => {
    e.stopPropagation();
    onPreview(snippet);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${snippet.title}"?`)) {
      onDelete(snippet.id);
    }
  };

  const handlePinClick = (e) => {
    e.stopPropagation();
    onTogglePin(snippet.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative rounded-xl border transition-all duration-150 flex flex-col cursor-pointer ${
        isSelected 
          ? 'bg-white dark:bg-surface-900 border-brand-500 shadow-md shadow-brand-500/10 ring-1 ring-brand-500' 
          : 'bg-white dark:bg-surface-900/70 hover:bg-white dark:hover:bg-surface-900 border-slate-200 dark:border-surface-800/80 hover:border-slate-300 dark:hover:border-surface-700 shadow-xs'
      } ${isCompact ? 'p-3' : 'p-4'}`}
    >
      {/* Top Meta Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center flex-wrap gap-1.5 min-w-0">
          {/* Command Pill */}
          {snippet.command && (
            <span className="inline-flex items-center font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
              {snippet.command}
            </span>
          )}

          {/* Category Pill */}
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-surface-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-surface-700/60">
            {snippet.category || 'General'}
          </span>

          {/* Variables Pill */}
          {hasPlaceholders && (
            <span className="inline-flex items-center space-x-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-500/20">
              <Sparkles className="w-2.5 h-2.5" />
              <span>{placeholders.length} var{placeholders.length > 1 ? 's' : ''}</span>
            </span>
          )}
        </div>

        {/* Pin & Card Actions */}
        <div className="flex items-center space-x-1 flex-shrink-0">
          <button
            type="button"
            onClick={handlePinClick}
            className={`p-1 rounded-md transition-colors ${
              snippet.pinned
                ? 'text-amber-500 bg-amber-50 dark:bg-amber-500/10'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 opacity-0 group-hover:opacity-100'
            }`}
            title={snippet.pinned ? 'Unpin snippet' : 'Pin snippet to top'}
          >
            <Pin className={`w-3.5 h-3.5 ${snippet.pinned ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Snippet Title */}
      <h4 className={`font-semibold text-slate-900 dark:text-slate-100 mb-1 line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors ${
        isCompact ? 'text-xs' : 'text-sm'
      }`}>
        {snippet.title}
      </h4>

      {/* Snippet Description if any */}
      {snippet.description && !isCompact && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 line-clamp-1">
          {snippet.description}
        </p>
      )}

      {/* Snippet Content Preview */}
      <div 
        onClick={handlePreviewClick}
        className={`relative overflow-hidden rounded-lg bg-slate-50 dark:bg-surface-950/70 border border-slate-200/80 dark:border-surface-800/60 p-2.5 text-xs text-slate-700 dark:text-slate-300 zendesk-preview mb-3 cursor-pointer hover:border-brand-400/60 transition-colors ${
          isCompact ? 'max-h-20' : 'max-h-28'
        }`}
        title="Click to open full preview and copy partial text"
      >
        <div 
          dangerouslySetInnerHTML={{ __html: snippet.html }} 
          className="pointer-events-none"
        />
        {/* Subtle bottom fade gradient */}
        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-slate-50 dark:from-surface-950/90 to-transparent pointer-events-none" />
      </div>

      {/* Card Footer Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-surface-800/60 mt-auto">
        <div className="flex items-center space-x-1">
          {/* Preview Button */}
          <button
            type="button"
            onClick={handlePreviewClick}
            className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-md transition-colors text-xs flex items-center space-x-1"
            title="Preview & Copy partial text"
          >
            <Eye className="w-3.5 h-3.5" />
            {!isCompact && <span className="text-[11px] font-medium">Preview</span>}
          </button>

          {/* Edit Button */}
          <button
            type="button"
            onClick={handleEditClick}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-800 rounded-md transition-colors text-xs flex items-center space-x-1"
            title="Edit snippet"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={handleDeleteClick}
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md transition-colors"
            title="Delete snippet"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Main Copy Button */}
        <button
          type="button"
          onClick={handleCopyClick}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-semibold shadow-xs shadow-brand-600/20 active:scale-95 transition-all"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>{hasPlaceholders ? 'Fill & Copy' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
}
