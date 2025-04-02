
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

type AdminCredentials = {
  id: string;
  username: string;
  password: string;
  created_at: string;
  updated_at: string;
};

const AdminPasswordChange = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChangePassword = async () => {
    setIsLoading(true);
    
    try {
      // Validate form inputs
      if (newPassword.length < 6) {
        toast.error('New password must be at least 6 characters');
        setIsLoading(false);
        return;
      }
      
      if (newPassword !== confirmPassword) {
        toast.error('New passwords do not match');
        setIsLoading(false);
        return;
      }
      
      console.log("Fetching admin credentials");
      
      // Get admin credentials with proper type assertion
      const { data: adminCredentials, error: fetchError } = await supabase
        .from('admin_credentials')
        .select('id, username, password')
        .eq('username', 'admin')
        .single() as unknown as { 
          data: AdminCredentials | null; 
          error: any;
        };
      
      if (fetchError) {
        console.error('Error fetching admin credentials:', fetchError);
        toast.error('Failed to verify current password');
        setIsLoading(false);
        return;
      }
      
      console.log("Admin credentials found:", adminCredentials ? "yes" : "no");
      
      // Validate current password
      if (!adminCredentials || currentPassword !== adminCredentials.password) {
        toast.error('Current password is incorrect');
        setIsLoading(false);
        return;
      }
      
      console.log("Updating password for admin ID:", adminCredentials.id);
      
      // Update password in Supabase with proper type assertion
      const { error: updateError } = await supabase
        .from('admin_credentials')
        .update({ 
          password: newPassword,
          updated_at: new Date().toISOString()
        })
        .eq('id', adminCredentials.id) as unknown as { error: any };
      
      if (updateError) {
        console.error('Error updating password:', updateError);
        toast.error('Failed to change password');
        setIsLoading(false);
        return;
      }
      
      toast.success('Password changed successfully');
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      console.log('Password updated successfully');
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
              placeholder="Enter current password"
            />
            <p className="text-xs text-gray-400">Current password is "admin123"</p>
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
