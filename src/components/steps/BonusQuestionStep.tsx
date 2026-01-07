import '../../styles/components.css';

interface BonusQuestionStepProps {
  currentAnswer: 'pass' | 'fail' | null;
  onAnswer: (answer: 'pass' | 'fail') => void;
}

export function BonusQuestionStep({ currentAnswer, onAnswer }: BonusQuestionStepProps) {
  return (
    <div className="step-container">
      <div className="step-header">
        <h1 className="step-title">Final Question</h1>
        <p className="step-subtitle">Did the robot pass or fail overall?</p>
      </div>

      <div className="question-card" style={{ minHeight: '300px' }}>
        <div className="question-text" style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
          Based on your inspection, did the robot pass or fail overall?
        </div>

        <div className="question-actions">
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center' }}>
            <button
              className={`btn ${currentAnswer === 'pass' ? 'btn-success' : 'btn-secondary'}`}
              onClick={() => onAnswer('pass')}
              style={{ minWidth: '150px' }}
            >
              ✓ Robot Passed
            </button>
            <button
              className={`btn ${currentAnswer === 'fail' ? 'btn-danger' : 'btn-secondary'}`}
              onClick={() => onAnswer('fail')}
              style={{ minWidth: '150px' }}
            >
              ✗ Robot Failed
            </button>
          </div>
        </div>

        <p style={{
          marginTop: 'var(--spacing-xl)',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: 'var(--font-size-sm)'
        }}>
          This answer will be used for the output file name
        </p>
      </div>
    </div>
  );
}
