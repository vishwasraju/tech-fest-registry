
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminLogin from '@/components/AdminLogin';
import { ChevronRight } from 'lucide-react';

const Admin = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-techfest-dark to-black">
      <Header />
      
      <main className="flex-grow py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-md">
          <div className="glass rounded-xl p-6 border border-white/10 shadow-[0_0_15px_rgba(0,224,255,0.3)]">
            <h1 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-2">
              <span className="bg-gradient-to-r from-techfest-neon-blue to-techfest-neon-purple text-transparent bg-clip-text">
                Admin Portal
              </span>
              <ChevronRight className="text-techfest-neon-blue h-6 w-6 inline animate-pulse" />
            </h1>
            
            <AdminLogin />
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Authorized personnel only. This portal gives access to event management and participant data.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
