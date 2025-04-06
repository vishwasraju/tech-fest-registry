
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
  team_members?: Array<{
    name: string;
    usn: string;
    branch?: string;
  }>;
  game_selection?: string;
}

export function useRegistrationForm(event: Event | undefined) {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  
  // Initialize team_members array only if this is a team event (team_size > 1)
  const isTeamEvent = event && event.team_size > 1;
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    usn: '',
    phone: '',
    email: '',
    branch: '',
    utr: '',
    team_members: isTeamEvent ? [] : undefined,
    game_selection: undefined
  });
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleGameSelection = (game: string) => {
    setFormData(prev => ({ ...prev, game_selection: game }));
  };
  
  const handleTeamMemberChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const updatedTeamMembers = [...(prev.team_members || [])];
      updatedTeamMembers[index] = {
        ...updatedTeamMembers[index],
        [field]: value
      };
      return { ...prev, team_members: updatedTeamMembers };
    });
  };
  
  const addTeamMember = () => {
    setFormData(prev => {
      const updatedTeamMembers = [...(prev.team_members || []), { name: '', usn: '', branch: '' }];
      return { ...prev, team_members: updatedTeamMembers };
    });
  };
  
  const removeTeamMember = (index: number) => {
    setFormData(prev => {
      const updatedTeamMembers = [...(prev.team_members || [])];
      updatedTeamMembers.splice(index, 1);
      return { ...prev, team_members: updatedTeamMembers };
    });
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
      
      // Calculate fee to use for payment
      let fee = 0;
      if (event.team_size > 1 && event.team_registration_fees !== undefined) {
        fee = event.team_registration_fees;
      } else if (event.fees !== undefined) {
        fee = event.fees;
      }
      
      // Create registration object
      const registrationData = {
        id: registrationId,
        event_id: eventId,
        name: formData.name,
        usn: formData.usn,
        phone: formData.phone,
        email: formData.email,
        branch: formData.branch,
        utr: fee > 0 ? formData.utr : undefined,
        team_members: event.team_size > 1 ? formData.team_members : undefined,
        game_selection: formData.game_selection
      };
      
      // Add to local storage registrations array
      REGISTRATIONS_DATA.push(registrationData);
      
      // Save to Supabase
      try {
        // Insert registration record into Supabase
        // Use type casting to avoid TypeScript errors
        const { error } = await (supabase as any)
          .from('registrations')
          .insert(registrationData);
        
        if (error) {
          console.error('Error saving to Supabase:', error);
          // Continue with local storage even if Supabase fails
        }
        
        // Also try the storage backup method as fallback
        try {
          // Prepare registration data for Supabase Storage
          const supabaseRegistrationData = {
            ...registrationData,
            eventName: event.name,
            registrationDate: new Date().toISOString(),
            paymentStatus: fee > 0 ? (formData.utr ? 'paid' : 'pending') : 'free'
          };
          
          // Save registration data to Supabase Storage
          const fileName = `${formData.usn}_${eventId}_${Date.now()}.json`;
          const { error: storageError } = await supabase.storage
            .from('registrations')
            .upload(fileName, JSON.stringify(supabaseRegistrationData), {
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
    previousStep,
    handleTeamMemberChange,
    addTeamMember,
    removeTeamMember,
    handleGameSelection
  };
}
