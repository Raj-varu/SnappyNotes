import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Edit3, 
  FileText, 
  Check, 
  Sparkles, 
  ExternalLink,
  ClipboardCopy
} from 'lucide-react';

export default function SnippetPreviewModal({ 
  snippet, 
  onClose, 
  onCopyEntire, 
  onEdit 
}) {
  const [copiedPart, setCopiedPart] = useState(false);

  const handleCopySelection = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString();
    if (selectedText) {
      navigator.clipboard.writeText(selectedText);
      setCopiedPart(true);
      setTimeout(() => setCopiedPart(false), 2000);
    } else {
      alert('Please highlight/select the text in the preview box first with your mouse to copy partial text.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm animate-fade-in select-text">
      <div className="bg-white dark:bg-surface-900 border border-slate-200 dark:border-surface-700/80 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-surface-800 bg-slate-50/80 dark:bg-surface-950/50 flex-shrink-0">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-500/20 flex-shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                  {snippet.title}
                </h3>
                {snippet.command && (
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 flex-shrink-0">
                    {snippet.command}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Select any portion of text to copy partially, or use full copy below
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <button
              onClick={() => onEdit(snippet)}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-800 rounded-lg transition-colors text-xs flex items-center space-x-1"
              title="Edit this snippet"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="text-xs">Edit</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body - Fully Selectable Rich Content */}
        <div className="p-5 space-y-3 overflow-y-auto flex-1 select-text">
          {snippet.description && (
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-surface-950/60 border border-slate-200/70 dark:border-surface-800/60 text-xs text-slate-600 dark:text-slate-400">
              <strong className="text-slate-800 dark:text-slate-200">Context:</strong> {snippet.description}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Formatted Snippet Content</span>
            <button
              type="button"
              onClick={handleCopySelection}
              className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-1"
              title="Highlight any text in the box and click here"
            >
              <ClipboardCopy className="w-3.5 h-3.5" />
              <span>{copiedPart ? 'Copied Highlighted Text!' : 'Copy Highlighted Selection'}</span>
            </button>
          </div>

          {/* Interactive Zendesk Preview Box */}
          <div 
            className="zendesk-preview p-4 bg-slate-50 dark:bg-surface-950/80 rounded-xl border border-slate-200 dark:border-surface-800 text-sm text-slate-800 dark:text-slate-200 select-text cursor-text leading-relaxed focus:outline-none"
            dangerouslySetInnerHTML={{ __html: snippet.html }}
          />
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-200 dark:border-surface-800 bg-slate-50/80 dark:bg-surface-950/60 flex-shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Category: <strong className="text-slate-700 dark:text-slate-300">{snippet.category || 'General'}</strong>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-surface-800 rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onCopyEntire(snippet);
                onClose();
              }}
              className="flex items-center space-x-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-600/25 transition-all active:scale-95"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Full Snippet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
