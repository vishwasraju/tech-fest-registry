import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EVENTS_DATA } from '@/data/events';
import PersonalDetailsForm from '@/components/register/PersonalDetailsForm';
import PaymentForm from '@/components/register/PaymentForm';
import { useRegistrationForm } from '@/hooks/useRegistrationForm';
import { toast } from 'sonner';

const RegisterForm = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const event = EVENTS_DATA.find(e => e.id === eventId);
  
  const {
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
  } = useRegistrationForm(event);
  
  useEffect(() => {
    if (!event) {
      toast.error("Event not found", {
        description: "The event you're looking for doesn't exist or has been removed."
      });
      navigate('/events', { replace: true });
    }
  }, [event, navigate]);
  
  // Use another effect to ensure team member data matches the event requirements
  useEffect(() => {
    if (event && formData.registration_type === 'team') {
      if (!formData.team_members || formData.team_members.length < 4) {
        // Ensure we have exactly 4 team members for team registrations
        const requiredTeamMembers = Array(4).fill(0).map(() => ({ name: '', usn: '', branch: '' }));
        
        // If we already have some team members, preserve their data
        if (formData.team_members && formData.team_members.length > 0) {
          formData.team_members.forEach((member, index) => {
            if (index < 4) {
              // Ensure branch is never undefined by providing an empty string as default
              requiredTeamMembers[index] = { 
                name: member.name || '', 
                usn: member.usn || '', 
                branch: member.branch || '' 
              };
            }
          });
        }
        
        // Update the form data with the required team members
        handleChange('team_members', JSON.stringify(requiredTeamMembers));
      }
    }
  }, [event, formData.registration_type]);
  
  if (!event) {
    return (
      <div className="text-center py-10 glass px-6 rounded-xl">
        <h3 className="text-xl font-medium mb-4">Event Not Found</h3>
        <p className="text-gray-400">
          This event doesn't exist or has been removed. Redirecting to events page...
        </p>
      </div>
    );
  }
  
  // Check if this event supports solo/team options
  const showRegistrationTypeOptions = event.registration_type === 'both';
  
  return (
    <div className="max-w-md mx-auto glass px-6 py-8 rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Register for <span className="text-techfest-neon-blue">{event.name}</span>
      </h2>
      
      {step === 1 ? (
        <PersonalDetailsForm 
          formData={formData}
          event={event}
          onDataChange={handleChange}
          onTeamMemberChange={handleTeamMemberChange}
          onAddTeamMember={addTeamMember}
          onRemoveTeamMember={removeTeamMember}
          onNext={nextStep}
        />
      ) : (
        <PaymentForm 
          event={event}
          utr={formData.utr}
          registrationType={formData.registration_type}
          onDataChange={handleChange}
          onBack={previousStep}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default RegisterForm;
