import { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ArrowLeft,
  Download,
  Eye,
  Loader2
} from 'lucide-react';
import { useDemoContext, DemoDocument } from '@/components/demo/DemoProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const sampleDocuments = {
  passport: 'sample-passport.pdf',
  'drivers-license': 'sample-drivers-license.jpg',
  'id-card': 'sample-national-id.jpg',
  'proof-of-address': 'sample-utility-bill.pdf'
};

const documentTypes = [
  { 
    id: 'passport' as const, 
    name: 'Passport', 
    description: 'Government issued passport',
    required: true 
  },
  { 
    id: 'drivers-license' as const, 
    name: "Driver's License", 
    description: 'Valid driver\'s license',
    required: false 
  },
  { 
    id: 'id-card' as const, 
    name: 'National ID', 
    description: 'National identity card',
    required: false 
  },
  { 
    id: 'proof-of-address' as const, 
    name: 'Proof of Address', 
    description: 'Utility bill or bank statement',
    required: true 
  }
];

const KycFlow = () => {
  const { demoUser, uploadDemoDocument, updateVerificationStep } = useDemoContext();
  const navigate = useNavigate();
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  if (!demoUser) {
    navigate('/auth');
    return null;
  }

  const getDocumentStatus = (docType: DemoDocument['type']) => {
    const doc = demoUser.documents.find(d => d.type === docType);
    return doc?.status || 'not-uploaded';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-kyc-success text-white';
      case 'processing': return 'bg-kyc-warning text-white';
      case 'uploaded': return 'bg-kyc-info text-white';
      case 'rejected': return 'bg-kyc-error text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4" />;
      case 'processing': return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'uploaded': return <Clock className="h-4 w-4" />;
      case 'rejected': return <AlertCircle className="h-4 w-4" />;
      default: return <Upload className="h-4 w-4" />;
    }
  };

  const handleUploadDocument = useCallback(async (docType: DemoDocument['type']) => {
    setUploadingDoc(docType);
    
    // Simulate file upload delay
    setTimeout(() => {
      const filename = sampleDocuments[docType];
      uploadDemoDocument(docType, filename);
      toast.success(`${documentTypes.find(dt => dt.id === docType)?.name} uploaded successfully!`);
      setUploadingDoc(null);
    }, 1500);
  }, [uploadDemoDocument]);

  const handleDownloadSample = (docType: DemoDocument['type']) => {
    toast.info(`Sample ${docType.replace('-', ' ')} would be downloaded in a real implementation`);
  };

  const getOverallProgress = () => {
    const requiredDocs = documentTypes.filter(dt => dt.required);
    const verifiedRequired = requiredDocs.filter(dt => 
      getDocumentStatus(dt.id) === 'verified'
    );
    return (verifiedRequired.length / requiredDocs.length) * 100;
  };

  const isKycComplete = () => {
    const requiredDocs = documentTypes.filter(dt => dt.required);
    return requiredDocs.every(dt => getDocumentStatus(dt.id) === 'verified');
  };

  const handleCompleteKyc = () => {
    updateVerificationStep(4);
    toast.success('KYC verification completed! 🎉');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-kyc-darker via-kyc-dark to-background">
      {/* Header */}
      <header className="border-b border-white/10 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-muted-foreground hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white">KYC Verification</h1>
              <p className="text-xs text-muted-foreground">Complete your identity verification</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Progress Overview */}
        <Card className="kyc-card p-6 border-white/10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Verification Progress</h2>
              <Badge className={`${isKycComplete() ? 'bg-kyc-success' : 'bg-kyc-info'} text-white`}>
                {isKycComplete() ? 'Complete' : 'In Progress'}
              </Badge>
            </div>
            
            <Progress value={getOverallProgress()} className="h-3" />
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {documentTypes.filter(dt => dt.required && getDocumentStatus(dt.id) === 'verified').length} of{' '}
                {documentTypes.filter(dt => dt.required).length} required documents verified
              </span>
              <span className="text-white font-medium">
                {Math.round(getOverallProgress())}% Complete
              </span>
            </div>
          </div>
        </Card>

        {/* Document Upload Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documentTypes.map((docType) => {
            const status = getDocumentStatus(docType.id);
            const doc = demoUser.documents.find(d => d.type === docType.id);
            const isUploading = uploadingDoc === docType.id;

            return (
              <Card key={docType.id} className="kyc-card p-6 border-white/10">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-white">{docType.name}</h3>
                        {docType.required && (
                          <Badge variant="outline" className="text-xs border-kyc-error text-kyc-error">
                            Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{docType.description}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {status !== 'not-uploaded' && (
                        <Badge className={`${getStatusColor(status)} text-xs`}>
                          <span className="flex items-center space-x-1">
                            {getStatusIcon(status)}
                            <span className="capitalize">{status}</span>
                          </span>
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Document Info */}
                  {doc && (
                    <div className="space-y-2 p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Filename</span>
                        <span className="text-sm text-white font-mono">{doc.filename}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Uploaded</span>
                        <span className="text-sm text-white">
                          {doc.uploadedAt.toLocaleDateString()}
                        </span>
                      </div>
                      {doc.aiConfidence > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">AI Confidence</span>
                          <span className="text-sm text-white">{doc.aiConfidence}%</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-2">
                    {status === 'not-uploaded' ? (
                      <>
                        <Button
                          onClick={() => handleUploadDocument(docType.id)}
                          disabled={isUploading}
                          className="w-full gradient-primary hover:kyc-glow transition-smooth"
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload {docType.name}
                            </>
                          )}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadSample(docType.id)}
                          className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Sample
                        </Button>
                      </>
                    ) : (
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        
                        <Button
                          onClick={() => handleUploadDocument(docType.id)}
                          disabled={isUploading}
                          size="sm"
                          className="flex-1 gradient-primary"
                        >
                          {isUploading ? 'Uploading...' : 'Re-upload'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Complete KYC Button */}
        {isKycComplete() && (
          <Card className="kyc-card p-6 border-primary/30 bg-primary/10">
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-primary mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-white">
                  All Required Documents Verified!
                </h3>
                <p className="text-muted-foreground">
                  Your KYC verification is complete and ready for final approval.
                </p>
              </div>
              <Button
                onClick={handleCompleteKyc}
                size="lg"
                className="gradient-primary hover:kyc-glow transition-smooth"
              >
                Complete KYC Verification
              </Button>
            </div>
          </Card>
        )}

        {/* Demo Notice */}
        <Card className="kyc-card p-4 border-kyc-info/30 bg-kyc-info/10">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-kyc-info flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white">Demo Document Processing</p>
              <p className="text-xs text-muted-foreground mt-1">
                In this demo, documents are automatically processed and verified. 
                Real implementation would integrate with AI services for document analysis and verification.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default KycFlow;