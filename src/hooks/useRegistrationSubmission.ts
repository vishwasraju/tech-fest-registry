
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { REGISTRATIONS_DATA } from '@/data/registrations';
import { Event } from '@/data/events';
import { TeamMember } from '@/data/registrations';

interface RegistrationData {
  name: string;
  usn: string;
  phone: string;
  email: string;
  branch: string;
  utr: string;
  registration_type: 'solo' | 'team';
  team_members?: TeamMember[];
}

export function useRegistrationSubmission(event: Event | undefined) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (formData: RegistrationData, eventId: string) => {
    if (!eventId || !event) {
      toast.error('Event information is missing');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate a unique ID for the registration
      const registrationId = `reg-${Date.now()}`;
      
      // Create registration object for local storage
      const registrationData = {
        id: registrationId,
        event_id: eventId,
        name: formData.name,
        usn: formData.usn,
        phone: formData.phone,
        email: formData.email,
        branch: formData.branch,
        utr: event.fees > 0 ? formData.utr : undefined,
        registration_type: formData.registration_type,
        team_members: formData.registration_type === 'team' ? formData.team_members : undefined
      };
      
      // Add to local storage registrations array
      REGISTRATIONS_DATA.push(registrationData);
      
      // Save to Supabase - prepare the payload that matches the Supabase schema
      try {
        // Convert team_members to JSON string for Supabase compatibility 
        // This provides explicit typing that aligns with Supabase's expectations
        const supabaseRegistrationData = {
          id: registrationId,
          event_id: eventId,
          name: formData.name,
          usn: formData.usn,
          phone: formData.phone,
          email: formData.email,
          branch: formData.branch,
          utr: event.fees > 0 ? formData.utr : null,
          // Use as JSON cast to align with Supabase's expected Json type
          team_members: formData.registration_type === 'team' && formData.team_members 
            ? formData.team_members as unknown as Record<string, any>
            : null
        };
        
        // Insert registration record into Supabase
        const { error } = await supabase
          .from('registrations')
          .insert(supabaseRegistrationData);
        
        if (error) {
          console.error('Error saving to Supabase:', error);
          // Continue with local storage even if Supabase fails
        }
        
        // Also try the storage backup method as fallback
        try {
          // Prepare registration data for Supabase Storage
          const supabaseStorageData = {
            ...registrationData,
            eventName: event.name,
            registrationDate: new Date().toISOString(),
            paymentStatus: event.fees > 0 ? (formData.utr ? 'paid' : 'pending') : 'free'
          };
          
          // Save registration data to Supabase Storage
          const fileName = `${formData.usn}_${eventId}_${Date.now()}.json`;
          const { error: storageError } = await supabase.storage
            .from('registrations')
            .upload(fileName, JSON.stringify(supabaseStorageData), {
              contentType: 'application/json',
              upsert: false
            });
          
          if (storageError) {
            console.error('Error saving to Supabase Storage:', storageError);
          }
        } catch (error) {
          console.log('Supabase storage error:', error);
        }
      } catch (error) {
        console.log('Supabase database error:', error);
      }
      
      toast.success('Registration successful!', {
        description: 'Thank you for registering for this event!',
      });
      
      setTimeout(() => {
        navigate('/registration-success');
      }, 1500);
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed', {
        description: 'There was a problem with your registration. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit
  };
}
