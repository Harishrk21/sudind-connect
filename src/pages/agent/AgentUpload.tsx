import React, { useState } from 'react';
import { Upload, FileText, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useDataStore } from '@/contexts/DataStore';
import { EmailWorkflowService } from '@/lib/notificationService';
import { getCasesByAgent, DocumentType } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const AgentUpload: React.FC = () => {
  const { user } = useAuth();
  const { cases, addDocument, addNotification } = useDataStore();
  const [selectedCase, setSelectedCase] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType>('medical_report');
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  if (!user) return null;

  const myCases = getCasesByAgent(user.id, cases);

  const documentTypes: { value: DocumentType; label: string }[] = [
    { value: 'medical_report', label: 'Medical Report' },
    { value: 'radiology', label: 'Radiology Images' },
    { value: 'lab_results', label: 'Lab Results' },
    { value: 'admission_letter', label: 'Admission Letter' },
    { value: 'certificate', label: 'Certificate' },
    { value: 'invoice', label: 'Invoice' },
    { value: 'other', label: 'Other' },
  ];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!selectedCase || files.length === 0) return;
    
    setUploading(true);
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add documents to store
    files.forEach((file) => {
      addDocument({
        caseId: selectedCase,
        uploaderId: user.id,
        uploaderRole: 'agent',
        type: documentType,
        filename: file.name,
        size: formatFileSize(file.size),
      });
    });

    addNotification({
      userId: 1, // Admin
      title: 'Documents Uploaded',
      message: `${user.name} uploaded ${files.length} document(s) for case ${selectedCase}`,
      type: 'info',
    });

    // Send notification emails to admin and client
    try {
      const { EmailWorkflowService } = await import('@/lib/notificationService');
      // In a real app, we would get the client email from the case
      // For now, this is a placeholder
    } catch (error) {
      console.error('Failed to send notification emails:', error);
    }

    setUploading(false);
    setUploadSuccess(true);
    setFiles([]);
    
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success message */}
      {uploadSuccess && (
        <div className="flex items-center gap-3 p-4 bg-success/10 border border-success/20 rounded-xl text-success animate-fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">Documents uploaded successfully!</span>
        </div>
      )}

      {/* Case selection */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Select Case</h3>
        <select
          value={selectedCase}
          onChange={(e) => setSelectedCase(e.target.value)}
          className="input-field"
        >
          <option value="">Choose a case...</option>
          {myCases.map((c) => (
            <option key={c.caseId} value={c.caseId}>
              {c.caseId} - {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* Document type */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Document Type</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {documentTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setDocumentType(type.value)}
              className={cn(
                'p-3 rounded-lg border text-sm font-medium transition-all text-left',
                documentType === type.value
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border hover:border-primary/30'
              )}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Upload area */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Upload Files</h3>
        
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors"
        >
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-foreground font-medium mb-2">
            Drag and drop files here
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            or click to browse
          </p>
          <label className="btn-secondary cursor-pointer">
            Browse Files
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 rounded hover:bg-background transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={!selectedCase || files.length === 0 || uploading}
        className="btn-primary w-full"
      >
        {uploading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Uploading...
          </span>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            Upload {files.length > 0 ? `${files.length} file${files.length > 1 ? 's' : ''}` : 'Documents'}
          </>
        )}
      </button>

      {/* Info */}
      <div className="flex items-start gap-3 p-4 bg-muted rounded-xl">
        <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Upload Guidelines</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Accepted formats: PDF, JPG, PNG, DICOM</li>
            <li>Maximum file size: 20MB per file</li>
            <li>Ensure documents are clear and readable</li>
            <li>Medical reports should include patient name and date</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AgentUpload;
