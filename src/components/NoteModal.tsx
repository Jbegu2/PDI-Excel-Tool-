import { useState, useEffect } from 'react';
import '../styles/components.css';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (notes: string) => void;
  initialNotes?: string;
}

export function NoteModal({ isOpen, onClose, onSubmit, initialNotes = '' }: NoteModalProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [error, setError] = useState('');

  useEffect(() => {
    setNotes(initialNotes);
    setError('');
  }, [initialNotes, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const trimmedNotes = notes.trim();
    if (!trimmedNotes) {
      setError('Please enter a note describing the issue');
      return;
    }
    onSubmit(trimmedNotes);
    setNotes('');
    setError('');
  };

  const handleClose = () => {
    setNotes('');
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="step-title" style={{ marginBottom: 'var(--spacing-md)' }}>
          Add Failure Note
        </h2>
        <p style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--text-secondary)' }}>
          Please describe the issue that caused this item to fail:
        </p>
        
        <textarea
          className="textarea"
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            setError('');
          }}
          placeholder="Enter details about the failure..."
          autoFocus
          rows={6}
        />
        
        {error && (
          <p style={{ color: 'var(--error-red)', marginTop: 'var(--spacing-sm)', fontSize: 'var(--font-size-sm)' }}>
            {error}
          </p>
        )}
        
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-xl)', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
