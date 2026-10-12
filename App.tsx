import { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, FileText, Search, Plus, Sparkles } from 'lucide-react';
import { NoteCard, type Note } from './components/NoteCard';
import { NoteEditor } from './components/NoteEditor';
import './notes.css';

const STORAGE_KEY = 'syntecxhub-notes-v1';

function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) setNotes(parsed as Note[]);
      }
    } catch {
      setNotes([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch {
      // The notes remain usable in memory if browser storage is unavailable.
    }
  }, [notes, isLoaded]);

  useEffect(() => {
    if (editorOpen) {
      const timer = window.setTimeout(() => inputRef.current?.focus(), 80);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [editorOpen]);

  const filteredNotes = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const sorted = [...notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    if (!needle) return sorted;
    return sorted.filter((note) =>
      `${note.title} ${note.content}`.toLowerCase().includes(needle),
    );
  }, [notes, query]);

  const openCreate = () => {
    setActiveNote(null);
    setEditorOpen(true);
  };

  const openEdit = (note: Note) => {
    setActiveNote(note);
    setEditorOpen(true);
  };

  const saveNote = (title: string, content: string) => {
    const now = new Date().toISOString();
    if (activeNote) {
      setNotes((current) =>
        current.map((note) =>
          note.id === activeNote.id ? { ...note, title, content, updatedAt: now } : note,
        ),
      );
    } else {
      const note: Note = {
        id: window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        title,
        content,
        createdAt: now,
        updatedAt: now,
      };
      setNotes((current) => [note, ...current]);
    }
    setEditorOpen(false);
    setActiveNote(null);
  };

  const deleteNote = (note: Note) => {
    const confirmed = window.confirm(`Delete “${note.title || 'Untitled note'}”? This can’t be undone.`);
    if (confirmed) setNotes((current) => current.filter((item) => item.id !== note.id));
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true"><BookOpen size={20} strokeWidth={2.2} /></div>
          <div className="brand-name">syntecx<span>hub</span></div>
        </div>
        <div className="sidebar-rule" />
        <p className="side-label">YOUR WORKSPACE</p>
        <div className="nav-current" aria-current="page">
          <FileText size={17} />
          <span>All notes</span>
          <span className="nav-count">{notes.length}</span>
        </div>
        <div className="sidebar-bottom">
          <div className="internship-badge"><span className="status-dot" /> Internship notebook</div>
          <p>Ideas, kept close.<br />Progress, made visible.</p>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><strong>Notes</strong></div>
          <div className="topbar-right">
            <span className="local-status"><span className="status-dot" /> Saved on this device</span>
            <div className="profile-chip" aria-label="Web development intern profile">WD</div>
          </div>
        </header>

        <div className="page-wrap">
          <section className="welcome-row">
            <div>
              <div className="eyebrow"><Sparkles size={13} /> YOUR IDEAS, IN ONE PLACE</div>
              <h1>A place for<br className="mobile-break" /> <span>what you’re learning.</span></h1>
              <p className="intro-copy">Keep the little discoveries, the big questions, and everything in between.</p>
            </div>
            <button className="new-note-button" onClick={openCreate} type="button">
              <Plus size={18} strokeWidth={2.4} /> <span>New note</span>
            </button>
          </section>

          <section className="collection-toolbar" aria-label="Notes controls">
            <div className="collection-heading">
              <h2>Your notes <span className="heading-count">{notes.length.toString().padStart(2, '0')}</span></h2>
              <p>{notes.length === 1 ? 'One thought worth keeping.' : 'A growing collection of good thinking.'}</p>
            </div>
            <label className="search-field">
              <Search size={17} aria-hidden="true" />
              <input
                ref={inputRef}
                type="search"
                placeholder="Find a note..."
                aria-label="Search notes"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              {query && <button type="button" className="clear-search" onClick={() => setQuery('')} aria-label="Clear search">×</button>}
            </label>
          </section>

          {!isLoaded ? (
            <div className="notes-grid" aria-label="Loading notes">
              {[0, 1, 2].map((item) => <div className="note-skeleton" key={item}><div /><div /><div /></div>)}
            </div>
          ) : filteredNotes.length > 0 ? (
            <section className="notes-grid" aria-label="Your notes">
              {filteredNotes.map((note, index) => (
                <NoteCard key={note.id} note={note} index={index} onEdit={openEdit} onDelete={deleteNote} />
              ))}
            </section>
          ) : query ? (
            <section className="empty-state search-empty">
              <div className="empty-icon"><Search size={21} /></div>
              <h3>No notes found</h3>
              <p>Nothing matches “{query}”. Try another search.</p>
              <button className="text-action" onClick={() => setQuery('')} type="button">Clear search</button>
            </section>
          ) : (
            <section className="empty-state">
              <div className="empty-art" aria-hidden="true">
                <div className="empty-art-sheet sheet-back" />
                <div className="empty-art-sheet sheet-front"><span /><span /><span /></div>
                <div className="empty-art-spark">+</div>
              </div>
              <h3>Your next good idea starts here.</h3>
              <p>Capture a code snippet, a question for your mentor, or a small win from today.</p>
              <button className="empty-cta" onClick={openCreate} type="button"><Plus size={16} /> Write your first note</button>
            </section>
          )}

          <footer className="page-footer">
            <span>Made for your learning journey.</span>
            <span><span className="footer-dot" /> Private by default · stored in your browser</span>
          </footer>
        </div>
      </main>

      {editorOpen && (
        <NoteEditor
          key={activeNote?.id ?? 'new'}
          initialNote={activeNote}
          onSave={saveNote}
          onClose={() => { setEditorOpen(false); setActiveNote(null); }}
          inputRef={inputRef}
        />
      )}
    </div>
  );
}

export default Home;
