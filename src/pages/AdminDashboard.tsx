
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { EVENTS_DATA, loadEventsFromStorage, saveEventsToStorage } from '@/data/events';
import { REGISTRATIONS_DATA } from '@/data/registrations';
import { SPONSORS_DATA, loadSponsorsFromStorage, saveSponsorsToStorage } from '@/data/sponsors';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

// Import refactored components
import AdminTabNav from '@/components/admin/AdminTabNav';
import DashboardOverview from '@/components/admin/DashboardOverview';
import EventsManager from '@/components/admin/EventsManager';
import RegistrationsManager from '@/components/admin/RegistrationsManager';
import SponsorsManager from '@/components/admin/SponsorsManager';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [events, setEvents] = useState(EVENTS_DATA);
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
  
  // Load events from storage
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const loadedEvents = await loadEventsFromStorage();
        setEvents(loadedEvents);
        
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
  
  const handleAddEvent = async (formData: any) => {
    // In a real app, this would be an API call
    const newEvent = {
      id: `event-${events.length + 1}`,
      ...formData
    };
    
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    
    // Save to storage
    const saved = await saveEventsToStorage(updatedEvents);
    if (saved) {
      toast.success('Event added successfully');
    } else {
      toast.error('Failed to save event');
    }
  };
  
  const handleDeleteEvent = async (eventId: string) => {
    // Filter out the deleted event
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    
    // Also filter out registrations for this event
    const updatedRegistrations = registrations.filter(reg => reg.event_id !== eventId);
    setRegistrations(updatedRegistrations);
    
    // Save to storage
    const saved = await saveEventsToStorage(updatedEvents);
    if (saved) {
      toast.success('Event deleted successfully');
    } else {
      toast.error('Failed to delete event');
    }
  };

  const handleUpdateEventBackground = async (eventId: string, backgroundImage: string) => {
    const updatedEvents = events.map(event => 
      event.id === eventId 
        ? { ...event, background_image: backgroundImage } 
        : event
    );
    setEvents(updatedEvents);
    
    // Save to storage
    const saved = await saveEventsToStorage(updatedEvents);
    if (saved) {
      toast.success('Event background updated successfully');
    } else {
      toast.error('Failed to update event background');
    }
  };
  
  const handleUpdateEventQRCode = async (eventId: string, qrCodeUrl: string) => {
    const updatedEvents = events.map(event => 
      event.id === eventId 
        ? { ...event, qr_code_url: qrCodeUrl } 
        : event
    );
    setEvents(updatedEvents);
    
    // Save to storage
    const saved = await saveEventsToStorage(updatedEvents);
    if (saved) {
      toast.success('Event QR code updated successfully');
    } else {
      toast.error('Failed to update event QR code');
    }
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
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-techfest-neon-blue to-techfest-neon-purple text-transparent bg-clip-text">
                Admin Dashboard
              </span>
            </h1>
            
            <Button 
              variant="outline" 
              className="mt-4 md:mt-0 border-gray-600 hover:bg-gray-800"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
          
          {/* Admin Tabs - Update this component to include sponsors tab */}
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
            </div>
          </div>
          
          {/* Loading state */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-techfest-neon-blue"></div>
            </div>
          ) : (
            <>
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
                  onAddEvent={handleAddEvent}
                  onDeleteEvent={handleDeleteEvent}
                  onUpdateEventBackground={handleUpdateEventBackground}
                  onUpdateEventQRCode={handleUpdateEventQRCode}
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
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
