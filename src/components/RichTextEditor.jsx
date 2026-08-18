import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3, 
  Code, 
  Quote, 
  Variable, 
  Undo, 
  Redo, 
  RemoveFormatting
} from 'lucide-react';

export default function RichTextEditor({ content, onChange, placeholder = 'Type your note snippet here... (Type - for bullet points)' }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: 'zendesk-bullet-list',
          },
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: 'zendesk-ordered-list',
          },
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap-content min-h-[180px] max-h-[340px] overflow-y-auto px-4 py-3 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-surface-900/90 rounded-b-xl focus:outline-none border-x border-b border-slate-200 dark:border-surface-700/60',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const insertVariable = (varName) => {
    const name = varName || prompt('Enter variable name (e.g. Customer Name, Order ID):');
    if (name && name.trim()) {
      editor.chain().focus().insertContent(`{{${name.trim()}}}`).run();
    }
  };

  // Helper to prevent button click from stealing focus from editor selection
  const handleToolbarMouseDown = (e, action) => {
    e.preventDefault();
    action();
  };

  return (
    <div className="border border-slate-200 dark:border-surface-700/60 rounded-xl overflow-hidden bg-white dark:bg-surface-900/60 shadow-xs">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-1.5 bg-slate-50 dark:bg-surface-800/80 border-b border-slate-200 dark:border-surface-700/60 select-none">
        {/* Headings */}
        <button
          type="button"
          onMouseDown={(e) => handleToolbarMouseDown(e, () => editor.chain().focus().toggleHeading({ level: 1 }).run())}
          className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-surface-700 transition-colors ${
            editor.isActive('heading', { level: 1 }) ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-300'
          }`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => handleToolbarMouseDown(e, () => editor.chain().focus().toggleHeading({ level: 2 }).run())}
          className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-surface-700 transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-300'
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => handleToolbarMouseDown(e, () => editor.chain().focus().toggleHeading({ level: 3 }).run())}
          className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-surface-700 transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-300'
          }`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-slate-300 dark:bg-surface-700 mx-1" />

        {/* Text Formatting */}
        <button
          type="button"
          onMouseDown={(e) => handleToolbarMouseDown(e, () => editor.chain().focus().toggleBold().run())}
          className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-surface-700 transition-colors ${
            editor.isActive('bold') ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-300'
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => handleToolbarMouseDown(e, () => editor.chain().focus().toggleItalic().run())}
          className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-surface-700 transition-colors ${
            editor.isActive('italic') ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-300'
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => handleToolbarMouseDown(e, () => editor.chain().focus().toggleUnderline().run())}
          className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-surface-700 transition-colors ${
            editor.isActive('underline') ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-300'
          }`}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => handleToolbarMouseDown(e, () => editor.chain().focus().toggleCode().run())}
          className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-surface-700 transition-colors ${
            editor.isActive('code') ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-300'
          }`}
          title="Inline Code"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-slate-300 dark:bg-surface-700 mx-1" />

        {/* Bullet List & Numbered List */}
        <button
          type="button"
          onMouseDown={(e) => handleToolbarMouseDown(e, () => editor.chain().focus().toggleBulletList().run())}
          className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-surface-700 transition-colors ${
            editor.isActive('bulletList') ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
          }`}
          title="Bullet Points (or type '-' at start of line)"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => handleToolbarMouseDown(e, () => editor.chain().focus().toggleOrderedList().run())}
          className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-surface-700 transition-colors ${
            editor.isActive('orderedList') ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300'
          }`}
          title="Numbered List (or type '1.' at start of line)"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => handleToolbarMouseDown(e, () => editor.chain().focus().toggleBlockquote().run())}
          className={`p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-surface-700 transition-colors ${
            editor.isActive('blockquote') ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-300'
          }`}
          title="Quote Block"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-slate-300 dark:bg-surface-700 mx-1" />

        {/* Dynamic Variable Insertion */}
        <button
          type="button"
          onMouseDown={(e) => handleToolbarMouseDown(e, () => insertVariable())}
          className="flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-lg bg-brand-50 dark:bg-indigo-500/20 text-brand-700 dark:text-indigo-300 hover:bg-brand-100 dark:hover:bg-indigo-500/30 border border-brand-200 dark:border-indigo-500/40 transition-colors"
          title="Insert dynamic placeholder e.g. {{Customer Name}}"
        >
          <Variable className="w-3.5 h-3.5" />
          <span>+ Variable</span>
        </button>

        {/* Quick variable chips */}
        <div className="hidden sm:flex items-center space-x-1 ml-1">
          <button
            type="button"
            onMouseDown={(e) => handleToolbarMouseDown(e, () => insertVariable('Customer Name'))}
            className="text-[11px] px-1.5 py-0.5 rounded-md bg-slate-200/80 dark:bg-surface-700/60 hover:bg-slate-200 dark:hover:bg-surface-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            +Name
          </button>
          <button
            type="button"
            onMouseDown={(e) => handleToolbarMouseDown(e, () => insertVariable('Ticket ID'))}
            className="text-[11px] px-1.5 py-0.5 rounded-md bg-slate-200/80 dark:bg-surface-700/60 hover:bg-slate-200 dark:hover:bg-surface-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            +TicketID
          </button>
          <button
            type="button"
            onMouseDown={(e) => handleToolbarMouseDown(e, () => insertVariable('Agent Name'))}
            className="text-[11px] px-1.5 py-0.5 rounded-md bg-slate-200/80 dark:bg-surface-700/60 hover:bg-slate-200 dark:hover:bg-surface-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            +Agent
          </button>
        </div>

        <div className="flex-1" />

        {/* Undo/Redo */}
        <button
          type="button"
          onMouseDown={(e) => handleToolbarMouseDown(e, () => editor.chain().focus().undo().run())}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-surface-700 disabled:opacity-30 text-slate-600 dark:text-slate-300 transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => handleToolbarMouseDown(e, () => editor.chain().focus().redo().run())}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-surface-700 disabled:opacity-30 text-slate-600 dark:text-slate-300 transition-colors"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => handleToolbarMouseDown(e, () => editor.chain().focus().unsetAllMarks().clearNodes().run())}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-surface-700 text-slate-600 dark:text-slate-300 transition-colors"
          title="Clear formatting"
        >
          <RemoveFormatting className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
}
