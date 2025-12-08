import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Types for document data
export interface InvoiceData {
  invoiceId: string;
  caseId: string;
  amount: number;
  currency: string;
  status: string;
  issuedAt: string;
  paidAt?: string;
  dueDate: string;
  description: string;
  clientName?: string;
}

export interface ReportData {
  title: string;
  type: string;
  period?: string;
  data?: Record<string, any>;
}

export interface DocumentData {
  filename: string;
  type: string;
  caseId?: string;
  uploadedAt?: string;
  size?: string;
  caseTitle?: string;
}

/**
 * Generates PDF content for an invoice
 */
function generateInvoicePDF(data: InvoiceData): string {
  const lines = [
    'INVOICE',
    '',
    `Invoice ID: ${data.invoiceId}`,
    `Case ID: ${data.caseId}`,
    data.clientName ? `Client: ${data.clientName}` : '',
    '',
    `Description: ${data.description}`,
    '',
    `Amount: ${data.currency} ${data.amount.toLocaleString()}`,
    `Status: ${data.status.toUpperCase()}`,
    `Issued Date: ${new Date(data.issuedAt).toLocaleDateString()}`,
    `Due Date: ${new Date(data.dueDate).toLocaleDateString()}`,
    data.paidAt ? `Paid Date: ${new Date(data.paidAt).toLocaleDateString()}` : '',
    '',
    'Thank you for your business!',
  ].filter(Boolean);

  return generateTextPDF(lines);
}

/**
 * Generates PDF content for a report
 */
function generateReportPDF(data: ReportData): string {
  const lines = [
    data.title.toUpperCase(),
    '',
    `Report Type: ${data.type}`,
    data.period ? `Period: ${data.period}` : '',
    '',
    'Report Summary:',
    '',
    data.data ? Object.entries(data.data).map(([key, value]) => `${key}: ${value}`).join('\n') : '',
    '',
    'Generated on: ' + new Date().toLocaleDateString(),
    '',
    'This is a sample report document with relevant data.',
  ].filter(Boolean);

  return generateTextPDF(lines);
}

/**
 * Generates PDF content for a document
 */
function generateDocumentPDF(data: DocumentData): string {
  const lines = [
    'DOCUMENT',
    '',
    `Filename: ${data.filename}`,
    `Type: ${data.type.replace(/_/g, ' ').toUpperCase()}`,
    data.caseId ? `Case ID: ${data.caseId}` : '',
    data.caseTitle ? `Case: ${data.caseTitle}` : '',
    data.uploadedAt ? `Uploaded: ${new Date(data.uploadedAt).toLocaleDateString()}` : '',
    data.size ? `Size: ${data.size}` : '',
    '',
    'Document Content:',
    '',
    'This is a sample document file with related case information.',
    'The actual document would contain the full content here.',
  ].filter(Boolean);

  return generateTextPDF(lines);
}

/**
 * Generates a simple PDF from text lines
 */
function generateTextPDF(lines: string[]): string {
  // Escape special characters for PDF text strings
  const escapePDFText = (text: string): string => {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)')
      .split('')
      .map(char => {
        const code = char.charCodeAt(0);
        // Escape non-printable and special characters
        if (code < 32 || code > 126) {
          return `\\${code.toString(8).padStart(3, '0')}`;
        }
        return char;
      })
      .join('');
  };

  // Build PDF text content with proper positioning
  const textContent = lines
    .map((line, index) => {
      const escapedLine = escapePDFText(line);
      const yPos = 750 - (index * 20); // Position each line
      return `BT\n/F1 12 Tf\n50 ${yPos} Td\n(${escapedLine}) Tj\nET`;
    })
    .join('\n');

  const streamContent = textContent;
  const streamLength = streamContent.length;
  
  // Calculate startxref position (base position + stream length)
  const baseXref = 556;
  const startxref = baseXref + streamLength;
  
  return `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 <<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
>>
>>
>>
endobj
4 0 obj
<<
/Length ${streamLength}
>>
stream
${streamContent}
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000306 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
${startxref}
%%EOF`;
}

/**
 * Downloads a demo file with related sample data.
 * @param filename - Custom filename for the download
 * @param type - Type of document: 'invoice', 'report', 'document', or 'default'
 * @param data - Related data for the document
 */
export function downloadDemoFile(
  filename?: string,
  type: 'invoice' | 'report' | 'document' | 'default' = 'default',
  data?: InvoiceData | ReportData | DocumentData
) {
  const defaultFilename = filename || 'demo-document.pdf';
  let pdfContent: string;

  switch (type) {
    case 'invoice':
      pdfContent = data ? generateInvoicePDF(data as InvoiceData) : generateTextPDF(['INVOICE', '', 'Sample invoice document']);
      break;
    case 'report':
      pdfContent = data ? generateReportPDF(data as ReportData) : generateTextPDF(['REPORT', '', 'Sample report document']);
      break;
    case 'document':
      pdfContent = data ? generateDocumentPDF(data as DocumentData) : generateTextPDF(['DOCUMENT', '', 'Sample document file']);
      break;
    default:
      pdfContent = generateTextPDF(['Demo Document', '', 'This is a sample document for download demonstration.', 'You can use this file to test the download functionality.']);
  }

  // Create a blob and download it
  const blob = new Blob([pdfContent], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = defaultFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}