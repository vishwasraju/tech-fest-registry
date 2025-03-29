
import React from 'react';
import { CalendarDays, MapPin, Cpu, BrainCircuit, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const HeroSection = () => {
  return (
    <div className="relative py-20 md:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg z-0"></div>
      <div className="absolute top-20 right-20 w-60 h-60 bg-techfest-neon-blue/20 rounded-full blur-[100px] z-0"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-techfest-neon-purple/20 rounded-full blur-[120px] z-0"></div>
      
      {/* Floating tech elements */}
      <div className="absolute top-1/4 right-[10%] opacity-20 animate-float z-0">
        <BrainCircuit size={80} className="text-techfest-neon-purple" />
      </div>
      <div className="absolute bottom-1/4 left-[15%] opacity-20 animate-float z-0" style={{ animationDelay: "1.5s" }}>
        <Cpu size={60} className="text-techfest-neon-blue" />
      </div>
      <div className="absolute top-1/3 left-[5%] opacity-20 animate-float z-0" style={{ animationDelay: "0.7s" }}>
        <Bot size={70} className="text-techfest-neon-pink" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <Badge 
            variant="outline" 
            className="mb-6 py-1.5 px-3 text-sm border-techfest-neon-blue text-techfest-neon-blue animate-pulse-neon inline-flex items-center gap-1.5"
          >
            <CalendarDays size={14} />
            <span>March 15-21, 2025</span>
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-techfest-neon-blue via-techfest-neon-purple to-techfest-neon-pink text-transparent bg-clip-text">
              Tech Fest 2K25
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Where human creativity meets artificial intelligence
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-10">
            <Link to="/events">
              <Button className="bg-gradient-to-r from-techfest-neon-blue to-techfest-neon-purple hover:opacity-90 transition-opacity text-white px-8 py-6 text-lg">
                <Cpu size={18} className="mr-2" />
                Explore Events
              </Button>
            </Link>
            
            <Button variant="outline" className="border-techfest-neon-pink text-techfest-neon-pink hover:bg-techfest-neon-pink/10 px-8 py-6 text-lg">
              <MapPin size={16} className="mr-2" />
              View Venue
            </Button>
          </div>
          
          <div className="glass p-6 rounded-xl border border-white/10 mb-10">
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-sm">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-techfest-neon-blue mb-1">15+</span>
                <span className="text-gray-400">Events</span>
              </div>
              
              <div className="h-10 w-px bg-gray-700"></div>
              
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-techfest-neon-purple mb-1">₹50K+</span>
                <span className="text-gray-400">Prize Pool</span>
              </div>
              
              <div className="h-10 w-px bg-gray-700"></div>
              
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold text-techfest-neon-pink mb-1">1000+</span>
                <span className="text-gray-400">Participants</span>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <BrainCircuit size={16} className="text-techfest-neon-blue" />
            <span>Powered by cutting-edge technology</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
