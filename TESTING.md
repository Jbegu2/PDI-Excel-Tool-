# Testing Guide

## Quick Test

1. **Open the app**: http://localhost:5173/
2. **Upload**: Drag and drop `Example Excel Sheet/PDI TQC Sheet rev F_T702_BLANK.xlsx`
3. **Check console**: Open browser console (F12) to see parsing logs

## Expected Behavior

### After Upload
Console should show:
```
Handling parsed file: {headerInfo: {...}, items: [...], workbook: {...}}
Header info: {fields: Array(8), robotModel: "...", serialNumber: "...", date: "..."}
Items count: XX
Parsing questions from row 8 to 44 in column B
Row 8: "..."
Row 9: "..."
...
Total questions parsed: XX
Parsed header fields: [...]
```

### Header Step
Should display 8 fields:
- Customer Name (B3) - Required
- Serial Number (B4) - Required  
- Box Number (B5)
- Dispatch Location (B6)
- Model (D3) - Required
- Supervisor Name (D4)
- Inspector Name (D5)
- Date (D6)

### Inspection Step
- Shows one question at a time
- Progress indicator shows "Question X of Y"
- Pass button (green) - auto-advances
- Fail button (red) - prompts for notes
- Fully Fail Robot button - skips to review
- Previous Question button (except on first question)

### Review Step
- Shows all questions with status
- Pass/Fail badges (green/red)
- Failed items show notes
- Summary statistics at top
- Edit button for each item

### Initials Step
- Input field for 2-5 letters
- Validates letters only
- Converts to uppercase

### Bonus Question Step
- Two buttons: Robot Passed / Robot Failed
- Selected button highlighted

### Generate Step
- Shows summary of inspection
- Generate Excel File button
- Downloads file with name: `{Model} PDI - {Serial} - {Pass/Fail}.xlsx`

## What to Check

### Excel Output
Open the generated Excel file and verify:
1. **Header fields** (B3-B6, D3-D6) are filled with your input
2. **Column C** has Pass/Fail for each question row (8-44)
3. **Column D** has notes for failed items
4. **Cell F3** has inspector initials
5. **Filename** follows format: `{Model} PDI - {Serial} - {Pass/Fail}.xlsx`

## Common Issues

### No questions found
- Check console for "Total questions parsed: 0"
- Verify Excel has text in column B, rows 8-44
- Try examining the Excel file structure

### Header fields empty
- Check if Excel has values in B3-B6 and D3-D6
- Look for console logs showing parsed header fields
- Verify cell addresses are correct

### Excel generation fails
- Check console for errors
- Verify originalWorkbook is present in data
- Check that all required fields are filled

## Debug Mode

To see detailed logs:
1. Open browser console (F12)
2. Upload Excel file
3. Look for console.log messages showing:
   - Parsed file structure
   - Header fields
   - Question count and content
   - Each step of the process

## Test Data

For testing, you can use these values:
- Customer Name: "Test Customer"
- Serial Number: "596"
- Box Number: "Box-001"
- Dispatch Location: "Warehouse A"
- Model: "T702"
- Supervisor Name: "John Smith"
- Inspector Name: "Jane Doe"
- Date: "2024-01-15"
- Inspector Initials: "JD"

Expected filename: `T702 PDI - 596 - Pass.xlsx` (or Fail)
