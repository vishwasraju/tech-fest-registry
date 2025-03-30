
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { EVENTS_DATA } from '@/data/events';
import { REGISTRATIONS_DATA } from '@/data/registrations';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

// Import refactored components
import AdminTabNav from '@/components/admin/AdminTabNav';
import DashboardOverview from '@/components/admin/DashboardOverview';
import EventsManager from '@/components/admin/EventsManager';
import RegistrationsManager from '@/components/admin/RegistrationsManager';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [events, setEvents] = useState(EVENTS_DATA);
  const [registrations, setRegistrations] = useState(REGISTRATIONS_DATA);
  
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
  
  const handleLogout = () => {
    localStorage.removeItem('techfest-admin');
    toast.success('Logged out successfully');
    navigate('/admin');
  };
  
  const handleAddEvent = (formData: any) => {
    // In a real app, this would be an API call
    const newEvent = {
      id: `event-${events.length + 1}`,
      ...formData
    };
    
    setEvents([...events, newEvent]);
    toast.success('Event added successfully');
  };
  
  const handleDeleteEvent = (eventId: string) => {
    // In a real app, this would be an API call
    setEvents(events.filter(event => event.id !== eventId));
    // Also filter out registrations for this event
    setRegistrations(registrations.filter(reg => reg.event_id !== eventId));
    toast.success('Event deleted successfully');
  };

  const handleUpdateEventBackground = (eventId: string, backgroundImage: string) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, background_image: backgroundImage } 
        : event
    ));
    toast.success('Event background updated successfully');
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
          
          {/* Admin Tabs */}
          <AdminTabNav activeTab={activeTab} onTabChange={setActiveTab} />
          
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
            />
          )}
          
          {activeTab === 'registrations' && (
            <RegistrationsManager 
              events={events} 
              registrations={registrations} 
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
