
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import EventCard from '@/components/EventCard';
import SponsorsSection from '@/components/SponsorsSection';
import FloatingSponsorButton from '@/components/FloatingSponsorButton';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Event } from '@/data/events';

interface IndexProps {
  events: Event[];
}

const Index = ({ events }: IndexProps) => {
  // Featured events (first 3)
  const featuredEvents = events.slice(0, 3);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        
        {/* Featured Events Section */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4">
            <div className="mb-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Featured Events
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Check out these highlighted events from our upcoming tech fest. Don't miss your chance to participate!
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Link to="/events">
                <Button className="bg-gradient-to-r from-techfest-neon-blue to-techfest-neon-purple hover:opacity-90">
                  View All Events
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Sponsors Section */}
        <SponsorsSection />
        
        {/* About Section */}
        <section className="py-16 glass-pattern relative">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  About TechFest <span className="text-techfest-neon-blue">2025</span>
                </h2>
                <p className="mb-4">
                  TechFest 2025 is the premier technology and innovation festival at our college, celebrating creativity, collaboration, and cutting-edge ideas.
                </p>
                <p className="mb-4">
                  Join us for an unforgettable experience featuring hackathons, coding competitions, tech talks, workshops, and exciting demonstrations of emerging technologies.
                </p>
                <p className="mb-6">
                  Whether you're a seasoned developer, a design enthusiast, or just curious about technology, there's something for everyone at TechFest 2025.
                </p>
              </div>
              
              <div className="glass p-6 rounded-xl space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-techfest-neon-pink">When?</h3>
                  <p>March 15-21, 2025</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-techfest-neon-blue">Where?</h3>
                  <p>College Main Campus</p>
                  <p>Engineering Building & Auditorium</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-techfest-neon-purple">Who can participate?</h3>
                  <p>Open to all students from any college or university</p>
                  <p>Industry professionals welcome for select events</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingSponsorButton />
    </div>
  );
};

export default Index;
