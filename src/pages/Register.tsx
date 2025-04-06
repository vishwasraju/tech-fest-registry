
import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RegisterForm from '@/components/RegisterForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, UserRound } from 'lucide-react';
import { Event, EVENTS_DATA } from '@/data/events';

const Register = ({ events }: { events: Event[] }) => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | undefined>();
  
  useEffect(() => {
    // First check in the props
    let foundEvent = events.find(e => e.id === eventId);
    
    // If not found in props, check in the default events data
    if (!foundEvent) {
      foundEvent = EVENTS_DATA.find(e => e.id === eventId);
    }
    
    setEvent(foundEvent);
  }, [eventId, events]);
  
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
            <p className="text-gray-400 mb-4">Fill out the form below to register for this event.</p>
            
            <div className="flex justify-center items-center mb-4">
              <div className="glass px-4 py-2 rounded-full flex items-center">
                {event.team_size > 1 ? (
                  <>
                    <Users size={16} className="mr-2 text-techfest-neon-purple" />
                    <span>Team Event ({event.team_size} members)</span>
                  </>
                ) : (
                  <>
                    <UserRound size={16} className="mr-2 text-techfest-neon-blue" />
                    <span>Individual Event</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <RegisterForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
