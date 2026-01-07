import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { InspectionData } from '../types/inspection';

/**
 * Generate Excel file from inspection data
 * Uses ExcelJS which preserves all original formatting
 * 
 * File naming: (robot model) PDI - (serial number) - (Pass or Fail).xlsx
 */
export async function generateExcelFile(data: InspectionData): Promise<void> {
  if (!data.originalWorkbook) {
    throw new Error('Original workbook not found');
  }
  
  console.log('Generating Excel file with ExcelJS...');
  
  // The workbook is already an ExcelJS workbook - we just need to modify it
  const workbook = data.originalWorkbook as ExcelJS.Workbook;
  const worksheet = workbook.worksheets[0];
  
  if (!worksheet) {
    throw new Error('No worksheet found in workbook');
  }
  
  console.log('Working with worksheet:', worksheet.name);
  
  // Debug: Check if images exist before writing
  const images = worksheet.getImages();
  console.log('Images in worksheet before write:', images.length);
  if (images.length > 0) {
    images.forEach((img, idx) => {
      console.log(`Image ${idx}:`, img);
    });
  } else {
    console.warn('⚠️ No images found in worksheet - logo may be missing');
  }
  
  // Update header fields in their specific cells
  // Only update the VALUE, not the formatting
  data.headerInfo.fields.forEach(field => {
    if (field.cellAddress && field.value) {
      const cell = worksheet.getCell(field.cellAddress);
      console.log(`Setting ${field.cellAddress} = "${field.value}"`);
      // Set only the value, preserving all other cell properties
      cell.value = field.value;
    }
  });
  
  // Update inspection items
  // Y/X in column C, Notes in column D, Initials in column E
  data.items.forEach(item => {
    const rowNum = item.rowIndex + 1; // Convert 0-indexed to 1-indexed
    
    // Set Y (pass) or X (fail) in column C
    if (item.status !== 'pending') {
      const passFailCell = worksheet.getCell(`C${rowNum}`);
      const statusValue = item.status === 'pass' ? 'Y' : 'X';
      console.log(`Setting C${rowNum} = "${statusValue}"`);
      passFailCell.value = statusValue;
      
      // Add inspector initials to column E for each answered question
      if (data.inspectorInitials) {
        const initialsCell = worksheet.getCell(`E${rowNum}`);
        console.log(`Setting E${rowNum} = "${data.inspectorInitials}"`);
        initialsCell.value = data.inspectorInitials;
      }
    }
    
    // Set notes in column D if failed
    if (item.status === 'fail' && item.notes) {
      const notesCell = worksheet.getCell(`D${rowNum}`);
      console.log(`Setting D${rowNum} = "${item.notes.substring(0, 30)}..."`);
      notesCell.value = item.notes;
    }
  });
  
  // Generate filename
  const filename = generateFilename(data);
  console.log(`Generating file: ${filename}`);
  
  // Write to buffer and download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  
  saveAs(blob, filename);
  
  console.log('✅ Excel file generated and downloaded successfully');
}

/**
 * Generate filename based on header info and bonus question answer
 * Format: (robot model) PDI - (serial number) - (Pass or Fail).xlsx
 */
function generateFilename(data: InspectionData): string {
  const robotModel = data.headerInfo.robotModel || 'Unknown';
  const serialNumber = data.headerInfo.serialNumber || 'Unknown';
  const passFail = data.bonusQuestionAnswer === 'pass' ? 'Pass' : 
                   data.bonusQuestionAnswer === 'fail' ? 'Fail' : 'Pending';
  
  // Clean up values for filename (remove invalid characters)
  const cleanModel = robotModel.replace(/[<>:"/\\|?*]/g, '').trim();
  const cleanSerial = serialNumber.replace(/[<>:"/\\|?*]/g, '').trim();
  
  return `${cleanModel} PDI - ${cleanSerial} - ${passFail}.xlsx`;
}
