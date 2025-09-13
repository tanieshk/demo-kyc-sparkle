import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  User, 
  FileText, 
  Wallet, 
  CheckCircle, 
  Clock, 
  Upload,
  Settings,
  LogOut,
  AlertCircle
} from 'lucide-react';
import { useDemoContext } from '@/components/demo/DemoProvider';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const DashboardContent = () => {
  const { demoUser, connectDemoWallet, updateVerificationStep, isDemo } = useDemoContext();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);

  // Use demo user if in demo mode, otherwise use authenticated user data
  const currentUser = isDemo ? demoUser : {
    id: user?.id || '',
    email: user?.email || '',
    name: user?.user_metadata?.display_name || 'User',
    walletAddress: '',
    kycStatus: 'pending' as const,
    documents: [],
    verificationStep: 1,
    createdAt: new Date(),
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Error signing out');
    } else {
      toast.success('Signed out successfully');
      navigate('/auth');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-kyc-success text-white';
      case 'in-progress': return 'bg-kyc-warning text-white';
      case 'pending': return 'bg-kyc-info text-white';
      default: return 'bg-kyc-error text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleConnectWallet = async () => {
    setIsConnectingWallet(true);
    
    // Simulate MetaMask connection
    setTimeout(() => {
      connectDemoWallet();
      toast.success('Demo wallet connected successfully!');
      updateVerificationStep(Math.max(currentUser.verificationStep, 3));
      setIsConnectingWallet(false);
    }, 2000);
  };

  const getProgressPercentage = () => {
    const step = currentUser.verificationStep;
    return Math.min((step / 4) * 100, 100);
  };

  const handleStartKyc = () => {
    navigate('/kyc');
  };

  const handleLogout = () => {
    if (isDemo) {
      toast.success('Logged out successfully');
      navigate('/auth');
    } else {
      handleSignOut();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-kyc-darker via-kyc-dark to-background">
      {/* Header */}
      <header className="border-b border-white/10 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">DecentraKYC-AI</h1>
                <p className="text-xs text-muted-foreground">Demo Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser.email}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-white"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* KYC Status */}
          <Card className="kyc-card p-6 border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">KYC Status</h3>
              {getStatusIcon(currentUser.kycStatus)}
            </div>
            <div className="space-y-3">
              <Badge className={`${getStatusColor(currentUser.kycStatus)} capitalize`}>
                {currentUser.kycStatus}
              </Badge>
              <Progress value={getProgressPercentage()} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Step {currentUser.verificationStep} of 4 completed
              </p>
            </div>
          </Card>

          {/* Wallet Status */}
          <Card className="kyc-card p-6 border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Wallet</h3>
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-3">
              {currentUser.walletAddress ? (
                <>
                  <Badge className="bg-kyc-success text-white">Connected</Badge>
                  <p className="text-xs text-muted-foreground font-mono break-all">
                    {currentUser.walletAddress}
                  </p>
                </>
              ) : (
                <>
                  <Badge variant="outline" className="border-kyc-warning text-kyc-warning">
                    Not Connected
                  </Badge>
                  <Button 
                    size="sm" 
                    onClick={handleConnectWallet}
                    disabled={isConnectingWallet}
                    className="w-full gradient-primary"
                  >
                    {isConnectingWallet ? 'Connecting...' : 'Connect Wallet'}
                  </Button>
                </>
              )}
            </div>
          </Card>

          {/* Documents */}
          <Card className="kyc-card p-6 border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Documents</h3>
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Uploaded</span>
                <span className="text-sm font-medium text-white">
                  {currentUser.documents.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Verified</span>
                <span className="text-sm font-medium text-white">
                  {currentUser.documents.filter(d => d.status === 'verified').length}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="kyc-card p-6 border-white/10">
          <h3 className="text-lg font-semibold text-white mb-6">Quick Actions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={handleStartKyc}
              className="h-auto p-4 flex flex-col items-center space-y-2 gradient-primary hover:kyc-glow transition-smooth"
            >
              <Upload className="h-6 w-6" />
              <span className="text-sm font-medium">Start KYC</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2 bg-white/5 border-white/20 text-white hover:bg-white/10"
              onClick={() => navigate('/documents')}
            >
              <FileText className="h-6 w-6" />
              <span className="text-sm font-medium">View Documents</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2 bg-white/5 border-white/20 text-white hover:bg-white/10"
              onClick={() => navigate('/profile')}
            >
              <User className="h-6 w-6" />
              <span className="text-sm font-medium">Profile</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2 bg-white/5 border-white/20 text-white hover:bg-white/10"
              onClick={() => navigate('/admin')}
            >
              <Settings className="h-6 w-6" />
              <span className="text-sm font-medium">Admin Panel</span>
            </Button>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="kyc-card p-6 border-white/10">
          <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
          
          <div className="space-y-4">
            {currentUser.documents.length > 0 ? (
              currentUser.documents.slice(0, 3).map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-white capitalize">
                        {doc.type.replace('-', ' ')} uploaded
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {doc.uploadedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(doc.status)} text-xs`}>
                    {doc.status}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No documents uploaded yet</p>
                <Button 
                  size="sm" 
                  className="mt-3 gradient-primary"
                  onClick={handleStartKyc}
                >
                  Upload First Document
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Demo Notice */}
        <Card className="kyc-card p-4 border-primary/30 bg-primary/10">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white">Demo Environment</p>
              <p className="text-xs text-muted-foreground mt-1">
                This is a fully functional demo of the DecentraKYC-AI platform. All data is simulated and no real personal information is processed.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const Dashboard = () => (
  <ProtectedRoute>
    <DashboardContent />
  </ProtectedRoute>
);

export default Dashboard;