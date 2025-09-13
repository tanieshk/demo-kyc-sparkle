import React, { createContext, useContext, useState, useEffect } from 'react';

export interface DemoUser {
  id: string;
  email: string;
  name: string;
  walletAddress: string;
  kycStatus: 'pending' | 'in-progress' | 'verified' | 'rejected';
  documents: DemoDocument[];
  verificationStep: number;
  createdAt: Date;
}

export interface DemoDocument {
  id: string;
  type: 'passport' | 'drivers-license' | 'id-card' | 'proof-of-address';
  filename: string;
  status: 'uploaded' | 'processing' | 'verified' | 'rejected';
  aiConfidence: number;
  extractedData?: any;
  uploadedAt: Date;
}

interface DemoContextType {
  demoUser: DemoUser | null;
  isDemo: boolean;
  connectDemoWallet: () => void;
  uploadDemoDocument: (type: DemoDocument['type'], filename: string) => void;
  resetDemo: () => void;
  updateKycStatus: (status: DemoUser['kycStatus']) => void;
  updateVerificationStep: (step: number) => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const useDemoContext = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemoContext must be used within a DemoProvider');
  }
  return context;
};

const createInitialDemoUser = (): DemoUser => ({
  id: 'demo-user-001',
  email: 'demo@decentrakyc.com',
  name: 'Alex Johnson',
  walletAddress: '0x742d35Cc6635C0532925a3b8D23C8C0b8E0',
  kycStatus: 'pending',
  documents: [],
  verificationStep: 1,
  createdAt: new Date(),
});

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [demoUser, setDemoUser] = useState<DemoUser | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    // Initialize demo user on mount
    const savedDemo = localStorage.getItem('kyc-demo-user');
    if (savedDemo) {
      try {
        const parsed = JSON.parse(savedDemo);
        setDemoUser({
          ...parsed,
          createdAt: new Date(parsed.createdAt),
          documents: parsed.documents.map((doc: any) => ({
            ...doc,
            uploadedAt: new Date(doc.uploadedAt),
          })),
        });
        setIsDemo(true);
      } catch {
        // If parsing fails, create new demo user
        const newUser = createInitialDemoUser();
        setDemoUser(newUser);
        setIsDemo(true);
        localStorage.setItem('kyc-demo-user', JSON.stringify(newUser));
      }
    } else {
      // Create new demo user
      const newUser = createInitialDemoUser();
      setDemoUser(newUser);
      setIsDemo(true);
      localStorage.setItem('kyc-demo-user', JSON.stringify(newUser));
    }
  }, []);

  const saveDemoUser = (user: DemoUser) => {
    localStorage.setItem('kyc-demo-user', JSON.stringify(user));
  };

  const connectDemoWallet = () => {
    if (!demoUser) return;
    
    // Simulate MetaMask connection
    const updatedUser = {
      ...demoUser,
      walletAddress: '0x742d35Cc6635C0532925a3b8D23C8C0b8E0',
    };
    setDemoUser(updatedUser);
    saveDemoUser(updatedUser);
  };

  const uploadDemoDocument = (type: DemoDocument['type'], filename: string) => {
    if (!demoUser) return;

    const newDoc: DemoDocument = {
      id: `doc-${Date.now()}`,
      type,
      filename,
      status: 'uploaded',
      aiConfidence: 0,
      uploadedAt: new Date(),
    };

    // Simulate AI processing
    setTimeout(() => {
      const processingDoc = { ...newDoc, status: 'processing' as const };
      const updatedUser = {
        ...demoUser,
        documents: [...demoUser.documents.filter(d => d.id !== newDoc.id), processingDoc],
        kycStatus: 'in-progress' as const,
      };
      setDemoUser(updatedUser);
      saveDemoUser(updatedUser);

      // Simulate verification completion
      setTimeout(() => {
        const verifiedDoc = {
          ...processingDoc,
          status: 'verified' as const,
          aiConfidence: Math.floor(Math.random() * 15) + 85, // 85-99%
          extractedData: {
            name: 'Alex Johnson',
            documentNumber: type === 'passport' ? 'P12345678' : 'DL987654321',
            expiryDate: '2029-12-31',
            issueDate: '2024-01-15',
          },
        };

        const finalUser = {
          ...updatedUser,
          documents: [...updatedUser.documents.filter(d => d.id !== newDoc.id), verifiedDoc],
          kycStatus: 'verified' as const,
          verificationStep: Math.max(updatedUser.verificationStep, 4),
        };
        setDemoUser(finalUser);
        saveDemoUser(finalUser);
      }, 3000);
    }, 1000);

    const updatedUser = {
      ...demoUser,
      documents: [...demoUser.documents, newDoc],
      verificationStep: Math.max(demoUser.verificationStep, 2),
    };
    setDemoUser(updatedUser);
    saveDemoUser(updatedUser);
  };

  const updateKycStatus = (status: DemoUser['kycStatus']) => {
    if (!demoUser) return;
    const updatedUser = { ...demoUser, kycStatus: status };
    setDemoUser(updatedUser);
    saveDemoUser(updatedUser);
  };

  const updateVerificationStep = (step: number) => {
    if (!demoUser) return;
    const updatedUser = { ...demoUser, verificationStep: step };
    setDemoUser(updatedUser);
    saveDemoUser(updatedUser);
  };

  const resetDemo = () => {
    const newUser = createInitialDemoUser();
    setDemoUser(newUser);
    saveDemoUser(newUser);
    localStorage.removeItem('kyc-demo-user');
  };

  return (
    <DemoContext.Provider
      value={{
        demoUser,
        isDemo,
        connectDemoWallet,
        uploadDemoDocument,
        resetDemo,
        updateKycStatus,
        updateVerificationStep,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};