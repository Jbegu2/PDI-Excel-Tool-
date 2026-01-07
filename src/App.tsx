import React from 'react';
import { useInspectionWizard } from './hooks/useInspectionWizard';
import { ExcelParseResult } from './types/inspection';
import { ErrorBoundary } from './components/ErrorBoundary';
import { UploadStep } from './components/steps/UploadStep';
import { HeaderStep } from './components/steps/HeaderStep';
import { InspectionStep } from './components/steps/InspectionStep';
import { ReviewStep } from './components/steps/ReviewStep';
import { InitialsStep } from './components/steps/InitialsStep';
import { BonusQuestionStep } from './components/steps/BonusQuestionStep';
import { GenerateStep } from './components/steps/GenerateStep';
import './styles/app.css';

function App() {
  const {
    currentStep,
    data,
    goToStep,
    setHeaderInfo,
    setItems,
    setWorkbook,
    initializeData,
    setCurrentItemIndex,
    markItemPass,
    markItemFail,
    fullyFailRobot,
    setInspectorInitials,
    setBonusQuestionAnswer,
    reset
  } = useInspectionWizard();

  const handleFileParsed = (result: ExcelParseResult) => {
    try {
      console.log('Handling parsed file:', result);
      console.log('Header info:', result.headerInfo);
      console.log('Items count:', result.items.length);
      
      // Initialize all data at once to avoid race conditions
      initializeData(result.headerInfo, result.items, result.workbook);
      
      // Navigate to header step immediately (React 18 batches updates)
      goToStep('header');
    } catch (error) {
      console.error('Error handling parsed file:', error);
      alert('Error processing file. Please check the console for details.');
    }
  };

  const handleHeaderComplete = (headerInfo: any) => {
    setHeaderInfo(headerInfo);
    goToStep('inspection');
  };

  const handleItemPass = (itemId: string) => {
    markItemPass(itemId);
    
    // Auto-advance to next question
    if (data) {
      const currentIndex = data.currentItemIndex;
      const nextIndex = currentIndex + 1;
      
      if (nextIndex < data.items.length) {
        setCurrentItemIndex(nextIndex);
      } else {
        // All items completed, go to review
        goToStep('review');
      }
    }
  };

  const handleItemFail = (itemId: string, notes: string) => {
    markItemFail(itemId, notes);
    
    // Advance to next question after fail
    if (data) {
      const currentIndex = data.currentItemIndex;
      const nextIndex = currentIndex + 1;
      
      if (nextIndex < data.items.length) {
        setCurrentItemIndex(nextIndex);
      } else {
        // All items completed, go to review
        goToStep('review');
      }
    }
  };

  const handleFullyFail = () => {
    fullyFailRobot();
    goToStep('review');
  };

  const handlePreviousQuestion = () => {
    if (data && data.currentItemIndex > 0) {
      setCurrentItemIndex(data.currentItemIndex - 1);
    }
  };

  const handleEditItem = (itemId: string) => {
    if (data) {
      const itemIndex = data.items.findIndex(item => item.id === itemId);
      if (itemIndex !== -1) {
        setCurrentItemIndex(itemIndex);
        goToStep('inspection');
      }
    }
  };

  const handleReviewComplete = () => {
    goToStep('initials');
  };

  const handleInitialsComplete = (initials: string) => {
    setInspectorInitials(initials);
    goToStep('bonus');
  };

  const handleBonusComplete = (answer: 'pass' | 'fail') => {
    setBonusQuestionAnswer(answer);
    goToStep('generate');
  };

  const handleGenerateComplete = () => {
    reset();
  };

  // Error boundary - show error if something goes wrong
  if (!currentStep) {
    return (
      <div className="step-container">
        <div className="card">
          <h1>Error</h1>
          <p>Something went wrong. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="App">
        {/* Show Start Over button on all steps except upload */}
        {currentStep !== 'upload' && (
          <div style={{ 
            position: 'fixed', 
            top: 'var(--spacing-lg)', 
            right: 'var(--spacing-lg)',
            zIndex: 1000 
          }}>
            <button 
              className="btn btn-secondary"
              onClick={() => {
                if (window.confirm('Are you sure you want to start over? All progress will be lost.')) {
                  reset();
                }
              }}
              style={{ fontSize: 'var(--font-size-sm)' }}
            >
              ← Start Over
            </button>
          </div>
        )}

        {currentStep === 'upload' && (
          <UploadStep onFileParsed={handleFileParsed} />
        )}

        {currentStep === 'header' && data && (
          <HeaderStep headerInfo={data.headerInfo} onComplete={handleHeaderComplete} />
        )}

        {currentStep === 'header' && !data && (
          <div className="step-container">
            <div className="card">
              <p>Loading header information...</p>
            </div>
          </div>
        )}

          {currentStep === 'inspection' && data && (
          <InspectionStep
            items={data.items}
            currentIndex={data.currentItemIndex}
            onItemPass={handleItemPass}
            onItemFail={handleItemFail}
            onFullyFail={handleFullyFail}
            onPrevious={handlePreviousQuestion}
          />
        )}

        {currentStep === 'review' && data && (
          <ReviewStep
            items={data.items}
            onEditItem={handleEditItem}
            onComplete={handleReviewComplete}
          />
        )}

        {currentStep === 'initials' && data && (
          <InitialsStep
            initialValue={data.inspectorInitials}
            onComplete={handleInitialsComplete}
          />
        )}

        {currentStep === 'bonus' && data && (
          <BonusQuestionStep
            currentAnswer={data.bonusQuestionAnswer}
            onAnswer={handleBonusComplete}
          />
        )}

        {currentStep === 'generate' && data && (
          <GenerateStep
            data={data}
            onComplete={handleGenerateComplete}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
