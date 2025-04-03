
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="glass mt-20 py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-techfest-neon-blue to-techfest-accent text-transparent bg-clip-text">
              Tech Fest 2K25
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              The ultimate technical extravaganza that showcases innovation, creativity, and technical excellence.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-techfest-neon-purple">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-techfest-neon-blue transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-400 hover:text-techfest-neon-blue transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-gray-400 hover:text-techfest-neon-blue transition-colors">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-techfest-neon-pink">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Department of AI & ML</li>
              <li>SJCIT</li>
              <li>(Dr.VARADARAJU)+91 9448769592</li>
              <li>(BHANUPRATHAP)+91 9902567101</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Tech Fest 2K25. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
