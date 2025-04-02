import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ChevronRight, Home, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
const Header = () => {
  return <header className="glass sticky top-0 z-50 w-full">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center">
          <img alt="Tech Fest 2K25 Logo" src="/lovable-uploads/b48f0e78-d806-4c37-b311-4cd931398c4f.png" className="h-21 object-scale-down" />
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium flex items-center gap-1 hover:text-techfest-neon-blue transition-colors">
            <Home size={16} />
            <span>Home</span>
          </Link>
          <Link to="/events" className="text-sm font-medium flex items-center gap-1 hover:text-techfest-neon-blue transition-colors">
            <CalendarDays size={16} />
            <span>Events</span>
          </Link>
          <Link to="/admin" className="text-sm font-medium flex items-center gap-1 hover:text-techfest-neon-blue transition-colors">
            <User size={16} />
            <span>Admin</span>
          </Link>
        </nav>
        
        <div className="flex items-center space-x-2">
          <Link to="/events">
            <Button className="bg-gradient-to-r from-techfest-neon-blue to-techfest-neon-purple hover:opacity-90 transition-opacity">
              Register Now
              <ChevronRight size={16} className="ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </header>;
};
export default Header;