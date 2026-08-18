import React, { useState, useEffect, useRef } from 'react';
import { X, Copy, Sparkles } from 'lucide-react';
import { applyVariablesToHtml } from '../utils/zendeskClipboard';

export default function VariablePromptModal({ snippet, variables, onCopy, onClose }) {
  const [values, setValues] = useState({});
  const firstInputRef = useRef(null);

  useEffect(() => {
    const initial = {};
    variables.forEach(v => {
      if (v.toLowerCase().includes('agent')) {
        initial[v] = localStorage.getItem('snappy_default_agent_name') || '';
      } else if (v.toLowerCase().includes('date')) {
        initial[v] = new Date().toLocaleDateString();
      } else {
        initial[v] = '';
      }
    });
    setValues(initial);

    setTimeout(() => {
      if (firstInputRef.current) {
        firstInputRef.current.focus();
      }
    }, 50);
  }, [variables]);

  const handleChange = (varName, val) => {
    setValues(prev => ({ ...prev, [varName]: val }));
  };

  const handleCopyFilled = (e) => {
    if (e) e.preventDefault();
    onCopy(values);
  };

  const handleCopyRaw = () => {
    onCopy({});
  };

  const previewHtml = applyVariablesToHtml(snippet.html, values);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm animate-fade-in select-text">
      <div className="bg-white dark:bg-surface-900 border border-slate-200 dark:border-surface-700/80 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-surface-800 bg-slate-50/80 dark:bg-surface-950/40">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Fill Variables</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {snippet.title} <span className="text-brand-600 dark:text-brand-400 font-mono">({snippet.command})</span>
              </p>
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
        <div className="p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleCopyFilled} className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              {variables.map((varName, idx) => (
                <div key={varName} className="space-y-1">
                  <label className="block text-xs font-semibold text-indigo-700 dark:text-indigo-300 font-mono uppercase tracking-wide">
                    {`{{ ${varName} }}`}
                  </label>
                  <input
                    ref={idx === 0 ? firstInputRef : null}
                    type="text"
                    value={values[varName] || ''}
                    onChange={(e) => handleChange(varName, e.target.value)}
                    placeholder={`Enter ${varName}...`}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-surface-950/80 border border-slate-200 dark:border-surface-700/80 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-sans shadow-xs"
                  />
                </div>
              ))}
            </div>

            {/* Live Preview Accordion */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-surface-800">
              <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Zendesk Formatted Preview</span>
                <span className="text-brand-600 dark:text-brand-400 lowercase font-normal">bullet points & formatting active</span>
              </div>
              <div 
                className="zendesk-preview max-h-44 overflow-y-auto p-3 bg-slate-50 dark:bg-surface-950/90 rounded-xl border border-slate-200 dark:border-surface-800/80 text-xs text-slate-700 dark:text-slate-300 select-text"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 dark:border-surface-800 bg-slate-50/80 dark:bg-surface-950/60">
          <button
            type="button"
            onClick={handleCopyRaw}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 underline hover:no-underline transition-colors"
          >
            Copy with raw placeholders
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-surface-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCopyFilled}
              className="flex items-center space-x-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-600/25 transition-all active:scale-95"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy to Zendesk</span>
              <span className="ml-1 text-[10px] opacity-80 bg-brand-700/60 px-1 py-0.5 rounded">Enter</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
