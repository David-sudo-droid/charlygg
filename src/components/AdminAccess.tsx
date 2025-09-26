import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AdminAccess = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [keySequence, setKeySequence] = useState<string[]>([]);
  
  useEffect(() => {
    // Check for admin access via URL parameter
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('admin') === 'true' && user) {
      // User is authenticated and has admin param, allow access
      return;
    }
    
    // Check for key sequence: Ctrl+Alt+A
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.altKey && event.key === 'a') {
        if (user) {
          navigate('/admin');
        } else {
          navigate('/auth?redirect=admin');
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [user, navigate, location]);

  return <>{children}</>;
};

export default AdminAccess;