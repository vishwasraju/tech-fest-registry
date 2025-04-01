
export interface Sponsor {
  id: string;
  name: string;
  logo_url?: string;
  tier: 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
  website_url?: string;
}

// Initial sponsors data
export const SPONSORS_DATA: Sponsor[] = [
  {
    id: "sponsor-1",
    name: "TechCorp",
    tier: "Platinum",
    logo_url: "https://via.placeholder.com/150?text=TechCorp",
    website_url: "https://example.com"
  },
  {
    id: "sponsor-2",
    name: "InnovateSystems",
    tier: "Gold",
    logo_url: "https://via.placeholder.com/150?text=InnovateSystems",
    website_url: "https://example.com"
  },
  {
    id: "sponsor-3",
    name: "DevPartners",
    tier: "Silver",
    logo_url: "https://via.placeholder.com/150?text=DevPartners",
    website_url: "https://example.com"
  }
];

// Function to load sponsors from Supabase Storage
export const loadSponsorsFromStorage = async (): Promise<Sponsor[]> => {
  try {
    // Try to load from localStorage first (for quick access)
    const cachedSponsors = localStorage.getItem('techfest-sponsors');
    if (cachedSponsors) {
      return JSON.parse(cachedSponsors);
    }
    
    // If not in localStorage, try to load from Supabase Storage
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data, error } = await supabase.storage
      .from('registrations')
      .download('sponsors.json');
      
    if (error || !data) {
      console.log('No saved sponsors found, using default data');
      // Save the default sponsors to storage for future use
      await saveSponsorsToStorage(SPONSORS_DATA);
      return SPONSORS_DATA;
    }
    
    const sponsors: Sponsor[] = JSON.parse(await data.text());
    // Update localStorage for quick access next time
    localStorage.setItem('techfest-sponsors', JSON.stringify(sponsors));
    return sponsors;
  } catch (error) {
    console.error('Error loading sponsors:', error);
    return SPONSORS_DATA;
  }
};

// Function to save sponsors to Supabase Storage
export const saveSponsorsToStorage = async (sponsors: Sponsor[]): Promise<boolean> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    // Convert sponsors to JSON string
    const sponsorsJson = JSON.stringify(sponsors);
    
    // Save to localStorage for quick access
    localStorage.setItem('techfest-sponsors', sponsorsJson);
    
    // Create a blob from the JSON string
    const blob = new Blob([sponsorsJson], { type: 'application/json' });
    const file = new File([blob], 'sponsors.json', { type: 'application/json' });
    
    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from('registrations')
      .upload('sponsors.json', file, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (error) {
      console.error('Error saving sponsors:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving sponsors:', error);
    return false;
  }
};
