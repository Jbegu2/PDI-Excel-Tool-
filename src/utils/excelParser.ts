import ExcelJS from 'exceljs';
import { ExcelParseResult, HeaderInfo, HeaderField, InspectionItem } from '../types/inspection';

/**
 * Parse Excel file and extract header information and inspection items
 * Uses ExcelJS which preserves all formatting
 */
export async function parseExcelFile(file: File): Promise<ExcelParseResult> {
  const arrayBuffer = await file.arrayBuffer();
  
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(arrayBuffer);
  
  console.log('Workbook loaded successfully');
  console.log('Sheet names:', workbook.worksheets.map(ws => ws.name));
  
  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error('No worksheet found in Excel file');
  }
  
  console.log('Worksheet name:', worksheet.name);
  console.log('Row count:', worksheet.rowCount);
  console.log('Column count:', worksheet.columnCount);
  
  // Debug: Check if images exist in the workbook
  const images = worksheet.getImages();
  console.log('Images found in worksheet:', images.length);
  if (images.length > 0) {
    images.forEach((img, idx) => {
      console.log(`Image ${idx}:`, img);
    });
  }
  
  // Check workbook-level media
  if (workbook.media && workbook.media.length > 0) {
    console.log('Media items in workbook:', workbook.media.length);
  }
  
  // Debug: Check if formatting is preserved
  const sampleCell = worksheet.getCell('B3');
  if (sampleCell) {
    console.log('Sample cell B3 value:', sampleCell.value);
    console.log('Sample cell B3 font:', sampleCell.font);
    console.log('Sample cell B3 fill:', sampleCell.fill);
    console.log('Sample cell B3 border:', sampleCell.border);
  }
  
  // Parse header information
  const headerInfo = parseHeaderInfo(worksheet);
  console.log('Parsed header info:', headerInfo);
  
  // Parse inspection items
  const items = parseInspectionItems(worksheet);
  console.log('Parsed items count:', items.length);
  
  return {
    headerInfo,
    items,
    workbook // Pass the entire workbook for later use
  };
}

/**
 * Parse header information from specific cells
 * B3: Customer name, B4: Serial number, B5: Box number, B6: Dispatch location
 * D3: Model, D4: Supervisor name, D5: Inspector name, D6: Date
 */
function parseHeaderInfo(worksheet: ExcelJS.Worksheet): HeaderInfo {
  const headerFields: HeaderField[] = [];
  
  // Helper to get cell value as string
  const getCellValue = (cellAddress: string): string => {
    const cell = worksheet.getCell(cellAddress);
    if (!cell || cell.value === null || cell.value === undefined) {
      return '';
    }
    // Handle different cell value types
    if (typeof cell.value === 'object') {
      // Rich text or formula result
      if ('result' in cell.value) {
        return String(cell.value.result || '');
      }
      if ('richText' in cell.value) {
        return (cell.value as ExcelJS.CellRichTextValue).richText
          .map(rt => rt.text)
          .join('');
      }
      return String(cell.value);
    }
    return String(cell.value).trim();
  };
  
  // Define header fields with their cell locations
  const fieldDefinitions = [
    { label: 'Customer Name', cellAddress: 'B3', isRequired: true },
    { label: 'Serial Number', cellAddress: 'B4', isRequired: true },
    { label: 'Box Number', cellAddress: 'B5', isRequired: false },
    { label: 'Dispatch Location', cellAddress: 'B6', isRequired: false },
    { label: 'Model', cellAddress: 'D3', isRequired: true },
    { label: 'Supervisor Name', cellAddress: 'D4', isRequired: false },
    { label: 'Inspector Name', cellAddress: 'D5', isRequired: false },
    { label: 'Date', cellAddress: 'D6', isRequired: false }
  ];
  
  // Extract values from cells
  fieldDefinitions.forEach(field => {
    const value = getCellValue(field.cellAddress);
    headerFields.push({
      label: field.label,
      value: value,
      cellAddress: field.cellAddress,
      isRequired: field.isRequired
    });
  });
  
  // Extract specific fields for file naming
  const serialNumber = getCellValue('B4');
  const robotModel = getCellValue('D3');
  const date = getCellValue('D6');
  
  console.log('Header fields:', headerFields);
  
  return {
    fields: headerFields,
    robotModel,
    serialNumber,
    date
  };
}

/**
 * Parse inspection items from column B, starting at row 8, ending at row 44
 */
function parseInspectionItems(worksheet: ExcelJS.Worksheet): InspectionItem[] {
  const items: InspectionItem[] = [];
  
  const startRow = 8;  // Row 8
  const endRow = 44;   // Row 44
  
  console.log(`Parsing questions from row ${startRow} to ${endRow} in column B`);
  
  for (let rowNum = startRow; rowNum <= endRow; rowNum++) {
    const cell = worksheet.getCell(`B${rowNum}`);
    let description = '';
    
    if (cell && cell.value !== null && cell.value !== undefined) {
      if (typeof cell.value === 'object') {
        if ('richText' in cell.value) {
          description = (cell.value as ExcelJS.CellRichTextValue).richText
            .map(rt => rt.text)
            .join('');
        } else if ('result' in cell.value) {
          description = String(cell.value.result || '');
        } else {
          description = String(cell.value);
        }
      } else {
        description = String(cell.value);
      }
      description = description.trim();
    }
    
    // Skip empty rows
    if (!description) {
      continue;
    }
    
    items.push({
      id: `item-${rowNum}`,
      itemNumber: String(rowNum),
      description: description,
      status: 'pending',
      notes: '',
      rowIndex: rowNum - 1  // 0-indexed for compatibility
    });
    
    console.log(`Row ${rowNum}: "${description.substring(0, 50)}..."`);
  }
  
  console.log(`Total questions parsed: ${items.length}`);
  
  return items;
}
