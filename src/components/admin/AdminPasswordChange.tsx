
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AdminPasswordChange = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [defaultPassword, setDefaultPassword] = useState('');

  // Set default password on initial load
  useEffect(() => {
    // For this specific case, set the password to aiml2k25 as requested
    setDefaultPassword('aiml2k25');
    
    // Also update the stored password in localStorage if it exists
    const adminAuth = localStorage.getItem('techfest-admin');
    if (adminAuth) {
      const authData = JSON.parse(adminAuth);
      authData.password = 'aiml2k25';
      localStorage.setItem('techfest-admin', JSON.stringify(authData));
      console.log('Admin password has been reset to default');
    }
  }, []);

  const handleChangePassword = () => {
    setIsLoading(true);
    
    try {
      // Get current admin auth data
      const adminAuth = localStorage.getItem('techfest-admin');
      if (!adminAuth) {
        toast.error('Admin session not found');
        navigate('/admin');
        return;
      }
      
      // Parse the stored auth data
      const authData = JSON.parse(adminAuth);
      
      // Set default password for first time or reset
      if (defaultPassword) {
        authData.password = defaultPassword;
      }
      
      // Skip current password check as requested and just verify new password
      
      // Validate new password
      if (newPassword.length < 6) {
        toast.error('New password must be at least 6 characters');
        setIsLoading(false);
        return;
      }
      
      // Check if passwords match
      if (newPassword !== confirmPassword) {
        toast.error('New passwords do not match');
        setIsLoading(false);
        return;
      }
      
      // Update admin password
      authData.password = newPassword;
      
      localStorage.setItem('techfest-admin', JSON.stringify(authData));
      toast.success('Password changed successfully');
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Admin Settings</h2>
      
      <div className="glass rounded-xl p-6 max-w-md">
        <h3 className="text-lg font-medium mb-4">Change Admin Password</h3>
        
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input 
              id="current-password" 
              type="password" 
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password (optional)"
            />
            <p className="text-xs text-gray-400">Leave blank to reset password</p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input 
              id="new-password" 
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input 
              id="confirm-password" 
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
          
          <Button 
            onClick={handleChangePassword} 
            disabled={isLoading || !newPassword || !confirmPassword}
            className="w-full"
          >
            {isLoading ? 'Changing Password...' : 'Change Password'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminPasswordChange;
