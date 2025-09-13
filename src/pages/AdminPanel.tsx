import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  RotateCcw, 
  Users, 
  FileText, 
  Shield,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { useDemoContext } from '@/components/demo/DemoProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AdminPanel = () => {
  const { demoUser, resetDemo } = useDemoContext();
  const navigate = useNavigate();
  const [isResetting, setIsResetting] = useState(false);

  if (!demoUser) {
    navigate('/auth');
    return null;
  }

  const handleResetDemo = async () => {
    setIsResetting(true);
    
    // Simulate reset delay
    setTimeout(() => {
      resetDemo();
      toast.success('Demo data has been reset successfully!');
      setIsResetting(false);
      navigate('/auth');
    }, 2000);
  };

  const getDemoStats = () => {
    return {
      totalDocuments: demoUser.documents.length,
      verifiedDocuments: demoUser.documents.filter(d => d.status === 'verified').length,
      processingDocuments: demoUser.documents.filter(d => d.status === 'processing').length,
      kycStatus: demoUser.kycStatus,
      verificationStep: demoUser.verificationStep,
      hasWallet: !!demoUser.walletAddress,
    };
  };

  const stats = getDemoStats();

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
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                <p className="text-xs text-muted-foreground">Demo management and controls</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Demo Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="kyc-card p-6 border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Demo User</h3>
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Name</span>
                <span className="text-sm text-white">{demoUser.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm text-white text-xs">{demoUser.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge className={`text-xs ${
                  stats.kycStatus === 'verified' ? 'bg-kyc-success' :
                  stats.kycStatus === 'in-progress' ? 'bg-kyc-warning' :
                  'bg-kyc-info'
                } text-white`}>
                  {stats.kycStatus}
                </Badge>
              </div>
            </div>
          </Card>

          <Card className="kyc-card p-6 border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Documents</h3>
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-sm text-white">{stats.totalDocuments}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Verified</span>
                <span className="text-sm text-white">{stats.verifiedDocuments}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Processing</span>
                <span className="text-sm text-white">{stats.processingDocuments}</span>
              </div>
            </div>
          </Card>

          <Card className="kyc-card p-6 border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Verification</h3>
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Step</span>
                <span className="text-sm text-white">{stats.verificationStep} / 4</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Wallet</span>
                <span className="text-sm text-white">
                  {stats.hasWallet ? 'Connected' : 'Not Connected'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm text-white">
                  {Math.round((stats.verificationStep / 4) * 100)}%
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Demo Data Management */}
        <Card className="kyc-card p-6 border-white/10">
          <h3 className="text-lg font-semibold text-white mb-6">Demo Data Management</h3>
          
          <div className="space-y-6">
            {/* Current Demo State */}
            <div className="space-y-4">
              <h4 className="font-medium text-white">Current Demo State</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-kyc-success" />
                    <span className="text-sm font-medium text-white">Demo User Created</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Demo account with pre-configured data
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center space-x-2 mb-2">
                    {stats.totalDocuments > 0 ? (
                      <CheckCircle className="h-4 w-4 text-kyc-success" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-kyc-warning" />
                    )}
                    <span className="text-sm font-medium text-white">Documents Status</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalDocuments > 0 
                      ? `${stats.totalDocuments} documents uploaded`
                      : 'No documents uploaded yet'
                    }
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center space-x-2 mb-2">
                    {stats.hasWallet ? (
                      <CheckCircle className="h-4 w-4 text-kyc-success" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-kyc-warning" />
                    )}
                    <span className="text-sm font-medium text-white">Wallet Connection</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats.hasWallet ? 'Demo wallet connected' : 'No wallet connected'}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center space-x-2 mb-2">
                    {stats.kycStatus === 'verified' ? (
                      <CheckCircle className="h-4 w-4 text-kyc-success" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-kyc-warning" />
                    )}
                    <span className="text-sm font-medium text-white">KYC Status</span>
                  </div>
                  <p className="text-xs text-muted-foreground capitalize">
                    {stats.kycStatus} verification status
                  </p>
                </div>
              </div>
            </div>

            {/* Reset Actions */}
            <div className="space-y-4">
              <h4 className="font-medium text-white">Reset Demo Data</h4>
              
              <div className="p-4 rounded-lg bg-kyc-error/10 border border-kyc-error/30">
                <div className="flex items-start space-x-3 mb-4">
                  <AlertTriangle className="h-5 w-5 text-kyc-error flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-white">Reset Demo Environment</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      This will completely reset all demo data including user information, 
                      uploaded documents, wallet connections, and KYC status. This action cannot be undone.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium text-white mb-1">What will be reset:</p>
                    <ul className="list-disc list-inside space-y-0.5 ml-2">
                      <li>User profile and authentication status</li>
                      <li>All uploaded documents and verification results</li>
                      <li>Wallet connection status</li>
                      <li>KYC verification progress and status</li>
                      <li>Demo session data</li>
                    </ul>
                  </div>
                  
                  <Button
                    onClick={handleResetDemo}
                    disabled={isResetting}
                    variant="destructive"
                    className="w-full md:w-auto bg-kyc-error hover:bg-kyc-error/80"
                  >
                    {isResetting ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Resetting Demo...
                      </>
                    ) : (
                      <>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset All Demo Data
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Demo Information */}
        <Card className="kyc-card p-6 border-kyc-info/30 bg-kyc-info/10">
          <h3 className="text-lg font-semibold text-white mb-4">Demo Information</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-white mb-2">Demo Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Pre-configured demo user account</li>
                <li>• Simulated MetaMask wallet integration</li>
                <li>• Automated document processing and verification</li>
                <li>• Real-time KYC status updates</li>
                <li>• Complete verification workflow simulation</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-2">Admin Controls</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Monitor demo user activity and progress</li>
                <li>• View document upload and verification status</li>
                <li>• Reset demo environment for clean demonstrations</li>
                <li>• Track wallet connection and blockchain interactions</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;