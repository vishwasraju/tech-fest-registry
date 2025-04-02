
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Sponsor, SPONSORS_DATA, loadSponsorsFromStorage, saveSponsorsToStorage } from '@/data/sponsors';

export const useSponsorsManager = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>(SPONSORS_DATA);
  const [isLoading, setIsLoading] = useState(true);

  // Load sponsors from storage
  useEffect(() => {
    const loadSponsors = async () => {
      try {
        const loadedSponsors = await loadSponsorsFromStorage();
        setSponsors(loadedSponsors);
      } catch (error) {
        console.error('Error loading sponsors:', error);
        toast.error('Failed to load sponsors data');
      } finally {
        setIsLoading(false);
      }
    };

    loadSponsors();
  }, []);

  // Add a new sponsor
  const handleAddSponsor = async (formData: Partial<Sponsor>) => {
    const newSponsor: Sponsor = {
      id: `sponsor-${sponsors.length + 1}`,
      name: formData.name || '',
      tier: formData.tier || 'Gold',
      logo_url: formData.logo_url,
      website_url: formData.website_url
    };
    
    const updatedSponsors = [...sponsors, newSponsor];
    setSponsors(updatedSponsors);
    
    // Save to storage
    const saved = await saveSponsorsToStorage(updatedSponsors);
    if (saved) {
      toast.success('Sponsor added successfully');
    } else {
      toast.error('Failed to save sponsor');
    }
  };
  
  // Update an existing sponsor
  const handleUpdateSponsor = async (id: string, data: Partial<Sponsor>) => {
    const updatedSponsors = sponsors.map(sponsor => 
      sponsor.id === id 
        ? { ...sponsor, ...data } 
        : sponsor
    );
    setSponsors(updatedSponsors);
    
    // Save to storage
    const saved = await saveSponsorsToStorage(updatedSponsors);
    if (saved) {
      toast.success('Sponsor updated successfully');
    } else {
      toast.error('Failed to update sponsor');
    }
  };
  
  // Delete a sponsor
  const handleDeleteSponsor = async (id: string) => {
    const updatedSponsors = sponsors.filter(sponsor => sponsor.id !== id);
    setSponsors(updatedSponsors);
    
    // Save to storage
    const saved = await saveSponsorsToStorage(updatedSponsors);
    if (saved) {
      toast.success('Sponsor deleted successfully');
    } else {
      toast.error('Failed to delete sponsor');
    }
  };

  return { 
    sponsors, 
    isLoading, 
    handleAddSponsor, 
    handleUpdateSponsor, 
    handleDeleteSponsor 
  };
};
