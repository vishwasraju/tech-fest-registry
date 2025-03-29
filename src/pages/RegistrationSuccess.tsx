
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RegistrationSuccess = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-20 flex items-center justify-center">
        <div className="container px-4">
          <div className="glass max-w-lg mx-auto p-8 rounded-xl text-center">
            <div className="w-20 h-20 bg-techfest-neon-blue/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-techfest-neon-blue" />
            </div>
            
            <h1 className="text-3xl font-bold mb-4">Registration Successful!</h1>
            <p className="text-gray-400 mb-8">
              Thank you for registering for Tech Fest 2K25! Your registration has been received.
            </p>
            
            <div className="space-y-3">
              <Link to="/events">
                <Button className="w-full bg-techfest-accent hover:bg-techfest-accent/80">
                  Register for More Events
                </Button>
              </Link>
              
              <Link to="/">
                <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                  Return to Home
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RegistrationSuccess;
