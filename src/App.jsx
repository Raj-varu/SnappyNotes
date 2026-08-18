import React, { useState, useEffect, useMemo, useCallback } from 'react';
import TitleBar from './components/TitleBar';
import TopNav from './components/TopNav';
import BottomSearchBar from './components/BottomSearchBar';
import SnippetList from './components/SnippetList';
import SnippetEditorModal from './components/SnippetEditorModal';
import SnippetPreviewModal from './components/SnippetPreviewModal';
import VariablePromptModal from './components/VariablePromptModal';
import CategoryManagerModal from './components/CategoryManagerModal';
import SettingsModal from './components/SettingsModal';
import Toast from './components/Toast';
import { filterAndSearchSnippets } from './utils/searchEngine';
import { extractPlaceholders, formatSnippetPayload } from './utils/zendeskClipboard';

export default function App() {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [onlyPinned, setOnlyPinned] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // User-defined categories: Default to ['General'] only
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('snappy_user_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return ['General'];
  });

  // Theme: 'light' by default, switchable to 'dark'
  const [theme, setTheme] = useState(() => localStorage.getItem('snappy_theme') || 'light');

  // Modals & Popups
  const [editingSnippet, setEditingSnippet] = useState(null);
  const [previewingSnippet, setPreviewingSnippet] = useState(null);
  const [promptingSnippet, setPromptingSnippet] = useState(null);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState(null);

  // App Settings
  const [isCompact, setIsCompact] = useState(false);
  const [agentName, setAgentName] = useState(() => localStorage.getItem('snappy_default_agent_name') || '');

  // Apply theme class to HTML root element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('snappy_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  // Save categories to localStorage
  const saveCategories = (newCategories) => {
    setCategories(newCategories);
    localStorage.setItem('snappy_user_categories', JSON.stringify(newCategories));
  };

  const handleAddCategory = (newCat) => {
    if (!categories.includes(newCat)) {
      const updated = [...categories, newCat];
      saveCategories(updated);
      showToast(`Added category "${newCat}"`, 'success');
    }
  };

  const handleDeleteCategory = async (catToDelete) => {
    const updatedCategories = categories.filter(c => c !== catToDelete);
    if (updatedCategories.length === 0) {
      updatedCategories.push('General');
    }
    saveCategories(updatedCategories);

    // Reassign snippets with the deleted category to 'General'
    let reassignCount = 0;
    const updatedSnippets = snippets.map(s => {
      if (s.category === catToDelete) {
        reassignCount++;
        return { ...s, category: 'General', updatedAt: new Date().toISOString() };
      }
      return s;
    });

    if (reassignCount > 0) {
      await saveAllSnippets(updatedSnippets);
    }

    if (selectedCategory === catToDelete) {
      setSelectedCategory('All');
    }

    showToast(`Removed category "${catToDelete}"`, 'info');
  };

  // Load snippets on startup
  useEffect(() => {
    async function init() {
      try {
        if (window.snappyAPI?.loadSnippets) {
          const loaded = await window.snappyAPI.loadSnippets();
          setSnippets(Array.isArray(loaded) ? loaded : []);

          // Sync any existing snippet categories into categories list if missing
          if (Array.isArray(loaded)) {
            const snippetCats = loaded.map(s => s.category).filter(Boolean);
            if (snippetCats.length > 0) {
              setCategories(prev => {
                const combined = Array.from(new Set([...prev, ...snippetCats]));
                localStorage.setItem('snappy_user_categories', JSON.stringify(combined));
                return combined;
              });
            }
          }
        }
      } catch (err) {
        console.error('Failed to load snippets:', err);
        showToast('Failed to load snippets from local storage', 'error');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [showToast]);

  // Global hotkey summon listener
  useEffect(() => {
    if (window.snappyAPI?.onGlobalQuickSearch) {
      const unsub = window.snappyAPI.onGlobalQuickSearch(() => {
        setSearchQuery('');
      });
      return unsub;
    }
  }, []);

  // Persist snippets to local JSON in Documents
  const saveAllSnippets = async (newSnippets) => {
    setSnippets(newSnippets);
    if (window.snappyAPI?.saveSnippets) {
      const result = await window.snappyAPI.saveSnippets(newSnippets);
      if (!result.success) {
        showToast(`Error saving locally: ${result.error}`, 'error');
      }
    }
  };

  const handleUpdateAgentName = (name) => {
    setAgentName(name);
    localStorage.setItem('snappy_default_agent_name', name);
  };

  // Filtered & Fuzzy Searched Snippets list
  const filteredSnippets = useMemo(() => {
    return filterAndSearchSnippets(snippets, searchQuery, selectedCategory, onlyPinned);
  }, [snippets, searchQuery, selectedCategory, onlyPinned]);

  const allCategories = useMemo(() => {
    const list = Array.from(new Set(['All', ...categories]));
    return list;
  }, [categories]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery, selectedCategory, onlyPinned]);

  // Clipboard Copy Execution
  const executeCopy = async (snippet, variableValues = {}) => {
    const finalValues = { ...variableValues };
    if (agentName && !finalValues['Agent Name']) {
      finalValues['Agent Name'] = agentName;
    }

    const payload = formatSnippetPayload(snippet.html, finalValues);

    try {
      if (window.snappyAPI?.copyRichText) {
        await window.snappyAPI.copyRichText(payload);
      } else {
        navigator.clipboard.writeText(payload.text);
      }
      showToast(`Copied "${snippet.title}" with Zendesk rich formatting!`, 'success');
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      showToast('Failed to copy snippet', 'error');
    }
  };

  const handleInitiateCopy = (snippet) => {
    const placeholders = extractPlaceholders(snippet.html);
    if (placeholders.length > 0) {
      setPromptingSnippet({ snippet, placeholders });
    } else {
      executeCopy(snippet);
    }
  };

  const handleSaveSnippet = async (savedSnippet) => {
    // Ensure snippet's category is recorded
    if (savedSnippet.category && !categories.includes(savedSnippet.category)) {
      handleAddCategory(savedSnippet.category);
    }

    let updated;
    const exists = snippets.some(s => s.id === savedSnippet.id);
    if (exists) {
      updated = snippets.map(s => s.id === savedSnippet.id ? savedSnippet : s);
      showToast(`Updated snippet "${savedSnippet.title}"`, 'success');
    } else {
      updated = [savedSnippet, ...snippets];
      showToast(`Created new snippet "${savedSnippet.title}"`, 'success');
    }
    await saveAllSnippets(updated);
    setEditingSnippet(null);
  };

  const handleDeleteSnippet = async (id) => {
    const target = snippets.find(s => s.id === id);
    const updated = snippets.filter(s => s.id !== id);
    await saveAllSnippets(updated);
    showToast(`Deleted snippet "${target?.title || 'item'}"`, 'info');
  };

  const handleTogglePin = async (id) => {
    const updated = snippets.map(s => {
      if (s.id === id) {
        return { ...s, pinned: !s.pinned, updatedAt: new Date().toISOString() };
      }
      return s;
    });
    await saveAllSnippets(updated);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (editingSnippet || promptingSnippet || previewingSnippet || showSettings || showCategoryManager) return;
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.isContentEditable) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          // Allow list navigation
        } else if (e.key === 'Enter') {
          if (filteredSnippets.length > 0 && filteredSnippets[selectedIndex]) {
            e.preventDefault();
            handleInitiateCopy(filteredSnippets[selectedIndex]);
          }
          return;
        } else {
          return;
        }
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1 < filteredSnippets.length ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 >= 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredSnippets.length > 0 && filteredSnippets[selectedIndex]) {
          handleInitiateCopy(filteredSnippets[selectedIndex]);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setEditingSnippet({ isNew: true });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredSnippets, selectedIndex, editingSnippet, promptingSnippet, previewingSnippet, showSettings, showCategoryManager]);

  const handleToggleCompact = async () => {
    const nextState = !isCompact;
    setIsCompact(nextState);
    if (window.snappyAPI?.toggleCompactMode) {
      await window.snappyAPI.toggleCompactMode(nextState);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-50 dark:bg-surface-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans select-none transition-colors relative">
      {/* TitleBar */}
      <TitleBar
        isCompact={isCompact}
        onToggleCompact={handleToggleCompact}
        onOpenSettings={() => setShowSettings(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Container */}
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden relative">
        {/* Top Navigation */}
        <TopNav
          onCreateNew={() => setEditingSnippet({ isNew: true })}
          agentName={agentName}
          onUpdateAgentName={handleUpdateAgentName}
          snippetCount={snippets.length}
          onOpenSettings={() => setShowSettings(true)}
          isCompact={isCompact}
        />

        {/* Snippets List */}
        <SnippetList
          snippets={filteredSnippets}
          allCategories={allCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onlyPinned={onlyPinned}
          onToggleOnlyPinned={() => setOnlyPinned(!onlyPinned)}
          selectedIndex={selectedIndex}
          onSelectSnippet={setSelectedIndex}
          onCopySnippet={handleInitiateCopy}
          onEditSnippet={(s) => setEditingSnippet(s)}
          onDeleteSnippet={handleDeleteSnippet}
          onTogglePinSnippet={handleTogglePin}
          onPreviewSnippet={(s) => setPreviewingSnippet(s)}
          onOpenCategoryManager={() => setShowCategoryManager(true)}
          onCreateNew={() => setEditingSnippet({ isNew: true })}
          searchQuery={searchQuery}
          isCompact={isCompact}
        />

        {/* Floating Search Bar at the Bottom */}
        <BottomSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCreateNew={() => setEditingSnippet({ isNew: true })}
          isCompact={isCompact}
        />
      </div>

      {/* Category Manager Modal */}
      {showCategoryManager && (
        <CategoryManagerModal
          categories={categories}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
          onClose={() => setShowCategoryManager(false)}
        />
      )}

      {/* Snippet Preview Modal */}
      {previewingSnippet && (
        <SnippetPreviewModal
          snippet={previewingSnippet}
          onClose={() => setPreviewingSnippet(null)}
          onCopyEntire={handleInitiateCopy}
          onEdit={(s) => {
            setPreviewingSnippet(null);
            setEditingSnippet(s);
          }}
        />
      )}

      {/* Edit / Create Snippet Modal */}
      {editingSnippet && (
        <SnippetEditorModal
          snippet={editingSnippet.isNew ? null : editingSnippet}
          existingCategories={categories}
          onAddNewCategory={handleAddCategory}
          onSave={handleSaveSnippet}
          onClose={() => setEditingSnippet(null)}
        />
      )}

      {/* Variable Prompter Modal */}
      {promptingSnippet && (
        <VariablePromptModal
          snippet={promptingSnippet.snippet}
          variables={promptingSnippet.placeholders}
          onCopy={(values) => {
            executeCopy(promptingSnippet.snippet, values);
            setPromptingSnippet(null);
          }}
          onClose={() => setPromptingSnippet(null)}
        />
      )}

      {/* Local Storage & Settings Modal */}
      {showSettings && (
        <SettingsModal
          agentName={agentName}
          onUpdateAgentName={handleUpdateAgentName}
          onImportComplete={(importedSnippets) => saveAllSnippets(importedSnippets)}
          onShowToast={showToast}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
