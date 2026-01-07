// Temporary script to examine Excel file structure
// Run with: node examine-excel.js (after npm install)

const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, 'Example Excel Sheet', 'PDI TQC Sheet rev F_T702_BLANK.xlsx');

try {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  console.log('Sheet Name:', sheetName);
  console.log('\n=== First 20 rows ===');
  
  // Convert to JSON to see structure
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
  
  // Print first 20 rows
  jsonData.slice(0, 20).forEach((row, index) => {
    console.log(`Row ${index + 1}:`, row);
  });
  
  console.log('\n=== Column Headers (Row 1) ===');
  if (jsonData[0]) {
    jsonData[0].forEach((header, index) => {
      console.log(`Column ${index + 1} (${String.fromCharCode(65 + index)}):`, header);
    });
  }
  
  // Try to find header section (typically first few rows)
  console.log('\n=== Header Section Analysis ===');
  for (let i = 0; i < Math.min(10, jsonData.length); i++) {
    const row = jsonData[i];
    if (row.some(cell => cell && typeof cell === 'string' && (cell.includes('Model') || cell.includes('Serial') || cell.includes('Date') || cell.includes('PDI')))) {
      console.log(`Potential header row ${i + 1}:`, row);
    }
  }
  
  // Find data rows (rows with item numbers)
  console.log('\n=== Data Rows (First 5 inspection items) ===');
  let dataRowStart = -1;
  for (let i = 0; i < jsonData.length; i++) {
    const row = jsonData[i];
    // Look for row that might be header row for data (contains "Item" or numbers)
    if (row.some(cell => cell && (cell.toString().toLowerCase().includes('item') || /^\d+$/.test(cell.toString())))) {
      if (dataRowStart === -1) {
        dataRowStart = i;
        console.log(`Data starts at row ${i + 1}:`, row);
      }
      if (i < dataRowStart + 5) {
        console.log(`Row ${i + 1}:`, row);
      }
    }
  }
  
} catch (error) {
  console.error('Error reading Excel file:', error);
}
