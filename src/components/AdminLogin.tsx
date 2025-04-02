
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, User } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Fetch admin credentials from Supabase
      const { data: adminCredentials, error } = await supabase
        .from('admin_credentials')
        .select('username, password')
        .eq('username', username)
        .single();
      
      if (error) {
        console.error('Error fetching admin credentials:', error);
        toast.error('Authentication failed');
        setLoading(false);
        return;
      }
      
      // Verify credentials
      if (adminCredentials && adminCredentials.password === password) {
        // Store authentication state in localStorage
        localStorage.setItem('techfest-admin', JSON.stringify({
          isAuthenticated: true,
          timestamp: new Date().toISOString()
        }));
        
        toast.success('Login successful');
        navigate('/admin/dashboard');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Authentication failed');
    } finally {
      setLoading(false);
    }
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
