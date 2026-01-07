import { useState, useEffect } from 'react';
import { HeaderInfo, HeaderField } from '../../types/inspection';
import '../../styles/components.css';

interface HeaderStepProps {
  headerInfo: HeaderInfo;
  onComplete: (headerInfo: HeaderInfo) => void;
}

export function HeaderStep({ headerInfo, onComplete }: HeaderStepProps) {
  const [fields, setFields] = useState<HeaderField[]>(headerInfo?.fields || []);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (headerInfo) {
      setFields(headerInfo.fields || []);
    }
  }, [headerInfo]);

  // Safety check
  if (!headerInfo) {
    return (
      <div className="step-container">
        <div className="card">
          <p>Loading header information...</p>
        </div>
      </div>
    );
  }

  const updateField = (index: number, value: string) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], value };
    setFields(newFields);
    
    // Clear error for this field
    if (errors[newFields[index].label]) {
      const newErrors = { ...errors };
      delete newErrors[newFields[index].label];
      setErrors(newErrors);
    }
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate required fields
    fields.forEach(field => {
      if (field.isRequired && !field.value.trim()) {
        newErrors[field.label] = 'This field is required';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Update header info with new values
    const updatedHeaderInfo: HeaderInfo = {
      ...headerInfo,
      fields,
      robotModel: fields.find(f => f.label.toLowerCase().includes('model'))?.value || '',
      serialNumber: fields.find(f => f.label.toLowerCase().includes('serial') || f.label.toLowerCase().includes('s/n'))?.value || '',
      date: fields.find(f => f.label.toLowerCase().includes('date'))?.value || ''
    };

    onComplete(updatedHeaderInfo);
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h1 className="step-title">Fill Header Information</h1>
        <p className="step-subtitle">Please fill in the header information from the inspection sheet</p>
      </div>

      <div className="card">
        {fields.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            No header fields found. You can proceed to the inspection.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            {fields.map((field, index) => (
              <div key={index}>
                <label style={{
                  display: 'block',
                  marginBottom: 'var(--spacing-sm)',
                  fontWeight: 500,
                  color: 'var(--text-primary)'
                }}>
                  {field.label}
                  {field.isRequired && <span style={{ color: 'var(--error-red)' }}> *</span>}
                </label>
                <input
                  className="input"
                  type="text"
                  value={field.value}
                  onChange={(e) => updateField(index, e.target.value)}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
                {errors[field.label] && (
                  <p style={{ color: 'var(--error-red)', marginTop: 'var(--spacing-xs)', fontSize: 'var(--font-size-sm)' }}>
                    {errors[field.label]}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 'var(--spacing-xl)', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Continue to Inspection
          </button>
        </div>
      </div>
    </div>
  );
}
