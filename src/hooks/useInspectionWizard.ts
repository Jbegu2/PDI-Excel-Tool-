import { useState, useEffect, useCallback, useRef } from 'react';
import { InspectionData, InspectionItem, HeaderInfo } from '../types/inspection';

export type WizardStep = 
  | 'upload'
  | 'header'
  | 'inspection'
  | 'review'
  | 'initials'
  | 'bonus'
  | 'generate';

interface UseInspectionWizardReturn {
  currentStep: WizardStep;
  data: InspectionData | null;
  goToStep: (step: WizardStep) => void;
  setHeaderInfo: (headerInfo: HeaderInfo) => void;
  setItems: (items: InspectionItem[]) => void;
  setWorkbook: (workbook: any) => void;
  initializeData: (headerInfo: HeaderInfo, items: InspectionItem[], workbook: any) => void;
  updateItem: (itemId: string, updates: Partial<InspectionItem>) => void;
  setCurrentItemIndex: (index: number) => void;
  markItemPass: (itemId: string) => void;
  markItemFail: (itemId: string, notes: string) => void;
  fullyFailRobot: () => void;
  setInspectorInitials: (initials: string) => void;
  setBonusQuestionAnswer: (answer: 'pass' | 'fail') => void;
  reset: () => void;
}

const STORAGE_KEY = 'inspection-wizard-data';

export function useInspectionWizard(): UseInspectionWizardReturn {
  const [currentStep, setCurrentStep] = useState<WizardStep>('upload');
  const [data, setData] = useState<InspectionData | null>(null);
  // Store workbook separately since it can't be serialized
  const workbookRef = useRef<any>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData(parsed.data);
        setCurrentStep(parsed.step || 'upload');
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever data changes (excluding workbook)
  useEffect(() => {
    if (data) {
      // Create a copy without the workbook for serialization
      const { originalWorkbook, ...serializableData } = data;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        data: serializableData,
        step: currentStep
      }));
    }
  }, [data, currentStep]);

  const goToStep = useCallback((step: WizardStep) => {
    setCurrentStep(step);
  }, []);

  const setHeaderInfo = useCallback((headerInfo: HeaderInfo) => {
    setData(prev => prev ? { ...prev, headerInfo } : {
      headerInfo,
      items: [],
      currentItemIndex: 0,
      inspectorInitials: '',
      bonusQuestionAnswer: null,
      originalWorkbook: workbookRef.current
    });
  }, []);

  const setItems = useCallback((items: InspectionItem[]) => {
    setData(prev => prev ? { ...prev, items, currentItemIndex: 0 } : {
      headerInfo: { fields: [], robotModel: '', serialNumber: '', date: '' },
      items,
      currentItemIndex: 0,
      inspectorInitials: '',
      bonusQuestionAnswer: null,
      originalWorkbook: workbookRef.current
    });
  }, []);

  const setWorkbook = useCallback((workbook: any) => {
    workbookRef.current = workbook;
    setData(prev => prev ? { ...prev, originalWorkbook: workbook } : {
      headerInfo: { fields: [], robotModel: '', serialNumber: '', date: '' },
      items: [],
      currentItemIndex: 0,
      inspectorInitials: '',
      bonusQuestionAnswer: null,
      originalWorkbook: workbook
    });
  }, []);

  const initializeData = useCallback((headerInfo: HeaderInfo, items: InspectionItem[], workbook: any) => {
    workbookRef.current = workbook;
    setData({
      headerInfo,
      items,
      currentItemIndex: 0,
      inspectorInitials: '',
      bonusQuestionAnswer: null,
      originalWorkbook: workbook
    });
  }, []);

  const updateItem = useCallback((itemId: string, updates: Partial<InspectionItem>) => {
    setData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        items: prev.items.map(item =>
          item.id === itemId ? { ...item, ...updates } : item
        )
      };
    });
  }, []);

  const setCurrentItemIndex = useCallback((index: number) => {
    setData(prev => prev ? { ...prev, currentItemIndex: index } : null);
  }, []);

  const markItemPass = useCallback((itemId: string) => {
    updateItem(itemId, { status: 'pass', notes: '' });
  }, [updateItem]);

  const markItemFail = useCallback((itemId: string, notes: string) => {
    updateItem(itemId, { status: 'fail', notes });
  }, [updateItem]);

  const fullyFailRobot = useCallback(() => {
    setData(prev => {
      if (!prev) return null;
      const currentIndex = prev.currentItemIndex;
      return {
        ...prev,
        items: prev.items.map((item, index) => {
          if (index >= currentIndex && item.status === 'pending') {
            return {
              ...item,
              status: 'fail' as const,
              notes: item.notes || 'Robot failed inspection'
            };
          }
          return item;
        })
      };
    });
    setCurrentStep('review');
  }, []);

  const setInspectorInitials = useCallback((initials: string) => {
    setData(prev => prev ? { ...prev, inspectorInitials: initials } : null);
  }, []);

  const setBonusQuestionAnswer = useCallback((answer: 'pass' | 'fail') => {
    setData(prev => prev ? { ...prev, bonusQuestionAnswer: answer } : null);
  }, []);

  const reset = useCallback(() => {
    setData(null);
    workbookRef.current = null;
    setCurrentStep('upload');
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Ensure workbook is attached to data when needed
  useEffect(() => {
    if (data && workbookRef.current && !data.originalWorkbook) {
      setData(prev => prev ? { ...prev, originalWorkbook: workbookRef.current } : null);
    }
  }, [data]);

  return {
    currentStep,
    data: data ? { ...data, originalWorkbook: workbookRef.current || data.originalWorkbook } : null,
    goToStep,
    setHeaderInfo,
    setItems,
    setWorkbook,
    initializeData,
    updateItem,
    setCurrentItemIndex,
    markItemPass,
    markItemFail,
    fullyFailRobot,
    setInspectorInitials,
    setBonusQuestionAnswer,
    reset
  };
}
