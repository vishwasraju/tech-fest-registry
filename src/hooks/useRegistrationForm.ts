
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/data/events';
import { REGISTRATIONS_DATA } from '@/data/registrations';

interface FormData {
  name: string;
  usn: string;
  phone: string;
  email: string;
  branch: string;
  utr: string;
}

export function useRegistrationForm(event: Event | undefined) {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    usn: '',
    phone: '',
    email: '',
    branch: '',
    utr: ''
  });
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventId || !event) {
      toast.error('Event information is missing');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate a unique ID for the registration
      const registrationId = `reg-${Date.now()}`;
      
      // Create registration object
      const registrationData = {
        id: registrationId,
        event_id: eventId,
        name: formData.name,
        usn: formData.usn,
        phone: formData.phone,
        email: formData.email,
        branch: formData.branch,
        utr: event.fees > 0 ? formData.utr : undefined
      };
      
      // Add to local storage registrations array
      REGISTRATIONS_DATA.push(registrationData);
      
      // Save to Supabase if available
      try {
        // Prepare registration data for Supabase
        const supabaseRegistrationData = {
          ...registrationData,
          eventName: event.name,
          registrationDate: new Date().toISOString(),
          paymentStatus: event.fees > 0 ? (formData.utr ? 'paid' : 'pending') : 'free'
        };
        
        // Save registration data to Supabase Storage
        const fileName = `${formData.usn}_${eventId}_${Date.now()}.json`;
        const { error } = await supabase.storage
          .from('registrations')
          .upload(fileName, JSON.stringify(supabaseRegistrationData), {
            contentType: 'application/json',
            upsert: false
          });
        
        if (error) {
          console.error('Error saving to Supabase:', error);
          // Continue with local storage even if Supabase fails
        }
      } catch (error) {
        console.log('Supabase storage error:', error);
        // Continue with local storage even if Supabase fails
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
  
  const nextStep = () => {
    setStep(2);
  };
  
  const previousStep = () => {
    setStep(1);
  };
  
  return {
    formData,
    step,
    isSubmitting,
    handleChange,
    handleSubmit,
    nextStep,
    previousStep
  };
}
