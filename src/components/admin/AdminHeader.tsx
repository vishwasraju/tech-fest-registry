
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface AdminHeaderProps {
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">
        <span className="bg-gradient-to-r from-techfest-neon-blue to-techfest-neon-purple text-transparent bg-clip-text">
          Admin Dashboard
        </span>
      </h1>
      
      <Button 
        variant="outline" 
        className="mt-4 md:mt-0 border-gray-600 hover:bg-gray-800"
        onClick={onLogout}
      >
        <LogOut size={16} className="mr-2" />
        Logout
      </Button>
    </div>
  );
};

export default AdminHeader;
