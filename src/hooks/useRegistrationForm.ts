import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/data/events';
import { REGISTRATIONS_DATA } from '@/data/registrations';

interface TeamMember {
  name: string;
  usn: string;
  branch: string; // Changed from optional to required
}

interface FormData {
  name: string;
  usn: string;
  phone: string;
  email: string;
  branch: string;
  utr: string;
  registration_type: 'solo' | 'team';
  team_members?: TeamMember[];
}

export function useRegistrationForm(event: Event | undefined) {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  
  // Initialize based on event configuration
  const getInitialRegistrationType = () => {
    if (!event) return 'solo';
    if (event.registration_type === 'team') return 'team';
    return 'solo';
  };
  
  const getInitialTeamMembers = () => {
    if (!event) return [];
    
    // For team-only events, pre-populate 4 empty team members
    if (event.registration_type === 'team') {
      return Array(4).fill(0).map(() => ({ name: '', usn: '', branch: '' }));
    }
    
    // For both types, return empty array and let user choose
    return [];
  };
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    usn: '',
    phone: '',
    email: '',
    branch: '',
    utr: '',
    registration_type: getInitialRegistrationType(),
    team_members: getInitialTeamMembers()
  });
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // If changing to solo registration, clear team members
    if (name === 'registration_type' && value === 'solo') {
      setFormData(prev => ({ ...prev, [name]: value, team_members: [] }));
    }
    
    // If changing to team registration, initialize team members array with 4 empty entries
    if (name === 'registration_type' && value === 'team') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value, 
        team_members: Array(4).fill(0).map(() => ({ name: '', usn: '', branch: '' }))
      }));
    }
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
    // Only add if we haven't reached 4 members yet
    setFormData(prev => {
      const currentCount = prev.team_members?.length || 0;
      if (currentCount >= 4) {
        return prev; // Don't add more than 4 members
      }
      
      const updatedTeamMembers = [...(prev.team_members || []), { name: '', usn: '', branch: '' }];
      return { ...prev, team_members: updatedTeamMembers };
    });
  };
  
  const removeTeamMember = (index: number) => {
    // Only allow removal if we have more than 1 member for team events
    setFormData(prev => {
      const currentCount = prev.team_members?.length || 0;
      // For team events, we need to maintain at least 4 members
      if (formData.registration_type === 'team' && currentCount <= 4) {
        return prev;
      }
      
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
      
      // Create registration object
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
            paymentStatus: event.fees > 0 ? (formData.utr ? 'paid' : 'pending') : 'free'
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
    removeTeamMember
  };
}
