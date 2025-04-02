
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Event } from '@/data/events';
import EventCard from './EventCard';

interface EventSectionProps {
  events: Event[];
}

const EventSection = ({ events }: EventSectionProps) => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">
            Featured <span className="text-techfest-neon-blue">Events</span>
          </h2>
          
          <Link to="/events">
            <Button variant="outline" className="border-techfest-neon-blue text-techfest-neon-blue">
              View All <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventSection;
