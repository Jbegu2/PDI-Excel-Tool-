import { useState } from 'react';
import { InspectionData } from '../../types/inspection';
import { generateExcelFile } from '../../utils/excelGenerator';
import '../../styles/components.css';

interface GenerateStepProps {
  data: InspectionData;
  onComplete: () => void;
}

export function GenerateStep({ data, onComplete }: GenerateStepProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');

    try {
      // Ensure originalWorkbook is set
      if (!data.originalWorkbook) {
        throw new Error('Original workbook data is missing');
      }

      await generateExcelFile(data);
      setIsComplete(true);
    } catch (err) {
      console.error('Error generating Excel:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate Excel file');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isComplete) {
    return (
      <div className="step-container">
        <div className="step-header">
          <div style={{ fontSize: 'var(--font-size-4xl)', marginBottom: 'var(--spacing-lg)' }}>✓</div>
          <h1 className="step-title">Excel File Generated!</h1>
          <p className="step-subtitle">Your inspection sheet has been downloaded</p>
        </div>

        <div className="card">
          <p style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
            The file has been saved with the proper naming format based on your header information.
          </p>
          <div style={{ 
            background: 'var(--abb-graphite)', 
            padding: 'var(--spacing-md)', 
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--spacing-xl)',
            fontSize: 'var(--font-size-sm)'
          }}>
            <strong>Filename:</strong> {data.headerInfo.robotModel || 'Unknown'} PDI - {data.headerInfo.serialNumber || 'Unknown'} - {data.bonusQuestionAnswer === 'pass' ? 'Pass' : 'Fail'}.xlsx
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-md)' }}>
            <button className="btn btn-primary" onClick={onComplete}>
              Start New Inspection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <h1 className="step-title">Generate Excel File</h1>
        <p className="step-subtitle">Generate and download your completed inspection sheet</p>
      </div>

      <div className="card">
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h2 style={{ marginBottom: 'var(--spacing-md)', fontSize: 'var(--font-size-xl)' }}>
            Review Summary
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Robot Model:</span>
              <span style={{ fontWeight: 500 }}>{data.headerInfo.robotModel || 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Serial Number:</span>
              <span style={{ fontWeight: 500 }}>{data.headerInfo.serialNumber || 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Inspector:</span>
              <span style={{ fontWeight: 500 }}>{data.inspectorInitials || 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Overall Status:</span>
              <span style={{ fontWeight: 500 }}>
                {data.bonusQuestionAnswer === 'pass' ? 'Pass' : data.bonusQuestionAnswer === 'fail' ? 'Fail' : 'Pending'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--spacing-sm)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Items:</span>
              <span style={{ fontWeight: 500 }}>{data.items.length}</span>
            </div>
          </div>
        </div>

        {error && (
          <div style={{
            background: 'rgba(226, 0, 26, 0.1)',
            color: 'var(--error-red)',
            padding: 'var(--spacing-md)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            className="btn btn-primary"
            onClick={handleGenerate}
            disabled={isGenerating}
            style={{ minWidth: '200px' }}
          >
            {isGenerating ? 'Generating...' : 'Generate Excel File'}
          </button>
        </div>
      </div>
    </div>
  );
}
