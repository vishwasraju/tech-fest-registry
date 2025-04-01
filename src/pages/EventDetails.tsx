
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Calendar, User, MapPin, Trophy, CreditCard, Users } from 'lucide-react';
import { Event } from '@/data/events';

interface EventDetailsProps {
  events: Event[];
}

const EventDetails = ({ events }: EventDetailsProps) => {
  const { eventId } = useParams<{ eventId: string }>();
  const event = events.find(e => e.id === eventId);
  
  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-20">
          <div className="container mx-auto text-center">
            <h1 className="text-3xl font-bold mb-6">Event Not Found</h1>
            <p className="mb-8">Sorry, the event you're looking for doesn't exist or has been removed.</p>
            <Link to="/events">
              <Button>Back to Events</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const backgroundImageStyle = event.background_image ? {
    backgroundImage: `linear-gradient(to bottom, rgba(9, 9, 18, 0.7), rgba(9, 9, 18, 0.8)), url(${event.background_image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  } : {};
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="py-20 relative" style={backgroundImageStyle}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{event.name}</h1>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center glass px-3 py-1.5 rounded-full">
                <Calendar size={16} className="mr-2 text-techfest-neon-blue" />
                <span>{event.date_time}</span>
              </div>
              
              <div className="flex items-center glass px-3 py-1.5 rounded-full">
                <MapPin size={16} className="mr-2 text-techfest-neon-pink" />
                <span>{event.venue}</span>
              </div>
              
              <div className="flex items-center glass px-3 py-1.5 rounded-full">
                <User size={16} className="mr-2 text-techfest-neon-purple" />
                <span>Team: {event.team_size > 1 ? `${event.team_size} members` : 'Individual'}</span>
              </div>
              
              {event.cash_prize > 0 && (
                <div className="flex items-center glass px-3 py-1.5 rounded-full">
                  <Trophy size={16} className="mr-2 text-yellow-500" />
                  <span>Prize: ₹{event.cash_prize}</span>
                </div>
              )}
              
              <div className="flex items-center glass px-3 py-1.5 rounded-full">
                <CreditCard size={16} className="mr-2 text-green-500" />
                <span>{event.fees > 0 ? `Fee: ₹${event.fees}` : 'Free Entry'}</span>
              </div>
            </div>
            
            <div className="glass p-6 md:p-8 rounded-xl mb-8">
              <h2 className="text-xl font-semibold mb-4">About This Event</h2>
              <p className="mb-6 whitespace-pre-line">{event.description}</p>
              
              {/* Coordinators Section */}
              {(event.coordinators?.length > 0 || event.student_coordinators?.length > 0) && (
                <div className="mb-6 p-4 bg-gray-900/50 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3 text-techfest-neon-blue">Contact Information</h3>
                  
                  {event.coordinators && event.coordinators.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-md font-medium mb-2 flex items-center">
                        <Users size={16} className="mr-2 text-techfest-neon-pink" />
                        Faculty Coordinators
                      </h4>
                      <ul className="list-disc pl-6">
                        {event.coordinators.map((coordinator, index) => (
                          <li key={index} className="mb-1">{coordinator}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {event.student_coordinators && event.student_coordinators.length > 0 && (
                    <div>
                      <h4 className="text-md font-medium mb-2 flex items-center">
                        <Users size={16} className="mr-2 text-techfest-neon-purple" />
                        Student Coordinators
                      </h4>
                      <ul className="list-disc pl-6">
                        {event.student_coordinators.map((coordinator, index) => (
                          <li key={index} className="mb-1">{coordinator}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              <h2 className="text-xl font-semibold mb-4">Rules & Guidelines</h2>
              <div className="whitespace-pre-line">{event.rules}</div>
            </div>
            
            <div className="text-center">
              <Link to={`/register/${event.id}`}>
                <Button size="lg" className="bg-gradient-to-r from-techfest-neon-blue to-techfest-neon-purple hover:opacity-90">
                  Register Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EventDetails;
