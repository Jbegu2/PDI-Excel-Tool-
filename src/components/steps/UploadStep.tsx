import React, { useState, useRef } from 'react';
import { parseExcelFile } from '../../utils/excelParser';
import { ExcelParseResult } from '../../types/inspection';
import '../../styles/components.css';

interface UploadStepProps {
  onFileParsed: (result: ExcelParseResult) => void;
}

export function UploadStep({ onFileParsed }: UploadStepProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSavedData, setHasSavedData] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if there's saved data on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('inspection-wizard-data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.data) {
          setHasSavedData(true);
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  const handleFile = async (file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      setError('Please upload a valid Excel file (.xlsx or .xls)');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await parseExcelFile(file);
      console.log('Excel parsed successfully:', result);
      setIsLoading(false);
      onFileParsed(result);
    } catch (err) {
      console.error('Error parsing Excel:', err);
      setError(err instanceof Error ? err.message : 'Failed to parse Excel file');
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClearSavedData = () => {
    localStorage.removeItem('inspection-wizard-data');
    setHasSavedData(false);
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h1 className="step-title">PDI Inspection Sheet</h1>
        <p className="step-subtitle">Upload the blank Excel template for the correct revision</p>
      </div>

      {hasSavedData && (
        <div style={{
          background: 'rgba(226, 0, 26, 0.1)',
          border: '1px solid var(--abb-red)',
          padding: 'var(--spacing-md)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--spacing-lg)',
          textAlign: 'center'
        }}>
          <p style={{ marginBottom: 'var(--spacing-sm)' }}>
            ⚠️ There is saved inspection data from a previous session.
          </p>
          <button 
            className="btn btn-secondary" 
            onClick={handleClearSavedData}
            style={{ fontSize: 'var(--font-size-sm)' }}
          >
            Clear Saved Data
          </button>
        </div>
      )}

      <div
        className={`upload-area ${isDragging ? 'dragover' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        {isLoading ? (
          <div>
            <div style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-md)' }}>⏳</div>
            <p>Parsing Excel file...</p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-md)' }}>📄</div>
            <p className="text-xl" style={{ marginBottom: 'var(--spacing-sm)' }}>
              Drag and drop your Excel file here
            </p>
            <p style={{ color: 'var(--text-secondary)' }}>or click to browse</p>
            <p style={{ marginTop: 'var(--spacing-md)', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
              Supported formats: .xlsx, .xls
            </p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileInput}
        style={{ display: 'none' }}
      />

      {error && (
        <div style={{
          background: 'rgba(226, 0, 26, 0.1)',
          color: 'var(--error-red)',
          padding: 'var(--spacing-md)',
          borderRadius: 'var(--radius-md)',
          marginTop: 'var(--spacing-lg)',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}
    </div>
  );
}
