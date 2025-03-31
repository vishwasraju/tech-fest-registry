
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import EventCard from '@/components/EventCard';
import { EVENTS_DATA } from '@/data/events';
import { Calendar, Zap, Trophy } from 'lucide-react';

const Index = () => {
  // Show only first 5 events on the homepage
  const featuredEvents = EVENTS_DATA.slice(0, 5);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        
        {/* Featured Events Section */}
        <section className="py-20 container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Events</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Check out these exciting technical challenges and showcase your skills in our premier events.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
        
        {/* Info Sections */}
        <section className="py-16 bg-techfest-dark/50 relative">
          <div className="absolute top-0 left-0 w-full h-full grid-bg opacity-20"></div>
          <div className="container mx-auto px-4 relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass p-8 rounded-xl text-center">
                <div className="w-16 h-16 bg-techfest-neon-blue/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="h-8 w-8 text-techfest-neon-blue" />
                </div>
                <h3 className="text-xl font-bold mb-3">Event Schedule</h3>
                <p className="text-gray-400 text-sm">
                  All events are scheduled for April 9, 2025. Check individual event details for exact timing.
                </p>
              </div>
              
              <div className="glass p-8 rounded-xl text-center">
                <div className="w-16 h-16 bg-techfest-neon-purple/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-techfest-neon-purple" />
                </div>
                <h3 className="text-xl font-bold mb-3">Registration Process</h3>
                <p className="text-gray-400 text-sm">
                  Simple registration process - just fill in your details and for paid events, complete the payment using UPI.
                </p>
              </div>
              
              <div className="glass p-8 rounded-xl text-center">
                <div className="w-16 h-16 bg-techfest-neon-pink/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy className="h-8 w-8 text-techfest-neon-pink" />
                </div>
                <h3 className="text-xl font-bold mb-3">Prizes & Recognition</h3>
                <p className="text-gray-400 text-sm">
                  Win exciting cash prizes, certificates, and recognition for your technical skills and innovation.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
