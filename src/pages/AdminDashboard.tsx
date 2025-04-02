
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Event } from '@/data/events';
import { REGISTRATIONS_DATA } from '@/data/registrations';
import { toast } from 'sonner';

// Import custom hooks
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useSponsorsManager } from '@/hooks/useSponsorsManager';

// Import admin components
import AdminHeader from '@/components/admin/AdminHeader';
import AdminTabNavigation from '@/components/admin/AdminTabNavigation';
import AdminLoading from '@/components/admin/AdminLoading';
import DashboardOverview from '@/components/admin/DashboardOverview';
import EventsManager from '@/components/admin/EventsManager';
import RegistrationsManager from '@/components/admin/RegistrationsManager';
import SponsorsManager from '@/components/admin/SponsorsManager';
import AdminPasswordChange from '@/components/admin/AdminPasswordChange';
import { AdminProvider } from '@/contexts/AdminContext';

interface AdminDashboardProps {
  events: Event[];
  onUpdateEvents: (events: Event[]) => Promise<void>;
}

const AdminDashboard = ({ events, onUpdateEvents }: AdminDashboardProps) => {
  // Use custom hooks
  const { isAuthenticated, isLoading: authLoading, handleLogout } = useAdminAuth();
  const { 
    sponsors, 
    isLoading: sponsorsLoading, 
    handleAddSponsor, 
    handleUpdateSponsor, 
    handleDeleteSponsor 
  } = useSponsorsManager();
  
  // Local state
  const [activeTab, setActiveTab] = useState('overview');
  const [registrations, setRegistrations] = useState(REGISTRATIONS_DATA);
  
  const isLoading = authLoading || sponsorsLoading;
  
  if (!isAuthenticated) {
    return null; // Will redirect via useEffect in useAdminAuth
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4">
          <AdminHeader onLogout={handleLogout} />
          
          {/* Admin Tabs */}
          <AdminTabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          
          {/* Loading state */}
          {isLoading ? (
            <AdminLoading />
          ) : (
            <AdminProvider 
              events={events} 
              onUpdateEvents={onUpdateEvents} 
              registrations={registrations}
              setRegistrations={setRegistrations}
            >
              {/* Tab Content */}
              {activeTab === 'overview' && (
                <DashboardOverview 
                  events={events} 
                  registrations={registrations} 
                />
              )}
              
              {activeTab === 'events' && (
                <EventsManager 
                  events={events} 
                  registrations={registrations} 
                />
              )}
              
              {activeTab === 'registrations' && (
                <RegistrationsManager 
                  events={events} 
                  registrations={registrations} 
                />
              )}
              
              {activeTab === 'sponsors' && (
                <SponsorsManager 
                  sponsors={sponsors}
                  onAddSponsor={handleAddSponsor}
                  onUpdateSponsor={handleUpdateSponsor}
                  onDeleteSponsor={handleDeleteSponsor}
                />
              )}
              
              {activeTab === 'settings' && (
                <AdminPasswordChange />
              )}
            </AdminProvider>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
