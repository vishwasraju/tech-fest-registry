
import React from 'react';
import { CalendarDays, MapPin, Users, Trophy, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export interface EventProps {
  id: string;
  name: string;
  description: string;
  date_time: string;
  venue: string;
  rules: string;
  team_size: number;
  fees: number;
  cash_prize: number;
}

const EventCard: React.FC<{ event: EventProps }> = ({ event }) => {
  return (
    <div className="glass rounded-xl overflow-hidden transition-all duration-300 hover:transform hover:scale-[1.02] group">
      <div className="p-6">
        <Badge 
          className={`mb-4 ${event.fees > 0 
            ? 'bg-techfest-neon-pink text-white' 
            : 'bg-techfest-neon-blue text-white'}`}
        >
          {event.fees > 0 ? `₹${event.fees} Entry Fee` : 'Free Entry'}
        </Badge>
        
        <h3 className="text-xl font-bold mb-2 group-hover:text-techfest-neon-blue transition-colors">
          {event.name}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>
        
        <div className="space-y-2 mb-6">
          <div className="flex items-center text-xs text-gray-400">
            <CalendarDays size={14} className="mr-2 text-techfest-neon-purple" />
            <span>{event.date_time}</span>
          </div>
          
          <div className="flex items-center text-xs text-gray-400">
            <MapPin size={14} className="mr-2 text-techfest-neon-purple" />
            <span>{event.venue}</span>
          </div>
          
          <div className="flex items-center text-xs text-gray-400">
            <Users size={14} className="mr-2 text-techfest-neon-purple" />
            <span>Team Size: {event.team_size}</span>
          </div>
          
          {event.cash_prize > 0 && (
            <div className="flex items-center text-xs text-techfest-neon-pink">
              <Trophy size={14} className="mr-2" />
              <span>Prize: ₹{event.cash_prize}</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <Link to={`/register/${event.id}`}>
            <Button className="bg-techfest-accent hover:bg-techfest-accent/80">
              Register Now
            </Button>
          </Link>
          
          <Link to={`/events/${event.id}`} className="text-xs text-techfest-neon-blue hover:underline">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
