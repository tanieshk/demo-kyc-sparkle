import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDemoContext } from '@/components/demo/DemoProvider';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const { isDemo } = useDemoContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user && !isDemo) {
      navigate('/auth');
    }
  }, [user, loading, isDemo, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-kyc-darker via-kyc-dark to-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && !isDemo) {
    return null;
  }

  return <>{children}</>;
};