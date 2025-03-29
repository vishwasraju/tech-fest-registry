
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EventCard from '@/components/EventCard';
import { EVENTS_DATA } from '@/data/events';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter events based on search term only
  const filteredEvents = EVENTS_DATA.filter(event => {
    return event.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           event.description.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="py-10 md:py-16 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-techfest-neon-blue to-techfest-neon-purple text-transparent bg-clip-text">
                All Events
              </span>
            </h1>
            <p className="text-gray-400">
              Browse through our lineup of exciting technical events and register for those that interest you.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="glass p-4 rounded-lg">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input 
                  type="text"
                  placeholder="Search events..."
                  className="pl-10 bg-techfest-muted text-white border-techfest-muted"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-400">No events match your search criteria.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Events;
