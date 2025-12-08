import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  User, Case, Contract, Document, Invoice, Message, Notification,
  users as initialUsers, cases as initialCases, contracts as initialContracts,
  documents as initialDocuments, invoices as initialInvoices,
  messages as initialMessages, notifications as initialNotifications,
} from '@/lib/mockData';

interface DataStoreContextType {
  // Data
  users: User[];
  cases: Case[];
  contracts: Contract[];
  documents: Document[];
  invoices: Invoice[];
  messages: Message[];
  notifications: Notification[];

  // User operations
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => User;
  updateUser: (id: number, updates: Partial<User>) => void;
  deleteUser: (id: number) => void;

  // Case operations
  addCase: (caseData: Omit<Case, 'caseId' | 'createdAt' | 'updatedAt'>) => Case;
  updateCase: (caseId: string, updates: Partial<Case>) => void;
  deleteCase: (caseId: string) => void;

  // Contract operations
  addContract: (contract: Omit<Contract, 'contractId' | 'createdAt'>) => Contract;
  updateContract: (contractId: string, updates: Partial<Contract>) => void;
  archiveContract: (contractId: string) => void;
  deleteContract: (contractId: string) => void;

  // Document operations
  addDocument: (doc: Omit<Document, 'docId' | 'uploadedAt'>) => Document;
  deleteDocument: (docId: number) => void;

  // Invoice operations
  addInvoice: (invoice: Omit<Invoice, 'invoiceId' | 'issuedAt'>) => Invoice;
  updateInvoice: (invoiceId: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (invoiceId: string) => void;

  // Message operations
  addMessage: (message: Omit<Message, 'msgId' | 'sentAt' | 'read'>) => Message;
  markMessageRead: (msgId: number) => void;

  // Notification operations
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => Notification;
  markNotificationRead: (id: number) => void;
}

const DataStoreContext = createContext<DataStoreContextType | undefined>(undefined);

export const DataStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  
  // Make users available to AuthContext
  React.useEffect(() => {
    try {
      const { setDataStoreRef } = require('./AuthContext');
      setDataStoreRef({ users });
    } catch (e) {
      // Ignore if AuthContext not available yet
    }
  }, [users]);
  const [cases, setCases] = useState<Case[]>(initialCases);
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  // User operations
  const addUser = useCallback((userData: Omit<User, 'id' | 'createdAt'>): User => {
    const newUser: User = {
      ...userData,
      id: Math.max(...users.map(u => u.id), 0) + 1,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  }, [users]);

  const updateUser = useCallback((id: number, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  }, []);

  const deleteUser = useCallback((id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  }, []);

  // Case operations
  const addCase = useCallback((caseData: Omit<Case, 'caseId' | 'createdAt' | 'updatedAt'>): Case => {
    const caseType = caseData.type === 'medical' ? 'MED' : 'ACAD';
    const caseNumber = String(cases.filter(c => c.type === caseData.type).length + 1).padStart(3, '0');
    const newCase: Case = {
      ...caseData,
      caseId: `${caseType}-${caseNumber}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setCases(prev => [...prev, newCase]);
    return newCase;
  }, [cases]);

  const updateCase = useCallback((caseId: string, updates: Partial<Case>) => {
    setCases(prev => prev.map(c => 
      c.caseId === caseId ? { ...c, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : c
    ));
  }, []);

  const deleteCase = useCallback((caseId: string) => {
    setCases(prev => prev.filter(c => c.caseId !== caseId));
  }, []);

  // Contract operations
  const addContract = useCallback((contractData: Omit<Contract, 'contractId' | 'createdAt'>): Contract => {
    const contractNumber = String(contracts.length + 1).padStart(3, '0');
    const newContract: Contract = {
      ...contractData,
      contractId: `CNT-${contractNumber}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setContracts(prev => [...prev, newContract]);
    return newContract;
  }, [contracts]);

  const updateContract = useCallback((contractId: string, updates: Partial<Contract>) => {
    setContracts(prev => prev.map(c => 
      c.contractId === contractId ? { ...c, ...updates } : c
    ));
  }, []);

  const archiveContract = useCallback((contractId: string) => {
    setContracts(prev => prev.map(c => 
      c.contractId === contractId 
        ? { ...c, status: 'archived' as const, archivedAt: new Date().toISOString().split('T')[0] }
        : c
    ));
  }, []);

  const deleteContract = useCallback((contractId: string) => {
    setContracts(prev => prev.filter(c => c.contractId !== contractId));
  }, []);

  // Document operations
  const addDocument = useCallback((docData: Omit<Document, 'docId' | 'uploadedAt'>): Document => {
    const newDoc: Document = {
      ...docData,
      docId: Math.max(...documents.map(d => d.docId), 0) + 1,
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    setDocuments(prev => [...prev, newDoc]);
    return newDoc;
  }, [documents]);

  const deleteDocument = useCallback((docId: number) => {
    setDocuments(prev => prev.filter(d => d.docId !== docId));
  }, []);

  // Invoice operations
  const addInvoice = useCallback((invoiceData: Omit<Invoice, 'invoiceId' | 'issuedAt'>): Invoice => {
    const invoiceNumber = String(invoices.length + 1001);
    const newInvoice: Invoice = {
      ...invoiceData,
      invoiceId: `INV-${invoiceNumber}`,
      issuedAt: new Date().toISOString().split('T')[0],
    };
    setInvoices(prev => [...prev, newInvoice]);
    return newInvoice;
  }, [invoices]);

  const updateInvoice = useCallback((invoiceId: string, updates: Partial<Invoice>) => {
    setInvoices(prev => prev.map(i => 
      i.invoiceId === invoiceId ? { ...i, ...updates } : i
    ));
  }, []);

  const deleteInvoice = useCallback((invoiceId: string) => {
    setInvoices(prev => prev.filter(i => i.invoiceId !== invoiceId));
  }, []);

  // Message operations
  const addMessage = useCallback((messageData: Omit<Message, 'msgId' | 'sentAt' | 'read'>): Message => {
    const newMessage: Message = {
      ...messageData,
      msgId: Math.max(...messages.map(m => m.msgId), 0) + 1,
      sentAt: new Date().toISOString(),
      read: false,
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, [messages]);

  const markMessageRead = useCallback((msgId: number) => {
    setMessages(prev => prev.map(m => m.msgId === msgId ? { ...m, read: true } : m));
  }, []);

  // Notification operations
  const addNotification = useCallback((notificationData: Omit<Notification, 'id' | 'read' | 'createdAt'>): Notification => {
    const newNotification: Notification = {
      ...notificationData,
      id: Math.max(...notifications.map(n => n.id), 0) + 1,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [...prev, newNotification]);
    return newNotification;
  }, [notifications]);

  const markNotificationRead = useCallback((id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const value: DataStoreContextType = {
    users,
    cases,
    contracts,
    documents,
    invoices,
    messages,
    notifications,
    addUser,
    updateUser,
    deleteUser,
    addCase,
    updateCase,
    deleteCase,
    addContract,
    updateContract,
    archiveContract,
    deleteContract,
    addDocument,
    deleteDocument,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    addMessage,
    markMessageRead,
    addNotification,
    markNotificationRead,
  };

  return (
    <DataStoreContext.Provider value={value}>
      {children}
    </DataStoreContext.Provider>
  );
};

export const useDataStore = () => {
  const context = useContext(DataStoreContext);
  if (!context) {
    throw new Error('useDataStore must be used within DataStoreProvider');
  }
  return context;
};

