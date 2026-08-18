import React, { useState, useEffect } from 'react';
import { 
  Minus, 
  Square, 
  X, 
  Pin, 
  PinOff, 
  Minimize2, 
  Maximize2, 
  FileJson,
  Sun,
  Moon
} from 'lucide-react';

export default function TitleBar({ 
  isCompact, 
  onToggleCompact, 
  onOpenSettings,
  theme,
  onToggleTheme
}) {
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false);

  useEffect(() => {
    if (window.snappyAPI?.isAlwaysOnTop) {
      window.snappyAPI.isAlwaysOnTop().then(setIsAlwaysOnTop);
    }
  }, []);

  const handleMinimize = () => {
    window.snappyAPI?.minimizeWindow();
  };

  const handleMaximize = () => {
    window.snappyAPI?.maximizeWindow();
  };

  const handleClose = () => {
    window.snappyAPI?.closeWindow();
  };

  const handleTogglePin = async () => {
    if (window.snappyAPI?.setAlwaysOnTop) {
      const newState = await window.snappyAPI.setAlwaysOnTop(!isAlwaysOnTop);
      setIsAlwaysOnTop(newState);
    }
  };

  return (
    <div className="h-10 bg-white dark:bg-surface-900 border-b border-slate-200 dark:border-surface-800/80 flex items-center justify-between px-3 select-none titlebar-drag-region flex-shrink-0 z-50 transition-colors">
      {/* App Logo & Title */}
      <div className="flex items-center space-x-2.5">
        <img 
          src="./icon.png" 
          alt="SnappyNotes Logo" 
          className="w-5 h-5 object-contain rounded-md drop-shadow-sm select-none" 
        />
        <span className="text-xs font-bold tracking-wide text-slate-800 dark:text-slate-200">
          Snappy<span className="text-brand-600 dark:text-brand-400">Notes</span>
        </span>
        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-surface-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-surface-700/50">
          Zendesk Ready
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-1 titlebar-no-drag">
        {/* Theme Toggle Button (Light / Dark mode) */}
        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-surface-800 transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-indigo-600" />
          )}
        </button>

        {/* Always on Top Pin */}
        <button
          onClick={handleTogglePin}
          title={isAlwaysOnTop ? "Unpin window (Always on Top is active)" : "Pin on top (Keep above Zendesk)"}
          className={`p-1.5 rounded-md transition-colors ${
            isAlwaysOnTop 
              ? 'bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30' 
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-800'
          }`}
        >
          {isAlwaysOnTop ? <Pin className="w-3.5 h-3.5 fill-current" /> : <PinOff className="w-3.5 h-3.5" />}
        </button>

        {/* Compact Mode Toggle */}
        <button
          onClick={onToggleCompact}
          title={isCompact ? "Standard View" : "Compact Mini View (Side-by-side with Zendesk)"}
          className={`p-1.5 rounded-md transition-colors ${
            isCompact 
              ? 'bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30' 
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-800'
          }`}
        >
          {isCompact ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
        </button>

        {/* Local Storage Indicator / Settings */}
        <button
          onClick={onOpenSettings}
          title="Local JSON Storage & Settings"
          className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-800 rounded-md transition-colors"
        >
          <FileJson className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-slate-200 dark:bg-surface-700 mx-1" />

        {/* Window Standard Actions */}
        <button
          onClick={handleMinimize}
          className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-800 rounded-md transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        {!isCompact && (
          <button
            onClick={handleMaximize}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-800 rounded-md transition-colors"
          >
            <Square className="w-3 h-3" />
          </button>
        )}

        <button
          onClick={handleClose}
          className="p-1.5 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-md transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
