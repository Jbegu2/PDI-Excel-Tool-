# PDI Inspection Sheet Web App

A React + TypeScript web application for conducting robotics inspections with Excel template integration.

## Features

- **Upload Excel Template**: Drag-and-drop or browse to upload inspection sheet templates
- **Header Information**: Fill in robot model, serial number, and other header fields
- **Step-by-Step Inspection**: Review inspection items one at a time with pass/fail options
- **Failure Notes**: Add detailed notes for failed items
- **Fully Fail Option**: Quickly fail remaining items if robot fails critical inspection
- **Review & Edit**: Review all answers before finalizing
- **Inspector Initials**: Capture inspector signature
- **Final Pass/Fail**: Overall robot status determination
- **Excel Generation**: Download completed inspection sheet with proper naming

## Design

- **ABB-Inspired Colors**: Red (#E2001A), White, Black color scheme
- **Apple-Style UI**: Clean, modern interface with rounded corners and generous spacing
- **Responsive**: Works on desktop, tablet, and mobile devices

## File Naming

Output files are automatically named: `(robot model) PDI - (serial number) - (Pass or Fail).xlsx`

Example: `T702 PDI - 596 - Fail.xlsx`

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Usage

1. **Upload Template**: Start by uploading your blank Excel inspection template
2. **Fill Header**: Enter robot model, serial number, date, and other required information
3. **Conduct Inspection**: Go through each inspection item:
   - Click **Pass** to mark as passed (auto-advances)
   - Click **Fail** to add notes and mark as failed
   - Click **Fully Fail Robot** to skip remaining items and fail the inspection
4. **Review**: Check all answers and edit if needed
5. **Enter Initials**: Provide your inspector initials
6. **Final Status**: Indicate if the robot passed or failed overall
7. **Generate Excel**: Download the completed inspection sheet

## Excel Template Structure

The app reads from specific cells:

### Header Information (Row 3-6)
- **B3**: Customer Name
- **B4**: Serial Number
- **B5**: Box Number
- **B6**: Dispatch Location
- **D3**: Model
- **D4**: Supervisor Name
- **D5**: Inspector Name
- **D6**: Date

### Inspection Questions
- **Column B, Rows 8-44**: Question descriptions
- **Column C**: Pass/Fail status (filled by app)
- **Column D**: Notes (filled by app for failed items)

### Output
- Inspector initials written to **F3**
- Pass/Fail status written to **Column C** for each question
- Notes written to **Column D** for failed items

## Troubleshooting

### Blank Screen After Upload

1. Open browser console (F12 → Console tab)
2. Look for error messages or parsing logs
3. Check that your Excel file has:
   - At least one sheet
   - A header row with column names
   - Data rows with inspection items

### No Items Found

- Ensure your Excel has a row with "Item" and "Description" columns
- Check that data rows follow the header row
- Verify items have either an item number or description

### Header Fields Not Detected

- Header fields should be in the first 15 rows
- Format: Label in one cell, value in the next cell
- Common labels: "Model", "Serial", "Date"

## Technical Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **SheetJS (xlsx)** for Excel file processing
- **CSS Modules** for styling
- **localStorage** for state persistence

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Deployment

### Deploy to Vercel

This app is configured for easy deployment to Vercel:

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite configuration
   - Click "Deploy"

3. **Automatic Deployments**:
   - Every push to `main` branch triggers a new deployment
   - Preview deployments are created for pull requests
   - Previous deployments can be rolled back from Vercel dashboard

### Vercel Configuration

The app includes `vercel.json` with:
- SPA routing configuration (all routes serve index.html)
- Security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
- Build settings (auto-detected from Vite)

### Access Control

- **Public Access**: The app is publicly accessible by default
- **Password Protection**: Available via Vercel team plan features
- **Custom Domain**: Can be configured in Vercel dashboard

### Security Notes

- All Excel processing happens client-side (no file uploads to server)
- No backend API calls (no CORS or server-side vulnerabilities)
- HTTPS enforced automatically by Vercel
- localStorage data stays on user's device (not shared)

## License

Proprietary - All rights reserved
