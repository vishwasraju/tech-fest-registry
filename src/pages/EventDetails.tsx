
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CalendarDays, MapPin, Users, Trophy, Coins, FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EVENTS_DATA } from '@/data/events';

const EventDetails = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const event = EVENTS_DATA.find(e => e.id === eventId);
  
  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
            <Link to="/events" className="text-techfest-neon-blue hover:underline">
              Back to Events
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <Link to="/events" className="inline-flex items-center text-gray-400 hover:text-techfest-neon-blue mb-8">
            <ArrowLeft size={16} className="mr-2" />
            Back to Events
          </Link>
          
          <div className="glass rounded-xl overflow-hidden">
            {/* Event Header */}
            <div className="p-8 border-b border-gray-800">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center text-gray-400">
                      <CalendarDays size={16} className="mr-1.5 text-techfest-neon-purple" />
                      <span>{event.date_time}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-400">
                      <MapPin size={16} className="mr-1.5 text-techfest-neon-purple" />
                      <span>{event.venue}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-400">
                      <Users size={16} className="mr-1.5 text-techfest-neon-purple" />
                      <span>Team Size: {event.team_size}</span>
                    </div>
                  </div>
                </div>
                
                <Link to={`/register/${event.id}`}>
                  <Button className="bg-gradient-to-r from-techfest-neon-blue to-techfest-neon-purple hover:opacity-90">
                    Register Now
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Event Details */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <FileText size={20} className="mr-2 text-techfest-neon-blue" />
                      Description
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <FileText size={20} className="mr-2 text-techfest-neon-blue" />
                      Rules
                    </h3>
                    <div className="text-gray-300 leading-relaxed">
                      {event.rules.split('\n').map((rule, index) => (
                        <p key={index} className="mb-2">{rule}</p>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="glass p-6 rounded-lg">
                    <h3 className="text-lg font-bold mb-4">Event Details</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Entry Fee</p>
                        <div className="flex items-center">
                          <Coins size={18} className="mr-2 text-techfest-neon-pink" />
                          <span className="text-lg font-semibold">
                            {event.fees > 0 ? `₹${event.fees}` : 'Free Entry'}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Cash Prize</p>
                        <div className="flex items-center">
                          <Trophy size={18} className="mr-2 text-techfest-neon-pink" />
                          <span className="text-lg font-semibold">
                            {event.cash_prize > 0 ? `₹${event.cash_prize}` : 'Certificate Only'}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Team Size</p>
                        <div className="flex items-center">
                          <Users size={18} className="mr-2 text-techfest-neon-blue" />
                          <span className="text-lg font-semibold">
                            {event.team_size > 1 
                              ? `${event.team_size} members per team` 
                              : 'Individual Event'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Link to={`/register/${event.id}`}>
                        <Button className="w-full bg-gradient-to-r from-techfest-neon-blue to-techfest-neon-purple hover:opacity-90">
                          Register Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EventDetails;
