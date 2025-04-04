
import React from 'react';
import { useParams } from 'react-router-dom';
import { EVENTS_DATA } from '@/data/events';
import PersonalDetailsForm from '@/components/register/PersonalDetailsForm';
import PaymentForm from '@/components/register/PaymentForm';
import { useRegistrationForm } from '@/hooks/useRegistrationForm';

const RegisterForm = () => {
  const { eventId } = useParams<{ eventId: string }>();
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
  
  if (!event) {
    return <div className="text-center py-10">Event not found</div>;
  }
  
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
