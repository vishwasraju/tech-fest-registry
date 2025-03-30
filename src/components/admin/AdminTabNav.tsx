
import React from 'react';
import { AreaChart, Calendar, Users } from 'lucide-react';

interface AdminTabNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminTabNav = ({ activeTab, onTabChange }: AdminTabNavProps) => {
  return (
    <div className="flex border-b border-gray-800 mb-8">
      <button
        className={`py-3 px-4 font-medium text-sm border-b-2 ${
          activeTab === 'overview'
            ? 'border-techfest-neon-blue text-techfest-neon-blue'
            : 'border-transparent text-gray-400 hover:text-white'
        }`}
        onClick={() => onTabChange('overview')}
      >
        <div className="flex items-center">
          <AreaChart size={16} className="mr-2" />
          Overview
        </div>
      </button>
      
      <button
        className={`py-3 px-4 font-medium text-sm border-b-2 ${
          activeTab === 'events'
            ? 'border-techfest-neon-purple text-techfest-neon-purple'
            : 'border-transparent text-gray-400 hover:text-white'
        }`}
        onClick={() => onTabChange('events')}
      >
        <div className="flex items-center">
          <Calendar size={16} className="mr-2" />
          Events
        </div>
      </button>
      
      <button
        className={`py-3 px-4 font-medium text-sm border-b-2 ${
          activeTab === 'registrations'
            ? 'border-techfest-neon-pink text-techfest-neon-pink'
            : 'border-transparent text-gray-400 hover:text-white'
        }`}
        onClick={() => onTabChange('registrations')}
      >
        <div className="flex items-center">
          <Users size={16} className="mr-2" />
          Registrations
        </div>
      </button>
    </div>
  );
};

export default AdminTabNav;
