import { useState } from 'react';
import '../../styles/components.css';

interface InitialsStepProps {
  initialValue: string;
  onComplete: (initials: string) => void;
}

export function InitialsStep({ initialValue, onComplete }: InitialsStepProps) {
  const [initials, setInitials] = useState(initialValue);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const trimmed = initials.trim().toUpperCase();
    
    if (!trimmed) {
      setError('Please enter your initials');
      return;
    }

    if (trimmed.length < 2 || trimmed.length > 5) {
      setError('Initials should be between 2 and 5 characters');
      return;
    }

    if (!/^[A-Z]+$/.test(trimmed)) {
      setError('Initials should only contain letters');
      return;
    }

    onComplete(trimmed);
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h1 className="step-title">Enter Your Initials</h1>
        <p className="step-subtitle">Please enter your inspector initials</p>
      </div>

      <div className="card">
        <div>
          <label style={{
            display: 'block',
            marginBottom: 'var(--spacing-sm)',
            fontWeight: 500,
            color: 'var(--text-primary)'
          }}>
            Inspector Initials <span style={{ color: 'var(--error-red)' }}>*</span>
          </label>
          <input
            className="input"
            type="text"
            value={initials}
            onChange={(e) => {
              setInitials(e.target.value.toUpperCase());
              setError('');
            }}
            placeholder="e.g., JD"
            maxLength={5}
            autoFocus
          />
          {error && (
            <p style={{ color: 'var(--error-red)', marginTop: 'var(--spacing-sm)', fontSize: 'var(--font-size-sm)' }}>
              {error}
            </p>
          )}
        </div>

        <div style={{ marginTop: 'var(--spacing-xl)', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
