import React, { useState, useEffect } from 'react';
import { 
  X, 
  FolderOpen, 
  Download, 
  Upload, 
  HardDrive, 
  ShieldCheck, 
  Keyboard
} from 'lucide-react';

export default function SettingsModal({ 
  onClose, 
  agentName, 
  onUpdateAgentName, 
  onImportComplete,
  onShowToast
}) {
  const [storageInfo, setStorageInfo] = useState({
    filePath: 'Loading...',
    dirPath: '',
    fileSize: 0,
    snippetCount: 0
  });

  const [inputAgentName, setInputAgentName] = useState(agentName || '');

  useEffect(() => {
    if (window.snappyAPI?.getStorageInfo) {
      window.snappyAPI.getStorageInfo().then(setStorageInfo);
    }
  }, []);

  const handleOpenFolder = async () => {
    if (window.snappyAPI?.openStorageFolder) {
      await window.snappyAPI.openStorageFolder();
    }
  };

  const handleExportBackup = async () => {
    if (window.snappyAPI?.exportBackup) {
      const res = await window.snappyAPI.exportBackup();
      if (res?.success) {
        onShowToast('Backup JSON exported successfully!', 'success');
      }
    }
  };

  const handleImportBackup = async () => {
    if (window.snappyAPI?.importBackup) {
      const res = await window.snappyAPI.importBackup();
      if (res?.success && Array.isArray(res.snippets)) {
        onImportComplete(res.snippets);
        onShowToast(`Successfully imported ${res.snippets.length} snippets!`, 'success');
        onClose();
      }
    }
  };

  const handleSaveAgentName = (e) => {
    e.preventDefault();
    onUpdateAgentName(inputAgentName.trim());
    onShowToast('Default agent name updated!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm animate-fade-in select-text">
      <div className="bg-white dark:bg-surface-900 border border-slate-200 dark:border-surface-700/80 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-surface-800 bg-slate-50/80 dark:bg-surface-950/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-500/20">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Storage & Settings</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Local JSON database & Agent configuration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Privacy & Local Storage Callout */}
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300">100% Offline & Local Storage</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                All snippets are stored strictly in your system's <strong>Documents</strong> folder as a single JSON file. Zero data is transmitted to external servers or cloud services.
              </p>
            </div>
          </div>

          {/* Storage Details Section */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Local JSON Location</h4>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-surface-950/80 border border-slate-200 dark:border-surface-800 space-y-2">
              <div className="font-mono text-xs text-slate-800 dark:text-slate-300 break-all bg-white dark:bg-surface-900/90 p-2.5 rounded-lg border border-slate-200 dark:border-surface-700/50 select-all shadow-xs">
                {storageInfo.filePath}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                <span>Total Snippets: <strong className="text-slate-800 dark:text-slate-200">{storageInfo.snippetCount}</strong></span>
                <button
                  onClick={handleOpenFolder}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white dark:bg-surface-800 hover:bg-slate-100 dark:hover:bg-surface-700 text-brand-700 dark:text-brand-300 border border-slate-200 dark:border-surface-700 text-xs font-semibold shadow-xs transition-colors"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Open in File Explorer</span>
                </button>
              </div>
            </div>
          </div>

          {/* Agent Defaults */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Default Agent Name</h4>
            <form onSubmit={handleSaveAgentName} className="flex items-center space-x-2">
              <input
                type="text"
                value={inputAgentName}
                onChange={(e) => setInputAgentName(e.target.value)}
                placeholder="e.g. John Doe"
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-surface-950/80 border border-slate-200 dark:border-surface-700/80 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 shadow-xs"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-200 dark:bg-surface-800 hover:bg-slate-300 dark:hover:bg-surface-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors"
              >
                Save
              </button>
            </form>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Auto-fills the <code className="text-indigo-600 dark:text-indigo-300 font-mono">{"{{Agent Name}}"}</code> variable whenever you copy a snippet.
            </p>
          </div>

          {/* Backup & Restore */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Backup & Migration</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExportBackup}
                className="flex items-center justify-center space-x-2 p-2.5 rounded-xl bg-slate-50 dark:bg-surface-800/80 hover:bg-slate-100 dark:hover:bg-surface-800 border border-slate-200 dark:border-surface-700 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span>Export Backup JSON</span>
              </button>
              <button
                onClick={handleImportBackup}
                className="flex items-center justify-center space-x-2 p-2.5 rounded-xl bg-slate-50 dark:bg-surface-800/80 hover:bg-slate-100 dark:hover:bg-surface-800 border border-slate-200 dark:border-surface-700 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span>Import Backup JSON</span>
              </button>
            </div>
          </div>

          {/* Keyboard Shortcuts Cheat Sheet */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-surface-800">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Keyboard className="w-3.5 h-3.5 text-slate-400" />
              <span>Keyboard Shortcuts</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-surface-950/60 border border-slate-200/80 dark:border-surface-800/60">
                <span className="text-slate-600 dark:text-slate-400">Focus Search / Slash</span>
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 text-brand-600 dark:text-brand-300 rounded font-mono text-[10px] shadow-2xs">/</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-surface-950/60 border border-slate-200/80 dark:border-surface-800/60">
                <span className="text-slate-600 dark:text-slate-400">Summon App Globally</span>
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 text-brand-600 dark:text-brand-300 rounded font-mono text-[10px] shadow-2xs">Ctrl+Shift+S</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-surface-950/60 border border-slate-200/80 dark:border-surface-800/60">
                <span className="text-slate-600 dark:text-slate-400">Create New Snippet</span>
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 text-brand-600 dark:text-brand-300 rounded font-mono text-[10px] shadow-2xs">Ctrl+N</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-surface-950/60 border border-slate-200/80 dark:border-surface-800/60">
                <span className="text-slate-600 dark:text-slate-400">Copy Selected Snippet</span>
                <kbd className="px-1.5 py-0.5 bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 text-brand-600 dark:text-brand-300 rounded font-mono text-[10px] shadow-2xs">Enter</kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end px-5 py-3.5 border-t border-slate-200 dark:border-surface-800 bg-slate-50/80 dark:bg-surface-950/60">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white rounded-xl shadow-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
