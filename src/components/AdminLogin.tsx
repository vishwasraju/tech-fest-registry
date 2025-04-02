
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, User } from 'lucide-react';
import { toast } from 'sonner';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Get the current admin auth data if it exists
    const adminAuth = localStorage.getItem('techfest-admin');
    const defaultUsername = 'admin';
    const defaultPassword = 'aiml2k25'; // Default password as specified
    
    setTimeout(() => {
      // Check if admin auth exists and has a custom password
      if (adminAuth) {
        try {
          const authData = JSON.parse(adminAuth);
          
          // Check if username matches and password matches stored password or default
          if (username === defaultUsername && 
              (password === (authData.password || defaultPassword))) {
            
            // Update auth data with valid authentication
            const updatedAuthData = {
              ...authData,
              isAuthenticated: true,
              timestamp: new Date().toISOString(),
              password: authData.password || defaultPassword // Preserve custom password if exists
            };
            
            localStorage.setItem('techfest-admin', JSON.stringify(updatedAuthData));
            toast.success('Login successful');
            navigate('/admin/dashboard');
          } else {
            toast.error('Invalid credentials');
          }
        } catch (error) {
          // If JSON parsing fails, reset to default authentication
          if (username === defaultUsername && password === defaultPassword) {
            localStorage.setItem('techfest-admin', JSON.stringify({
              isAuthenticated: true,
              timestamp: new Date().toISOString(),
              password: defaultPassword
            }));
            
            toast.success('Login successful');
            navigate('/admin/dashboard');
          } else {
            toast.error('Invalid credentials');
          }
        }
      } else {
        // First time login with default credentials
        if (username === defaultUsername && password === defaultPassword) {
          localStorage.setItem('techfest-admin', JSON.stringify({
            isAuthenticated: true,
            timestamp: new Date().toISOString(),
            password: defaultPassword
          }));
          
          toast.success('Login successful');
          navigate('/admin/dashboard');
        } else {
          toast.error('Invalid credentials');
        }
      }
      
      setLoading(false);
    }, 1000);
  };
  
  return (
    <div className="max-w-md mx-auto glass p-8 rounded-xl">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-techfest-muted flex items-center justify-center mx-auto mb-4">
          <User size={32} className="text-techfest-neon-blue" />
        </div>
        <h2 className="text-2xl font-bold">Admin Login</h2>
        <p className="text-sm text-gray-400 mt-2">
          Access the admin dashboard to manage events and registrations
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <div className="relative">
            <Input 
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10 bg-techfest-muted text-white border-techfest-muted"
              placeholder="Enter admin username"
              required
            />
            <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input 
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 bg-techfest-muted text-white border-techfest-muted"
              placeholder="Enter password"
              required
            />
            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-techfest-neon-blue to-techfest-neon-purple hover:opacity-90"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </div>
  );
};

export default AdminLogin;
