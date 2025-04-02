
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

export const useAdminAuth = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if there's a session in localStorage
        const adminAuth = localStorage.getItem('techfest-admin');
        if (!adminAuth) {
          navigate('/admin');
          setIsLoading(false);
          return;
        }
        
        const { isAuthenticated, timestamp } = JSON.parse(adminAuth);
        const authTime = new Date(timestamp).getTime();
        const currentTime = new Date().getTime();
        const twoHoursMs = 2 * 60 * 60 * 1000;
        
        if (!isAuthenticated || (currentTime - authTime > twoHoursMs)) {
          // Auth expired after 2 hours
          localStorage.removeItem('techfest-admin');
          navigate('/admin');
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('techfest-admin');
        navigate('/admin');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('techfest-admin');
    setIsAuthenticated(false);
    navigate('/admin');
    toast.success('Logged out successfully');
  };

  return { isAuthenticated, isLoading, handleLogout };
};
