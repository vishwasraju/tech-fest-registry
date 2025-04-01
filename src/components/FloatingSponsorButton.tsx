
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const FloatingSponsorButton = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link 
            to="/#sponsors" 
            className="fixed bottom-6 right-6 p-3 rounded-full glass border border-techfest-neon-pink hover:shadow-[0_0_15px_rgba(255,100,255,0.3)] transition-shadow duration-300 z-50"
            onClick={(e) => {
              e.preventDefault();
              const sponsorsSection = document.getElementById('sponsors');
              if (sponsorsSection) {
                sponsorsSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <Sparkles className="h-6 w-6 text-techfest-neon-pink" />
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>View Our Sponsors</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FloatingSponsorButton;
