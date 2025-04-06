
import React, { createContext, useContext, ReactNode } from 'react';
import { Event } from '@/data/events';
import { toast } from 'sonner';
import { uploadFile } from '@/utils/storageUtils';
import { supabase } from '@/integrations/supabase/client';

interface AdminContextType {
  handleAddEvent: (formData: any) => Promise<void>;
  handleDeleteEvent: (eventId: string) => Promise<void>;
  handleUpdateEventBackground: (eventId: string, backgroundImage: string | File) => Promise<void>;
  handleUpdateEventQRCode: (eventId: string, qrCodeUrl: string, isTeam?: boolean) => Promise<void>;
  handleEditEvent: (eventId: string, formData: any) => Promise<void>;
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

  const handleUpdateEventBackground = async (eventId: string, backgroundImage: string | File) => {
    let backgroundUrl = '';
    
    if (typeof backgroundImage === 'string') {
      // If it's already a URL, use it directly
      backgroundUrl = backgroundImage;
    } else {
      // If it's a File, upload it to Supabase Storage
      try {
        // Create a unique filename for the image
        const fileExt = backgroundImage.name.split('.').pop();
        const fileName = `${eventId}_${Date.now()}.${fileExt}`;
        
        // Upload to Supabase Storage and get the URL
        const uploadedUrl = await uploadFile(
          backgroundImage,
          'event-images',
          fileName
        );
        
        if (uploadedUrl) {
          backgroundUrl = uploadedUrl;
        } else {
          toast.error('Failed to upload image');
          return;
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to upload image');
        return;
      }
    }
    
    const updatedEvents = events.map(event => 
      event.id === eventId 
        ? { ...event, background_image: backgroundUrl } 
        : event
    );
    
    await onUpdateEvents(updatedEvents);
    toast.success('Event background updated successfully');
  };
  
  const handleUpdateEventQRCode = async (eventId: string, qrCodeUrl: string) => {
    const updatedEvents = events.map(event => 
      event.id === eventId 
        ? { ...event, qr_code_url: qrCodeUrl } 
        : event
    );
    
    await onUpdateEvents(updatedEvents);
    toast.success('Event QR code updated successfully');
  };
  
  const handleEditEvent = async (eventId: string, formData: any) => {
    console.log("Editing event:", eventId, formData);
    const updatedEvents = events.map(event => 
      event.id === eventId 
        ? { ...event, ...formData } 
        : event
    );
    
    await onUpdateEvents(updatedEvents);
    toast.success('Event updated successfully');
  };

  return (
    <AdminContext.Provider value={{
      handleAddEvent,
      handleDeleteEvent,
      handleUpdateEventBackground,
      handleUpdateEventQRCode,
      handleEditEvent
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
