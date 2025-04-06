
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Event, EVENTS_DATA } from '@/data/events';
import PersonalDetailsForm from '@/components/register/PersonalDetailsForm';
import PaymentForm from '@/components/register/PaymentForm';
import { useRegistrationForm } from '@/hooks/useRegistrationForm';

const RegisterForm = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | undefined>(undefined);
  
  useEffect(() => {
    // Try to find the event by ID from the EVENTS_DATA
    const foundEvent = EVENTS_DATA.find(e => e.id === eventId);
    setEvent(foundEvent);
  }, [eventId]);
  
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
    removeTeamMember,
    handleGameSelection
  } = useRegistrationForm(event);
  
  if (!event) {
    return <div className="text-center py-10">Event not found</div>;
  }
  
  const isGamingEvent = event.name.toLowerCase().includes('gaming') || 
                        event.description.toLowerCase().includes('pubg') ||
                        event.description.toLowerCase().includes('free fire');
  
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
          onGameSelection={handleGameSelection}
          isGamingEvent={isGamingEvent}
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
