
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Event } from '@/data/events';
import { useTeamMembers } from './useTeamMembers';
import { useRegistrationSubmission } from './useRegistrationSubmission';

interface FormData {
  name: string;
  usn: string;
  phone: string;
  email: string;
  branch: string;
  utr: string;
  registration_type: 'solo' | 'team';
  team_members?: Array<{
    name: string;
    usn: string;
    branch: string;
  }>;
}

export function useRegistrationForm(event: Event | undefined) {
  const { eventId } = useParams<{ eventId: string }>();
  
  // Initialize based on event configuration
  const getInitialRegistrationType = () => {
    if (!event) return 'solo';
    if (event.registration_type === 'team') return 'team';
    return 'solo';
  };
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    usn: '',
    phone: '',
    email: '',
    branch: '',
    utr: '',
    registration_type: getInitialRegistrationType(),
    team_members: []
  });
  
  const [step, setStep] = useState(1);
  
  const { 
    teamMembers,
    handleTeamMemberChange,
    addTeamMember,
    removeTeamMember,
    ensureTeamSize
  } = useTeamMembers(event);
  
  const { isSubmitting, handleSubmit: submitRegistration } = useRegistrationSubmission(event);
  
  // Update formData with teamMembers whenever they change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      team_members: teamMembers
    }));
  }, [teamMembers]);
  
  // Sync team members when registration type changes
  useEffect(() => {
    if (event) {
      ensureTeamSize(formData.registration_type);
    }
  }, [event, formData.registration_type, ensureTeamSize]);
  
  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Special handling for registration_type changes
    if (name === 'registration_type') {
      ensureTeamSize(value as 'solo' | 'team');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId) return;
    
    await submitRegistration(formData, eventId);
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
