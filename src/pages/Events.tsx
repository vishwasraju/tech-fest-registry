
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EventCard from '@/components/EventCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Event } from '@/data/events';

interface EventsPageProps {
  events: Event[];
}

const Events = ({ events }: EventsPageProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  
  // Get unique categories from events
  const categories = ['all', ...new Set(events
    .map(event => event.category)
    .filter(Boolean) as string[])];
  
  // Filter events based on search query and category
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filter === 'all' || event.category === filter;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-techfest-neon-blue to-techfest-neon-purple text-transparent bg-clip-text">
                Events
              </span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explore our exciting lineup of events and competitions. Register early to secure your spot!
            </p>
          </div>
          
          {/* Search and Filter */}
          <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="col-span-1 md:col-span-2 relative">
              <label htmlFor="search" className="block text-sm mb-2">Search Events</label>
              <div className="relative">
                <Input
                  id="search"
                  type="text"
                  placeholder="Search by event name or description..."
                  className="pl-10 bg-techfest-muted text-white border-techfest-muted"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>
            
            <div>
              <label htmlFor="category-filter" className="block text-sm mb-2">Filter by Category</label>
              <select
                id="category-filter"
                className="w-full h-10 px-3 py-2 bg-techfest-muted text-white border-techfest-muted rounded-md"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No events found matching your criteria.</p>
              <p className="text-gray-500 mt-2">Try adjusting your search or filter.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Events;
