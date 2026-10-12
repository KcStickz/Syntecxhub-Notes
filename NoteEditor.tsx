import { useEffect, useRef, useState, type FormEvent, type RefObject } from 'react';
import { X, FileText, Check } from 'lucide-react';
import type { Note } from './NoteCard';
import { formatCreatedDate } from './NoteCard';

type NoteEditorProps = {
  initialNote: Note | null;
  onSave: (title: string, content: string) => void;
  onClose: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
};

export function NoteEditor({ initialNote, onSave, onClose, inputRef }: NoteEditorProps) {
  const [title, setTitle] = useState(initialNote?.title ?? '');
  const [content, setContent] = useState(initialNote?.content ?? '');
  const [error, setError] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault();
        document.querySelector<HTMLFormElement>('#note-editor-form')?.requestSubmit();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanTitle = title.trim();
    const cleanContent = content.trim();
    if (!cleanTitle && !cleanContent) {
      setError('Add a title or a few words before saving.');
      (inputRef.current ?? textareaRef.current)?.focus();
      return;
    }
    onSave(cleanTitle, cleanContent);
  };

  return (
    <div className="modal-scrim" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="editor-dialog" role="dialog" aria-modal="true" aria-labelledby="editor-title" ref={dialogRef}>
        <div className="editor-head">
          <div className="editor-title-lockup">
            <div className="editor-icon"><FileText size={17} /></div>
            <div><span className="editor-kicker">{initialNote ? 'A NOTE IN YOUR COLLECTION' : 'A FRESH PAGE'}</span><h2 id="editor-title">{initialNote ? 'Edit note' : 'New note'}</h2></div>
          </div>
          <button type="button" className="close-editor" onClick={onClose} aria-label="Close editor"><X size={19} /></button>
        </div>
        <form id="note-editor-form" onSubmit={handleSubmit}>
          <label className="editor-label" htmlFor="note-title">Title</label>
          <input
            ref={inputRef}
            id="note-title"
            className="title-input"
            placeholder="Give this thought a name"
            value={title}
            onChange={(event) => { setTitle(event.target.value); setError(''); }}
            maxLength={100}
          />
          <div className="body-label-row">
            <label className="editor-label" htmlFor="note-content">Your note</label>
            <span>Markdown-friendly, just for you</span>
          </div>
          <textarea
            ref={textareaRef}
            id="note-content"
            className="body-input"
            placeholder="What would you like to remember?"
            value={content}
            onChange={(event) => { setContent(event.target.value); setError(''); }}
            rows={7}
            maxLength={10000}
          />
          <div className="editor-meta">
            {initialNote ? <span>Created {formatCreatedDate(initialNote.createdAt)}</span> : <span>Your note stays on this device</span>}
            <span>{content.length} / 10,000</span>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="editor-footer">
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="save-button"><Check size={16} /> {initialNote ? 'Save changes' : 'Save note'}</button>
          </div>
        </form>
        <div className="shortcut-hint"><kbd>⌘</kbd><kbd>↵</kbd><span>to save</span></div>
      </div>
    </div>
  );
}
