
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RegisterForm from '@/components/RegisterForm';
import { EVENTS_DATA } from '@/data/events';

const Register = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const event = EVENTS_DATA.find(e => e.id === eventId);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">
            Registration for 
            <span className="text-techfest-neon-blue ml-2">
              {event?.name || 'Event'}
            </span>
          </h1>
          
          <RegisterForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
