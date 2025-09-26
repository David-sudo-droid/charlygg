import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const AdminAccess = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const { data, error } = await supabase.rpc('get_current_user_admin_status');
        if (!error) {
          setIsAdmin(data);
        }
      } else {
        setIsAdmin(null);
      }
    };

    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    // Check for admin access via URL parameter
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('admin') === 'true' && user && isAdmin) {
      navigate('/admin');
      return;
    }
    
    // Check for key sequence: Ctrl+Alt+A
    const handleKeyPress = async (event: KeyboardEvent) => {
      if (event.ctrlKey && event.altKey && event.key === 'a') {
        if (user) {
          // Check if user is admin before navigating
          const { data, error } = await supabase.rpc('get_current_user_admin_status');
          if (!error && data) {
            navigate('/admin');
          } else {
            alert('Access denied. Admin privileges required.');
          }
        } else {
          navigate('/auth?redirect=admin');
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [user, navigate, location, isAdmin]);

  return <>{children}</>;
};

export default AdminAccess;