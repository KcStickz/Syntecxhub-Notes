import { FileText, Pencil, Trash2 } from 'lucide-react';

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type NoteCardProps = {
  note: Note;
  index: number;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
};

export function formatCreatedDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date unavailable';
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

export function NoteCard({ note, index, onEdit, onDelete }: NoteCardProps) {
  return (
    <article className={`note-card card-tone-${index % 4}`} aria-label={note.title || 'Untitled note'}>
      <div className="note-card-top">
        <div className="note-type"><FileText size={14} /> <span>NOTE</span></div>
        <div className="card-actions">
          <button type="button" onClick={() => onEdit(note)} aria-label={`Edit ${note.title || 'untitled note'}`} title="Edit note">
            <Pencil size={15} />
          </button>
          <button type="button" onClick={() => onDelete(note)} aria-label={`Delete ${note.title || 'untitled note'}`} title="Delete note" className="delete-action">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
      <button className="note-card-content" type="button" onClick={() => onEdit(note)} aria-label={`Open note: ${note.title || 'Untitled note'}`}>
        <h3>{note.title || 'Untitled note'}</h3>
        <p>{note.content || <span className="no-content">No details added yet.</span>}</p>
      </button>
      <div className="note-card-footer">
        <span className="note-date-mark" />
        <time dateTime={note.createdAt}>Created {formatCreatedDate(note.createdAt)}</time>
      </div>
    </article>
  );
}
