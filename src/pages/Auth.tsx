import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Eye, EyeOff, Wallet, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDemoContext } from '@/components/demo/DemoProvider';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  const { demoUser } = useDemoContext();
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !isDemoMode) {
      navigate('/dashboard');
    }
  }, [user, navigate, isDemoMode]);

  const handleDemoLogin = () => {
    setIsDemoMode(true);
    toast.success('Demo account logged in successfully!');
    navigate('/dashboard');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password. Please try again.');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Please check your email and click the confirmation link.');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success('Signed in successfully!');
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signUp(signUpEmail, signUpPassword, signUpName);
      if (error) {
        if (error.message.includes('User already registered')) {
          toast.error('An account with this email already exists. Please sign in instead.');
        } else if (error.message.includes('Password should be at least 6 characters')) {
          toast.error('Password must be at least 6 characters long.');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success('Account created! Please check your email to confirm your account.');
        setSignUpEmail('');
        setSignUpPassword('');
        setSignUpName('');
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-kyc-darker via-kyc-dark to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,theme(colors.primary/0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,theme(colors.kyc-success/0.1),transparent_50%)]" />
      
      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="p-3 rounded-xl bg-primary/20 backdrop-blur-sm border border-primary/30">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">DecentraKYC-AI</h1>
            <p className="text-muted-foreground mt-2">
              Secure decentralized identity verification platform
            </p>
          </div>
        </div>

        {/* Demo Banner */}
        <div className="kyc-card rounded-xl p-4 border border-primary/30">
          <div className="flex items-center space-x-3">
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
            <div>
              <p className="text-sm font-medium text-white">Real Authentication Available</p>
              <p className="text-xs text-muted-foreground">
                Create an account or use demo mode for testing
              </p>
            </div>
          </div>
        </div>

        {/* Auth Card */}
        <Card className="kyc-card border-white/10 backdrop-blur-xl">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10">
              <TabsTrigger 
                value="signin" 
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="p-6 space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-white">Welcome back</h2>
                <p className="text-sm text-muted-foreground">
                  Sign in to your account to access your verification dashboard
                </p>
              </div>

              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Email</label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-muted-foreground focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white/5 border-white/20 text-white placeholder:text-muted-foreground focus:border-primary pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-muted-foreground hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full gradient-primary text-white font-medium transition-smooth hover:kyc-glow"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>

                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10"
                  disabled
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Connect Wallet (Coming Soon)
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="p-6 space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-white">Create Account</h2>
                <p className="text-sm text-muted-foreground">
                  Join the decentralized identity verification platform
                </p>
              </div>

              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Full Name</label>
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    required
                    className="bg-white/5 border-white/20 text-white placeholder:text-muted-foreground focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Email</label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    required
                    className="bg-white/5 border-white/20 text-white placeholder:text-muted-foreground focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white">Password</label>
                  <Input
                    type="password"
                    placeholder="Create a strong password (min 6 characters)"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    required
                    minLength={6}
                    className="bg-white/5 border-white/20 text-white placeholder:text-muted-foreground focus:border-primary"
                  />
                </div>

                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full gradient-primary text-white font-medium transition-smooth hover:kyc-glow"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Demo Instructions */}
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            Test the app with demo data or create a real account
          </p>
          <Button 
            variant="link" 
            size="sm"
            onClick={handleDemoLogin}
            className="text-primary hover:text-primary/80 text-xs"
          >
            Continue with Demo Account →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;