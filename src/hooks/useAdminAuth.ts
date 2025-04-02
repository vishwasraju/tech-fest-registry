
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAdminAuth = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = localStorage.getItem('techfest-admin');
      if (!adminAuth) {
        navigate('/admin');
        return;
      }
      
      try {
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
        localStorage.removeItem('techfest-admin');
        navigate('/admin');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    // Preserve the password when logging out
    try {
      const adminAuth = localStorage.getItem('techfest-admin');
      if (adminAuth) {
        const authData = JSON.parse(adminAuth);
        if (authData.password) {
          // Store just the password
          localStorage.setItem('techfest-admin', JSON.stringify({
            isAuthenticated: false,
            password: authData.password
          }));
        } else {
          localStorage.removeItem('techfest-admin');
        }
      }
    } catch (error) {
      localStorage.removeItem('techfest-admin');
    }
    
    setIsAuthenticated(false);
    navigate('/admin');
  };

  return { isAuthenticated, isLoading, handleLogout };
};
