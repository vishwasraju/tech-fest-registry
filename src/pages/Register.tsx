
import React, { useEffect } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RegisterForm from '@/components/RegisterForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, UserRound } from 'lucide-react';
import { Event } from '@/data/events';
import { toast } from 'sonner';

interface RegisterProps {
  events: Event[];
}

const Register = ({ events }: RegisterProps) => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const event = events.find(e => e.id === eventId);
  
  useEffect(() => {
    if (!event) {
      toast.error("Event not found", {
        description: "The event you're looking for doesn't exist or has been removed."
      });
      // Small delay before redirecting
      const redirectTimer = setTimeout(() => {
        navigate('/events', { replace: true });
      }, 2000);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [event, navigate]);
  
  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto glass p-8 rounded-xl text-center">
              <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
              <p className="text-gray-400 mb-6">
                The event you're looking for doesn't exist or has been removed.
                Redirecting to events page...
              </p>
              <Link to="/events">
                <Button>
                  Go to Events
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
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
