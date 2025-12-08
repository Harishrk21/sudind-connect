// Types
export type UserRole = 'admin' | 'agent' | 'client';
export type ClientType = 'patient' | 'student' | 'visitor';
export type CaseType = 'medical' | 'academic';
export type CaseStatus = 'new' | 'review' | 'pending' | 'approved' | 'under_treatment' | 'under_admission' | 'completed' | 'closed';
export type DocumentType = 'medical_report' | 'radiology' | 'lab_results' | 'admission_letter' | 'certificate' | 'passport' | 'invoice' | 'other';

export interface User {
  id: number;
  role: UserRole;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  phone?: string;
  clientType?: ClientType;
  country?: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

export interface Case {
  caseId: string;
  clientId: number;
  agentId: number;
  type: CaseType;
  status: CaseStatus;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  estimatedCost?: number;
  hospital?: string;
  university?: string;
}

export interface Document {
  docId: number;
  caseId: string;
  uploaderId: number;
  uploaderRole: UserRole;
  type: DocumentType;
  filename: string;
  uploadedAt: string;
  size: string;
}

export interface Invoice {
  invoiceId: string;
  caseId: string;
  clientId: number;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'overdue';
  issuedAt: string;
  paidAt?: string;
  dueDate: string;
  description: string;
}

export interface Message {
  msgId: number;
  senderId: number;
  receiverId: number;
  caseId?: string;
  text: string;
  sentAt: string;
  read: boolean;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface Contract {
  contractId: string;
  caseId: string;
  clientId: number;
  agentId: number;
  type: 'medical' | 'academic';
  status: 'draft' | 'active' | 'expired' | 'archived';
  title: string;
  terms: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  archivedAt?: string;
}

export interface AIProcessing {
  id: number;
  caseId: string;
  documentId: number;
  type: 'ocr' | 'medical_extraction' | 'certificate_verification' | 'radiology_analysis';
  status: 'processing' | 'completed' | 'failed';
  extractedData?: Record<string, any>;
  confidence: number;
  processedAt: string;
}

export interface Hospital {
  id: number;
  name: string;
  city: string;
  country: string;
  specialties: string[];
  rating: number;
  integrationStatus: 'connected' | 'pending' | 'disconnected';
}

export interface University {
  id: number;
  name: string;
  city: string;
  country: string;
  programs: string[];
  rating: number;
  integrationStatus: 'connected' | 'pending' | 'disconnected';
}

export interface PaymentMethod {
  id: string;
  type: 'mobile_money' | 'bank_card' | 'bank_transfer';
  name: string;
  enabled: boolean;
}

// Mock Users
export const users: User[] = [
  {
    id: 1,
    role: 'admin',
    name: 'Dr. Hassan Mohammed',
    email: 'admin@sudind.com',
    password: 'Admin123!',
    phone: '+249 912 345 678',
    country: 'Sudan',
    createdAt: '2024-01-15',
    status: 'active',
  },
  {
    id: 2,
    role: 'agent',
    name: 'Rajesh Kumar',
    email: 'agent1@indigo.com',
    password: 'Agent123!',
    phone: '+91 98765 43210',
    country: 'India',
    createdAt: '2024-02-01',
    status: 'active',
  },
  {
    id: 3,
    role: 'agent',
    name: 'Priya Sharma',
    email: 'agent2@indigo.com',
    password: 'Agent123!',
    phone: '+91 98765 43211',
    country: 'India',
    createdAt: '2024-02-15',
    status: 'active',
  },
  {
    id: 4,
    role: 'agent',
    name: 'Amit Patel',
    email: 'agent3@indigo.com',
    password: 'Agent123!',
    phone: '+91 98765 43212',
    country: 'India',
    createdAt: '2024-03-01',
    status: 'inactive',
  },
  {
    id: 5,
    role: 'client',
    clientType: 'patient',
    name: 'Ali Ahmed Hassan',
    email: 'ali@gmail.com',
    password: 'Client123!',
    phone: '+249 912 111 222',
    country: 'Sudan',
    createdAt: '2024-11-10',
    status: 'active',
  },
  {
    id: 6,
    role: 'client',
    clientType: 'patient',
    name: 'Fatima Osman',
    email: 'fatima@gmail.com',
    password: 'Client123!',
    phone: '+249 912 333 444',
    country: 'Sudan',
    createdAt: '2024-11-15',
    status: 'active',
  },
  {
    id: 7,
    role: 'client',
    clientType: 'student',
    name: 'Sara Hussein',
    email: 'sara@gmail.com',
    password: 'Client123!',
    phone: '+249 912 555 666',
    country: 'Sudan',
    createdAt: '2024-11-18',
    status: 'active',
  },
  {
    id: 8,
    role: 'client',
    clientType: 'student',
    name: 'Mohammed Ibrahim',
    email: 'mohammed@gmail.com',
    password: 'Client123!',
    phone: '+249 912 777 888',
    country: 'Sudan',
    createdAt: '2024-11-20',
    status: 'active',
  },
  {
    id: 9,
    role: 'client',
    clientType: 'visitor',
    name: 'Amina Khalid',
    email: 'amina@gmail.com',
    password: 'Client123!',
    phone: '+249 912 999 000',
    country: 'Sudan',
    createdAt: '2024-11-25',
    status: 'active',
  },
];

// Mock Cases
export const cases: Case[] = [
  {
    caseId: 'MED-001',
    clientId: 5,
    agentId: 2,
    type: 'medical',
    status: 'under_treatment',
    title: 'Cardiac Evaluation & Treatment',
    description: 'Patient requires comprehensive cardiac evaluation and potential bypass surgery. Initial reports indicate coronary artery disease.',
    createdAt: '2024-11-20',
    updatedAt: '2024-12-05',
    estimatedCost: 25000,
    hospital: 'Apollo Hospitals, Chennai',
  },
  {
    caseId: 'MED-002',
    clientId: 6,
    agentId: 2,
    type: 'medical',
    status: 'approved',
    title: 'Orthopedic Surgery - Knee Replacement',
    description: 'Patient requires total knee replacement surgery. Pre-operative assessments completed.',
    createdAt: '2024-11-22',
    updatedAt: '2024-12-03',
    estimatedCost: 15000,
    hospital: 'Fortis Hospital, Delhi',
  },
  {
    caseId: 'MED-003',
    clientId: 5,
    agentId: 3,
    type: 'medical',
    status: 'completed',
    title: 'ENT Consultation',
    description: 'Chronic sinusitis treatment and follow-up consultation completed successfully.',
    createdAt: '2024-10-15',
    updatedAt: '2024-11-20',
    estimatedCost: 3500,
    hospital: 'Max Healthcare, Mumbai',
  },
  {
    caseId: 'ACAD-001',
    clientId: 7,
    agentId: 3,
    type: 'academic',
    status: 'approved',
    title: 'MBBS Admission Application',
    description: 'Student applying for MBBS program. All documents verified and admission confirmed.',
    createdAt: '2024-11-22',
    updatedAt: '2024-11-30',
    estimatedCost: 45000,
    university: 'Manipal University',
  },
  {
    caseId: 'ACAD-002',
    clientId: 8,
    agentId: 2,
    type: 'academic',
    status: 'review',
    title: 'Engineering Admission - Computer Science',
    description: 'Application for B.Tech Computer Science program. Academic transcripts under review.',
    createdAt: '2024-11-28',
    updatedAt: '2024-12-04',
    estimatedCost: 35000,
    university: 'VIT University',
  },
  {
    caseId: 'ACAD-003',
    clientId: 7,
    agentId: 3,
    type: 'academic',
    status: 'under_admission',
    title: 'MBA Admission',
    description: 'MBA admission process ongoing. Visa documentation in progress.',
    createdAt: '2024-11-10',
    updatedAt: '2024-12-01',
    estimatedCost: 55000,
    university: 'IIM Bangalore',
  },
  {
    caseId: 'MED-004',
    clientId: 6,
    agentId: 2,
    type: 'medical',
    status: 'pending',
    title: 'Oncology Consultation',
    description: 'Initial consultation for cancer screening and diagnosis. Awaiting biopsy results.',
    createdAt: '2024-12-01',
    updatedAt: '2024-12-06',
    estimatedCost: 8000,
    hospital: 'Tata Memorial Hospital, Mumbai',
  },
  {
    caseId: 'MED-005',
    clientId: 9,
    agentId: 3,
    type: 'medical',
    status: 'new',
    title: 'General Health Checkup',
    description: 'Comprehensive health checkup package including all major diagnostics.',
    createdAt: '2024-12-06',
    updatedAt: '2024-12-06',
    estimatedCost: 1500,
    hospital: 'Apollo Hospitals, Hyderabad',
  },
];

// Mock Documents
export const documents: Document[] = [
  { docId: 101, caseId: 'MED-001', uploaderId: 2, uploaderRole: 'agent', type: 'medical_report', filename: 'ali_cardiac_report.pdf', uploadedAt: '2024-11-21', size: '2.4 MB' },
  { docId: 102, caseId: 'MED-001', uploaderId: 2, uploaderRole: 'agent', type: 'radiology', filename: 'ali_ecg_scan.pdf', uploadedAt: '2024-11-22', size: '5.1 MB' },
  { docId: 103, caseId: 'MED-001', uploaderId: 5, uploaderRole: 'client', type: 'passport', filename: 'ali_passport.pdf', uploadedAt: '2024-11-20', size: '1.2 MB' },
  { docId: 104, caseId: 'MED-002', uploaderId: 2, uploaderRole: 'agent', type: 'medical_report', filename: 'fatima_ortho_report.pdf', uploadedAt: '2024-11-23', size: '1.8 MB' },
  { docId: 105, caseId: 'MED-002', uploaderId: 2, uploaderRole: 'agent', type: 'lab_results', filename: 'fatima_blood_tests.pdf', uploadedAt: '2024-11-24', size: '0.8 MB' },
  { docId: 106, caseId: 'ACAD-001', uploaderId: 3, uploaderRole: 'agent', type: 'admission_letter', filename: 'sara_admission_letter.pdf', uploadedAt: '2024-11-25', size: '0.5 MB' },
  { docId: 107, caseId: 'ACAD-001', uploaderId: 7, uploaderRole: 'client', type: 'certificate', filename: 'sara_academic_transcript.pdf', uploadedAt: '2024-11-23', size: '1.1 MB' },
  { docId: 108, caseId: 'ACAD-002', uploaderId: 8, uploaderRole: 'client', type: 'certificate', filename: 'mohammed_high_school_cert.pdf', uploadedAt: '2024-11-28', size: '0.9 MB' },
  { docId: 109, caseId: 'MED-003', uploaderId: 3, uploaderRole: 'agent', type: 'invoice', filename: 'ali_ent_invoice.pdf', uploadedAt: '2024-11-18', size: '0.3 MB' },
  { docId: 110, caseId: 'MED-004', uploaderId: 6, uploaderRole: 'client', type: 'medical_report', filename: 'fatima_initial_report.pdf', uploadedAt: '2024-12-02', size: '1.5 MB' },
];

// Mock Invoices
export const invoices: Invoice[] = [
  {
    invoiceId: 'INV-1001',
    caseId: 'MED-001',
    clientId: 5,
    amount: 5000,
    currency: 'USD',
    status: 'paid',
    issuedAt: '2024-11-22',
    paidAt: '2024-11-23',
    dueDate: '2024-12-07',
    description: 'Initial consultation and diagnostic fees',
  },
  {
    invoiceId: 'INV-1002',
    caseId: 'MED-001',
    clientId: 5,
    amount: 20000,
    currency: 'USD',
    status: 'pending',
    issuedAt: '2024-12-01',
    dueDate: '2024-12-15',
    description: 'Cardiac bypass surgery fees',
  },
  {
    invoiceId: 'INV-1003',
    caseId: 'MED-002',
    clientId: 6,
    amount: 15000,
    currency: 'USD',
    status: 'pending',
    issuedAt: '2024-12-03',
    dueDate: '2024-12-18',
    description: 'Knee replacement surgery package',
  },
  {
    invoiceId: 'INV-1004',
    caseId: 'ACAD-001',
    clientId: 7,
    amount: 12000,
    currency: 'USD',
    status: 'paid',
    issuedAt: '2024-11-26',
    paidAt: '2024-11-28',
    dueDate: '2024-12-10',
    description: 'First semester tuition fees',
  },
  {
    invoiceId: 'INV-1005',
    caseId: 'MED-003',
    clientId: 5,
    amount: 3500,
    currency: 'USD',
    status: 'paid',
    issuedAt: '2024-11-15',
    paidAt: '2024-11-16',
    dueDate: '2024-11-30',
    description: 'ENT treatment complete package',
  },
];

// Mock Messages
export const messages: Message[] = [
  { msgId: 1, senderId: 2, receiverId: 1, caseId: 'MED-001', text: 'Cardiac report uploaded for review. Please check the patient status.', sentAt: '2024-11-21T10:15:00Z', read: true },
  { msgId: 2, senderId: 1, receiverId: 2, caseId: 'MED-001', text: 'Report reviewed. Please proceed with hospital booking.', sentAt: '2024-11-21T11:30:00Z', read: true },
  { msgId: 3, senderId: 2, receiverId: 5, caseId: 'MED-001', text: 'Your appointment has been scheduled at Apollo Hospitals for Dec 10th.', sentAt: '2024-11-25T09:00:00Z', read: true },
  { msgId: 4, senderId: 5, receiverId: 2, caseId: 'MED-001', text: 'Thank you! I will prepare the required documents.', sentAt: '2024-11-25T10:30:00Z', read: true },
  { msgId: 5, senderId: 3, receiverId: 7, caseId: 'ACAD-001', text: 'Your admission letter has been received. Congratulations!', sentAt: '2024-11-25T14:00:00Z', read: true },
  { msgId: 6, senderId: 7, receiverId: 3, caseId: 'ACAD-001', text: 'This is wonderful news! What are the next steps?', sentAt: '2024-11-25T15:00:00Z', read: false },
  { msgId: 7, senderId: 1, receiverId: 3, text: 'Please prioritize the academic cases for this month.', sentAt: '2024-12-01T08:00:00Z', read: true },
  { msgId: 8, senderId: 6, receiverId: 2, caseId: 'MED-004', text: 'When can I expect the biopsy results?', sentAt: '2024-12-05T11:00:00Z', read: false },
];

// Mock Notifications
export const notifications: Notification[] = [
  { id: 1, userId: 1, title: 'New Case Created', message: 'A new medical case MED-005 has been submitted.', type: 'info', read: false, createdAt: '2024-12-06T08:00:00Z' },
  { id: 2, userId: 1, title: 'Payment Received', message: 'Payment of $3,500 received for case MED-003.', type: 'success', read: false, createdAt: '2024-12-05T16:30:00Z' },
  { id: 3, userId: 2, title: 'Document Required', message: 'Additional documents needed for case MED-002.', type: 'warning', read: true, createdAt: '2024-12-04T10:00:00Z' },
  { id: 4, userId: 5, title: 'Appointment Confirmed', message: 'Your appointment at Apollo Hospitals is confirmed.', type: 'success', read: true, createdAt: '2024-12-03T14:00:00Z' },
  { id: 5, userId: 7, title: 'Admission Approved', message: 'Your MBBS admission has been approved!', type: 'success', read: false, createdAt: '2024-12-02T09:00:00Z' },
];

// Helper functions (for backward compatibility - use DataStore in components)
export const getUserById = (id: number, usersList?: User[]): User | undefined => {
  const usersToSearch = usersList || users;
  return usersToSearch.find(u => u.id === id);
};
export const getCaseById = (caseId: string, casesList?: Case[]): Case | undefined => {
  const casesToSearch = casesList || cases;
  return casesToSearch.find(c => c.caseId === caseId);
};
export const getDocumentsByCase = (caseId: string, documentsList?: Document[]): Document[] => {
  const docsToSearch = documentsList || documents;
  return docsToSearch.filter(d => d.caseId === caseId);
};
export const getInvoicesByCase = (caseId: string, invoicesList?: Invoice[]): Invoice[] => {
  const invsToSearch = invoicesList || invoices;
  return invsToSearch.filter(i => i.caseId === caseId);
};
export const getMessagesByUser = (userId: number, messagesList?: Message[]): Message[] => {
  const msgsToSearch = messagesList || messages;
  return msgsToSearch.filter(m => m.senderId === userId || m.receiverId === userId);
};
export const getNotificationsByUser = (userId: number, notificationsList?: Notification[]): Notification[] => {
  const notifsToSearch = notificationsList || notifications;
  return notifsToSearch.filter(n => n.userId === userId);
};
export const getCasesByClient = (clientId: number, casesList?: Case[]): Case[] => {
  const casesToSearch = casesList || cases;
  return casesToSearch.filter(c => c.clientId === clientId);
};
export const getCasesByAgent = (agentId: number, casesList?: Case[]): Case[] => {
  const casesToSearch = casesList || cases;
  return casesToSearch.filter(c => c.agentId === agentId);
};
export const getClientsByAgent = (agentId: number, casesList?: Case[]): number[] => {
  const casesToSearch = casesList || cases;
  return [...new Set(casesToSearch.filter(c => c.agentId === agentId).map(c => c.clientId))];
};

// Status utilities
export const getStatusLabel = (status: CaseStatus): string => {
  const labels: Record<CaseStatus, string> = {
    new: 'New',
    review: 'Under Review',
    pending: 'Pending',
    approved: 'Approved',
    under_treatment: 'Under Treatment',
    under_admission: 'Under Admission',
    completed: 'Completed',
    closed: 'Closed',
  };
  return labels[status];
};

export const getStatusClass = (status: CaseStatus): string => {
  const classes: Record<CaseStatus, string> = {
    new: 'status-new',
    review: 'status-review',
    pending: 'status-pending',
    approved: 'status-approved',
    under_treatment: 'status-treatment',
    under_admission: 'status-admission',
    completed: 'status-completed',
    closed: 'status-closed',
  };
  return classes[status];
};

// Mock Contracts
export const contracts: Contract[] = [
  {
    contractId: 'CNT-001',
    caseId: 'MED-001',
    clientId: 5,
    agentId: 2,
    type: 'medical',
    status: 'active',
    title: 'Medical Treatment Agreement - Cardiac Care',
    terms: 'Comprehensive cardiac evaluation and treatment services. Includes consultation, diagnostics, and surgical procedures if required.',
    startDate: '2024-11-20',
    endDate: '2025-05-20',
    createdAt: '2024-11-20',
  },
  {
    contractId: 'CNT-002',
    caseId: 'ACAD-001',
    clientId: 7,
    agentId: 3,
    type: 'academic',
    status: 'active',
    title: 'Academic Admission Agreement - MBBS Program',
    terms: 'Student admission and placement services for MBBS program. Includes visa assistance and accommodation support.',
    startDate: '2024-11-22',
    endDate: '2025-11-22',
    createdAt: '2024-11-22',
  },
  {
    contractId: 'CNT-003',
    caseId: 'MED-003',
    clientId: 5,
    agentId: 3,
    type: 'medical',
    status: 'archived',
    title: 'ENT Treatment Agreement',
    terms: 'ENT consultation and treatment services.',
    startDate: '2024-10-15',
    endDate: '2024-11-20',
    createdAt: '2024-10-15',
    archivedAt: '2024-11-20',
  },
];

// Mock AI Processing
export const aiProcessings: AIProcessing[] = [
  {
    id: 1,
    caseId: 'MED-001',
    documentId: 101,
    type: 'medical_extraction',
    status: 'completed',
    extractedData: {
      diagnosis: 'Coronary Artery Disease',
      recommendations: 'Cardiac bypass surgery recommended',
      medications: ['Aspirin', 'Atorvastatin'],
    },
    confidence: 0.92,
    processedAt: '2024-11-21T10:30:00Z',
  },
  {
    id: 2,
    caseId: 'MED-001',
    documentId: 102,
    type: 'radiology_analysis',
    status: 'completed',
    extractedData: {
      findings: 'Multiple blockages detected in coronary arteries',
      severity: 'Moderate to Severe',
    },
    confidence: 0.88,
    processedAt: '2024-11-22T14:15:00Z',
  },
  {
    id: 3,
    caseId: 'ACAD-001',
    documentId: 107,
    type: 'certificate_verification',
    status: 'completed',
    extractedData: {
      verified: true,
      institution: 'Sudan University of Science and Technology',
      degree: 'High School Diploma',
      year: '2023',
    },
    confidence: 0.95,
    processedAt: '2024-11-23T09:00:00Z',
  },
];

// Mock Hospitals
export const hospitals: Hospital[] = [
  {
    id: 1,
    name: 'Apollo Hospitals',
    city: 'Chennai',
    country: 'India',
    specialties: ['Cardiology', 'Orthopedics', 'Oncology'],
    rating: 4.8,
    integrationStatus: 'connected',
  },
  {
    id: 2,
    name: 'Fortis Hospital',
    city: 'Delhi',
    country: 'India',
    specialties: ['Orthopedics', 'Neurology'],
    rating: 4.6,
    integrationStatus: 'connected',
  },
  {
    id: 3,
    name: 'Max Healthcare',
    city: 'Mumbai',
    country: 'India',
    specialties: ['ENT', 'General Medicine'],
    rating: 4.7,
    integrationStatus: 'connected',
  },
  {
    id: 4,
    name: 'Tata Memorial Hospital',
    city: 'Mumbai',
    country: 'India',
    specialties: ['Oncology', 'Radiation Therapy'],
    rating: 4.9,
    integrationStatus: 'pending',
  },
];

// Mock Universities
export const universities: University[] = [
  {
    id: 1,
    name: 'Manipal University',
    city: 'Manipal',
    country: 'India',
    programs: ['MBBS', 'Engineering', 'MBA'],
    rating: 4.7,
    integrationStatus: 'connected',
  },
  {
    id: 2,
    name: 'VIT University',
    city: 'Vellore',
    country: 'India',
    programs: ['Engineering', 'Computer Science'],
    rating: 4.6,
    integrationStatus: 'connected',
  },
  {
    id: 3,
    name: 'IIM Bangalore',
    city: 'Bangalore',
    country: 'India',
    programs: ['MBA', 'Executive MBA'],
    rating: 4.9,
    integrationStatus: 'connected',
  },
];

// Mock Payment Methods
export const paymentMethods: PaymentMethod[] = [
  { id: 'mm1', type: 'mobile_money', name: 'MTN Mobile Money', enabled: true },
  { id: 'mm2', type: 'mobile_money', name: 'Zain Cash', enabled: true },
  { id: 'card1', type: 'bank_card', name: 'Visa/Mastercard', enabled: true },
  { id: 'transfer1', type: 'bank_transfer', name: 'Bank Transfer', enabled: true },
];

// Helper functions
export const getContractById = (contractId: string): Contract | undefined => contracts.find(c => c.contractId === contractId);
export const getContractsByCase = (caseId: string): Contract[] => contracts.filter(c => c.caseId === caseId);
export const getAIProcessingByDocument = (documentId: number): AIProcessing | undefined => aiProcessings.find(a => a.documentId === documentId);
export const getAIProcessingByCase = (caseId: string): AIProcessing[] => aiProcessings.filter(a => a.caseId === caseId);
export const getHospitalById = (id: number): Hospital | undefined => hospitals.find(h => h.id === id);
export const getUniversityById = (id: number): University | undefined => universities.find(u => u.id === id);
