
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminLogin from '@/components/AdminLogin';

const Admin = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">
            <span className="bg-gradient-to-r from-techfest-neon-blue to-techfest-neon-purple text-transparent bg-clip-text">
              Admin Portal
            </span>
          </h1>
          
          <AdminLogin />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
