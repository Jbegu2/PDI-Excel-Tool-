export type InspectionStatus = 'pass' | 'fail' | 'pending';

export interface InspectionItem {
  id: string;
  itemNumber: string | number;
  description: string;
  status: InspectionStatus;
  notes: string;
  rowIndex: number; // Original row index in Excel for output generation
}

export interface HeaderField {
  label: string;
  value: string;
  cellAddress?: string; // Excel cell address (e.g., 'A1') for output generation
  isRequired?: boolean;
}

export interface HeaderInfo {
  fields: HeaderField[];
  // Common fields we'll look for
  robotModel?: string;
  serialNumber?: string;
  date?: string;
  [key: string]: any; // Allow additional fields
}

export interface InspectionData {
  headerInfo: HeaderInfo;
  items: InspectionItem[];
  currentItemIndex: number;
  inspectorInitials: string;
  bonusQuestionAnswer: 'pass' | 'fail' | null;
  originalWorkbook?: any; // Store original Excel workbook for output generation
}

export interface ExcelParseResult {
  headerInfo: HeaderInfo;
  items: InspectionItem[];
  workbook: any; // ExcelJS workbook object - preserves all formatting
}
