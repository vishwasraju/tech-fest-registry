import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { loadSponsorsFromStorage, Sponsor } from '@/data/sponsors';

// Define new sponsors directly within the file
const NEW_SPONSORS: Sponsor[] = [
  {
    id: "sponsor-9",
    name: "New Sponsor 1",
    tier: "Gold",
    logo_url: "https://example.com/new-sponsor-1.png",
    website_url: "https://new-sponsor-1.com"
  },
  {
    id: "sponsor-10",
    name: "New Sponsor 2",
    tier: "Silver",
    logo_url: "https://example.com/new-sponsor-2.png",
    website_url: "https://new-sponsor-2.com"
  }
  // Add more sponsors as needed...
];

const SponsorsSection = () => {
  const { data: sponsors = [], isLoading } = useQuery<Sponsor[]>({
    queryKey: ['sponsors'],
    queryFn: loadSponsorsFromStorage,
  });

  if (isLoading || sponsors.length === 0) {
    return null;
  }

  // Combine existing and new sponsors
  const allSponsors = [...sponsors, ...NEW_SPONSORS];

  return (
    <section id="sponsors" className="py-16 bg-gradient-to-b from-black to-techfest-dark relative">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our <span className="text-techfest-neon-pink">Sponsors</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We're grateful to our sponsors for their support in making TechFest 2025 a reality.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {allSponsors.map((sponsor) => (
            <div 
              key={sponsor.id} 
              className="flex flex-col items-center group"
            >
              <div className="glass p-4 rounded-xl hover:shadow-[0_0_15px_rgba(255,100,255,0.3)] transition-shadow duration-300 w-full aspect-square flex items-center justify-center mb-4">
                {sponsor.logo_url ? (
                  <img 
                    src={sponsor.logo_url} 
                    alt={sponsor.name} 
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-2xl font-bold text-center text-techfest-neon-blue">
                    {sponsor.name}
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold">{sponsor.name}</h3>
              <p className="text-sm text-gray-400">{sponsor.tier}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;
