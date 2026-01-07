# Excel Template Structure

## Current Implementation

### Header Fields (Read from specific cells)

| Field | Cell | Required |
|-------|------|----------|
| Customer Name | B3 | Yes |
| Serial Number | B4 | Yes |
| Box Number | B5 | No |
| Dispatch Location | B6 | No |
| Model | D3 | Yes |
| Supervisor Name | D4 | No |
| Inspector Name | D5 | No |
| Date | D6 | No |

### Inspection Questions

- **Location**: Column B, Rows 8-44 (cells B8 through B44)
- **Total Questions**: Up to 37 questions (rows 8-44)
- **Format**: Each cell contains the question text

### Output Columns

- **Column C**: Pass/Fail status
  - "Y" for passed items
  - "X" for failed items
- **Column D**: Notes (only filled for failed items)
- **Column E**: Inspector initials (added to each row with an answered question)

## File Naming Convention

Format: `{Model} PDI - {Serial Number} - {Pass/Fail}.xlsx`

Example: `T702 PDI - 596 - Fail.xlsx`

Where:
- **Model**: Value from cell D3
- **Serial Number**: Value from cell B4
- **Pass/Fail**: Result from bonus question (overall robot status)

## Workflow

1. **Upload**: User uploads blank Excel template
2. **Parse**: App reads:
   - Header fields from B3-B6 and D3-D6
   - Questions from B8-B44
3. **Fill Header**: User fills in all header information
4. **Inspection**: User goes through each question:
   - Pass: Auto-advances to next question
   - Fail: Prompts for notes, then advances
   - Fully Fail: Marks all remaining as failed, skips to review
5. **Review**: User reviews all answers
6. **Initials**: User enters inspector initials
7. **Bonus Question**: User indicates overall pass/fail
8. **Generate**: App creates Excel file with:
   - Header fields written to original cells
   - Y/X in column C (Y = pass, X = fail)
   - Notes in column D (for failed items)
   - Inspector initials in column E (for each answered row)

## Future Considerations

### Variable Question Ranges
Currently hardcoded to rows 8-44. Future versions could:
- Detect the last question row automatically
- Support different models with different question counts
- Handle multiple question sections

### Variable Columns
Currently assumes:
- Questions in column B
- Pass/Fail in column C
- Notes in column D

Future versions could detect these columns automatically.

### Multiple Sheets
Currently only processes the first sheet. Future versions could:
- Support multi-sheet templates
- Allow user to select which sheet to process

### Revision Detection
Currently assumes revision F structure. Future versions could:
- Detect revision from template
- Adjust parsing based on revision
- Support multiple template formats
