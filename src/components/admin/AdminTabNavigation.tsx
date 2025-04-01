
import React from 'react';

interface AdminTabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminTabNavigation: React.FC<AdminTabNavigationProps> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  return (
    <div className="border-b border-gray-800 mb-8">
      <div className="flex flex-wrap -mb-px">
        <button
          className={`mr-4 py-2 px-1 border-b-2 ${
            activeTab === 'overview' 
              ? 'border-techfest-neon-blue text-techfest-neon-blue' 
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        
        <button
          className={`mr-4 py-2 px-1 border-b-2 ${
            activeTab === 'events' 
              ? 'border-techfest-neon-purple text-techfest-neon-purple' 
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('events')}
        >
          Events
        </button>
        
        <button
          className={`mr-4 py-2 px-1 border-b-2 ${
            activeTab === 'registrations' 
              ? 'border-techfest-neon-pink text-techfest-neon-pink' 
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('registrations')}
        >
          Registrations
        </button>
        
        <button
          className={`mr-4 py-2 px-1 border-b-2 ${
            activeTab === 'sponsors' 
              ? 'border-yellow-500 text-yellow-500' 
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('sponsors')}
        >
          Sponsors
        </button>
        
        <button
          className={`mr-4 py-2 px-1 border-b-2 ${
            activeTab === 'settings' 
              ? 'border-green-500 text-green-500' 
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>
    </div>
  );
};

export default AdminTabNavigation;
