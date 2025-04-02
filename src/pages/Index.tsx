
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import EventSection from '@/components/EventSection';
import SponsorsSection from '@/components/SponsorsSection';
import { Event } from '@/data/events';
import FloatingSponsorButton from '@/components/FloatingSponsorButton';

interface IndexProps {
  events: Event[];
}

const Index = ({ events }: IndexProps) => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <HeroSection />
        <EventSection events={events.slice(0, 3)} />
        <SponsorsSection />
      </main>
      
      <Footer />
      
      {/* Floating Sponsor Button */}
      <FloatingSponsorButton />
    </div>
  );
};

export default Index;
