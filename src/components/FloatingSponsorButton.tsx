
import React from 'react';
import { Rocket } from 'lucide-react';

const FloatingSponsorButton = () => {
  const scrollToSponsors = () => {
    const sponsorsSection = document.getElementById('sponsors-section');
    if (sponsorsSection) {
      sponsorsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <button
      onClick={scrollToSponsors}
      className="fixed bottom-6 right-6 p-3 rounded-full bg-techfest-neon-blue text-white shadow-lg hover:bg-techfest-neon-purple transition-all duration-300 z-50 flex items-center justify-center"
      aria-label="View Sponsors"
    >
      <Rocket size={24} />
    </button>
  );
};

export default FloatingSponsorButton;
