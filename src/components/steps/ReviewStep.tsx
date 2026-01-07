import { InspectionItem } from '../../types/inspection';
import '../../styles/components.css';

interface ReviewStepProps {
  items: InspectionItem[];
  onEditItem: (itemId: string) => void;
  onComplete: () => void;
}

export function ReviewStep({ items, onEditItem, onComplete }: ReviewStepProps) {
  const passedCount = items.filter(item => item.status === 'pass').length;
  const failedCount = items.filter(item => item.status === 'fail').length;
  const pendingCount = items.filter(item => item.status === 'pending').length;

  return (
    <div className="step-container">
      <div className="step-header">
        <h1 className="step-title">Review Inspection</h1>
        <p className="step-subtitle">Review all inspection items before finalizing</p>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 600, color: 'var(--success-green)' }}>
              {passedCount}
            </div>
            <div style={{ color: 'var(--text-secondary)', marginTop: 'var(--spacing-xs)' }}>Passed</div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 600, color: 'var(--error-red)' }}>
              {failedCount}
            </div>
            <div style={{ color: 'var(--text-secondary)', marginTop: 'var(--spacing-xs)' }}>Failed</div>
          </div>
          {pendingCount > 0 && (
            <div>
              <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 600, color: 'var(--pending-gray)' }}>
                {pendingCount}
              </div>
              <div style={{ color: 'var(--text-secondary)', marginTop: 'var(--spacing-xs)' }}>Pending</div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        {items.map((item) => (
          <div key={item.id} className={`review-item ${item.status}`}>
            <div className="review-item-header">
              <div>
                <span className="review-item-number">Item {item.itemNumber}: </span>
                <span>{item.description}</span>
              </div>
              <span className={`review-status-badge ${item.status}`}>
                {item.status === 'pass' ? 'Pass' : item.status === 'fail' ? 'Fail' : 'Pending'}
              </span>
            </div>
            {item.status === 'fail' && item.notes && (
              <div className="review-item-notes">
                <strong>Notes:</strong> {item.notes}
              </div>
            )}
            <button
              className="btn btn-secondary"
              onClick={() => onEditItem(item.id)}
              style={{ marginTop: 'var(--spacing-md)', fontSize: 'var(--font-size-sm)' }}
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary" onClick={onComplete}>
          Continue to Initials
        </button>
      </div>
    </div>
  );
}
