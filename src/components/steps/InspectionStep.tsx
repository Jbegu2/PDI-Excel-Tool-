import { useState } from 'react';
import { InspectionItem } from '../../types/inspection';
import { NoteModal } from '../NoteModal';
import '../../styles/components.css';

interface InspectionStepProps {
  items: InspectionItem[];
  currentIndex: number;
  onItemPass: (itemId: string) => void;
  onItemFail: (itemId: string, notes: string) => void;
  onFullyFail: () => void;
  onPrevious: () => void;
}

export function InspectionStep({
  items,
  currentIndex,
  onItemPass,
  onItemFail,
  onFullyFail,
  onPrevious
}: InspectionStepProps) {
  const [showNoteModal, setShowNoteModal] = useState(false);
  const currentItem = items[currentIndex];
  const progress = ((currentIndex + 1) / items.length) * 100;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === items.length - 1;

  if (!currentItem) {
    return null;
  }

  const handlePass = () => {
    onItemPass(currentItem.id);
  };

  const handleFail = () => {
    setShowNoteModal(true);
  };

  const handleNoteSubmit = (notes: string) => {
    onItemFail(currentItem.id, notes);
    setShowNoteModal(false);
  };

  const handleFullyFail = () => {
    if (window.confirm('Are you sure you want to fully fail the robot? This will mark all remaining items as failed.')) {
      onFullyFail();
    }
  };

  return (
    <div className="step-container">
      <div className="progress-indicator">
        <span>Question {currentIndex + 1} of {items.length}</span>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="question-card">
        <div>
          <div className="question-number">Item {currentItem.itemNumber}</div>
          <div className="question-text">{currentItem.description}</div>
        </div>

        <div className="question-actions">
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center' }}>
            <button className="btn btn-success" onClick={handlePass} style={{ minWidth: '120px' }}>
              ✓ Pass
            </button>
            <button className="btn btn-danger" onClick={handleFail} style={{ minWidth: '120px' }}>
              ✗ Fail
            </button>
          </div>

          <button
            className="btn btn-secondary"
            onClick={handleFullyFail}
            style={{ marginTop: 'var(--spacing-md)' }}
          >
            Fully Fail Robot
          </button>

          {!isFirst && (
            <button
              className="btn btn-secondary"
              onClick={onPrevious}
              style={{ marginTop: 'var(--spacing-sm)' }}
            >
              ← Previous Question
            </button>
          )}
        </div>
      </div>

      <NoteModal
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        onSubmit={handleNoteSubmit}
        initialNotes={currentItem.notes}
      />
    </div>
  );
}
