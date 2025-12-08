import React, { useState } from 'react';
import { Upload, FileText, X, CheckCircle2, Lock, Shield, FileCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDataStore } from '@/contexts/DataStore';
import { EmailWorkflowService } from '@/lib/notificationService';
import { getCasesByClient, DocumentType } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface UploadedFile {
  id: string;
  file: File;
  type: string;
  caseId?: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

const ClientUpload: React.FC = () => {
  const { user } = useAuth();
  const { cases, addDocument, addNotification } = useDataStore();
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [selectedCase, setSelectedCase] = useState<string>('');
  const [documentType, setDocumentType] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  if (!user) return null;

  const myCases = getCasesByClient(user.id, cases);

  const documentTypes = [
    { value: 'passport', label: 'Passport', description: 'Valid passport copy' },
    { value: 'medical_report', label: 'Medical Report', description: 'Medical reports and test results' },
    { value: 'radiology', label: 'Radiology Images', description: 'X-rays, CT scans, MRI images' },
    { value: 'lab_results', label: 'Lab Results', description: 'Laboratory test results' },
    { value: 'certificate', label: 'Academic Certificate', description: 'Educational certificates and transcripts' },
    { value: 'other', label: 'Other Documents', description: 'Any other relevant documents' },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      type: documentType || 'other',
      caseId: selectedCase || undefined,
      progress: 0,
      status: 'uploading' as const,
    }));

    setUploadedFiles([...uploadedFiles, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((file) => {
      let progress = 0;
      const interval = setInterval(async () => {
        progress += 10;
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? { ...f, progress, status: progress >= 100 ? 'completed' : 'uploading' }
              : f
          )
        );
        if (progress >= 100) {
          clearInterval(interval);
          // Add document to store when upload completes
          if (selectedCase && documentType) {
            addDocument({
              caseId: selectedCase,
              uploaderId: user.id,
              uploaderRole: 'client',
              type: documentType as DocumentType,
              filename: file.file.name,
              size: formatFileSize(file.file.size),
            });
            addNotification({
              userId: 1, // Admin
              title: 'New Document Uploaded',
              message: `${user.name} uploaded ${file.file.name}`,
              type: 'info',
            });

            // Send document received confirmation email
            if (user.email) {
              try {
                await EmailWorkflowService.sendDocumentReceivedConfirmation(
                  user.email,
                  file.file.name
                );
              } catch (error) {
                console.error('Failed to send document confirmation email:', error);
              }
            }
          }
        }
      }, 200);
    });
  };

  const removeFile = (id: string) => {
    setUploadedFiles(uploadedFiles.filter((f) => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Upload Documents</h2>
        <p className="text-muted-foreground">
          Securely upload your documents for case processing. All files are encrypted and stored safely.
        </p>
      </div>

      {/* Security Notice */}
      <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-foreground mb-1">Secure Document Upload</p>
          <p className="text-sm text-muted-foreground">
            Your documents are protected with end-to-end encryption. We use 256-bit encryption and HIPAA-compliant storage.
            All files are automatically scanned for viruses before upload.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-6">
        {/* Case Selection */}
        {myCases.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Case (Optional)
            </label>
            <select
              value={selectedCase}
              onChange={(e) => setSelectedCase(e.target.value)}
              className="input-field"
            >
              <option value="">No specific case - General upload</option>
              {myCases.map((c) => (
                <option key={c.caseId} value={c.caseId}>
                  {c.caseId} - {c.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Document Type */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Document Type <span className="text-destructive">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {documentTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setDocumentType(type.value)}
                className={cn(
                  'p-4 rounded-lg border text-left transition-all',
                  documentType === type.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30'
                )}
              >
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">{type.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Upload Area */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Upload Files <span className="text-destructive">*</span>
          </label>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
              'border-2 border-dashed rounded-xl p-8 text-center transition-all',
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            )}
          >
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="font-medium text-foreground mb-2">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB per file)
            </p>
            <input
              type="file"
              multiple
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
            <label htmlFor="file-upload" className="btn-primary cursor-pointer inline-block">
              Select Files
            </label>
          </div>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div>
            <h3 className="font-medium text-foreground mb-3">Uploaded Files</h3>
            <div className="space-y-2">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                >
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{file.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.file.size)} • {file.type.replace('_', ' ')}
                    </p>
                    {file.status === 'uploading' && (
                      <div className="mt-2 h-1.5 bg-background rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                  {file.status === 'completed' && (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  )}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 rounded hover:bg-background transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4" />
            <span>Files are encrypted during upload</span>
          </div>
          <button
            disabled={uploadedFiles.length === 0 || !documentType}
            className="btn-primary"
            onClick={() => {
              if (uploadedFiles.every(f => f.status === 'completed')) {
                setSubmitSuccess(true);
                setUploadedFiles([]);
                setSelectedCase('');
                setDocumentType('');
                setTimeout(() => setSubmitSuccess(false), 3000);
              }
            }}
          >
            <FileCheck className="w-4 h-4" />
            Submit Documents
          </button>
        </div>
      </div>

      {/* Success Message */}
      {submitSuccess && (
        <div className="bg-success/10 border border-success/20 rounded-xl p-4 flex items-center gap-2 animate-fade-in">
          <FileCheck className="w-5 h-5 text-success" />
          <span className="text-sm text-success font-medium">All documents submitted successfully!</span>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Upload Guidelines</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Ensure all documents are clear and legible</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Upload documents in PDF format when possible</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Maximum file size: 10MB per file</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>All documents are automatically formatted as PDFs after upload</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>You will receive instant notifications when documents are processed</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ClientUpload;

