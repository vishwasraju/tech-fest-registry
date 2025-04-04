
import React, { createContext, useContext, ReactNode } from 'react';
import { Event } from '@/data/events';
import { toast } from 'sonner';

interface AdminContextType {
  handleAddEvent: (formData: any) => Promise<void>;
  handleDeleteEvent: (eventId: string) => Promise<void>;
  handleUpdateEventBackground: (eventId: string, backgroundImage: string) => Promise<void>;
  handleUpdateEventQRCode: (eventId: string, qrCodeUrl: string, isTeamQR?: boolean) => Promise<void>;
}

interface AdminProviderProps {
  children: ReactNode;
  events: Event[];
  onUpdateEvents: (events: Event[]) => Promise<void>;
  registrations: any[];
  setRegistrations: (registrations: any[]) => void;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider: React.FC<AdminProviderProps> = ({ 
  children, 
  events, 
  onUpdateEvents,
  registrations,
  setRegistrations
}) => {
  const handleAddEvent = async (formData: any) => {
    // In a real app, this would be an API call
    const newEvent = {
      id: `event-${events.length + 1}`,
      ...formData
    };
    
    const updatedEvents = [...events, newEvent];
    await onUpdateEvents(updatedEvents);
    toast.success('Event added successfully');
  };
  
  const handleDeleteEvent = async (eventId: string) => {
    // Filter out the deleted event
    const updatedEvents = events.filter(event => event.id !== eventId);
    
    // Also filter out registrations for this event
    const updatedRegistrations = registrations.filter(reg => reg.event_id !== eventId);
    setRegistrations(updatedRegistrations);
    
    // Save to storage
    await onUpdateEvents(updatedEvents);
    toast.success('Event deleted successfully');
  };

  const handleUpdateEventBackground = async (eventId: string, backgroundImage: string) => {
    const updatedEvents = events.map(event => 
      event.id === eventId 
        ? { ...event, background_image: backgroundImage } 
        : event
    );
    
    await onUpdateEvents(updatedEvents);
    toast.success('Event background updated successfully');
  };
  
  const handleUpdateEventQRCode = async (eventId: string, qrCodeUrl: string, isTeamQR = false) => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        if (isTeamQR) {
          return { ...event, team_qr_code_url: qrCodeUrl };
        } else {
          return { ...event, qr_code_url: qrCodeUrl };
        }
      }
      return event;
    });
    
    await onUpdateEvents(updatedEvents);
    toast.success(`${isTeamQR ? 'Team' : 'Solo'} QR code updated successfully`);
  };

  return (
    <AdminContext.Provider value={{
      handleAddEvent,
      handleDeleteEvent,
      handleUpdateEventBackground,
      handleUpdateEventQRCode
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
