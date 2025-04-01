
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RegisterForm from '@/components/RegisterForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Event } from '@/data/events';

interface RegisterProps {
  events: Event[];
}

const Register = ({ events }: RegisterProps) => {
  const { eventId } = useParams<{ eventId: string }>();
  const event = events.find(e => e.id === eventId);
  
  if (!event) {
    return <Navigate to="/events" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Link to={`/events/${eventId}`} className="inline-flex items-center text-gray-400 hover:text-white">
              <ArrowLeft size={16} className="mr-2" />
              Back to Event
            </Link>
          </div>
          
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Register for {event.name}</h1>
            <p className="text-gray-400">Fill out the form below to register for this event.</p>
          </div>
          
          <RegisterForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
