
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Event } from '@/data/events';
import { REGISTRATIONS_DATA } from '@/data/registrations';
import { SPONSORS_DATA, loadSponsorsFromStorage, saveSponsorsToStorage } from '@/data/sponsors';
import { toast } from 'sonner';

// Import refactored components
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
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [registrations, setRegistrations] = useState(REGISTRATIONS_DATA);
  const [sponsors, setSponsors] = useState(SPONSORS_DATA);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check admin authentication
  useEffect(() => {
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
    }
  }, [navigate]);
  
  // Load sponsors from storage
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const loadedSponsors = await loadSponsorsFromStorage();
        setSponsors(loadedSponsors);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);
  
  const handleLogout = () => {
    localStorage.removeItem('techfest-admin');
    toast.success('Logged out successfully');
    navigate('/admin');
  };
  
  // Sponsor handlers
  const handleAddSponsor = async (formData: any) => {
    const newSponsor = {
      id: `sponsor-${sponsors.length + 1}`,
      ...formData
    };
    
    const updatedSponsors = [...sponsors, newSponsor];
    setSponsors(updatedSponsors);
    
    // Save to storage
    const saved = await saveSponsorsToStorage(updatedSponsors);
    if (saved) {
      toast.success('Sponsor added successfully');
    } else {
      toast.error('Failed to save sponsor');
    }
  };
  
  const handleUpdateSponsor = async (id: string, data: Partial<any>) => {
    const updatedSponsors = sponsors.map(sponsor => 
      sponsor.id === id 
        ? { ...sponsor, ...data } 
        : sponsor
    );
    setSponsors(updatedSponsors);
    
    // Save to storage
    const saved = await saveSponsorsToStorage(updatedSponsors);
    if (saved) {
      toast.success('Sponsor updated successfully');
    } else {
      toast.error('Failed to update sponsor');
    }
  };
  
  const handleDeleteSponsor = async (id: string) => {
    const updatedSponsors = sponsors.filter(sponsor => sponsor.id !== id);
    setSponsors(updatedSponsors);
    
    // Save to storage
    const saved = await saveSponsorsToStorage(updatedSponsors);
    if (saved) {
      toast.success('Sponsor deleted successfully');
    } else {
      toast.error('Failed to delete sponsor');
    }
  };
  
  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
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
