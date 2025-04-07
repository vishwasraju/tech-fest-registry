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
    name: "CAUVERY TATA",
    tier: "Platinum",
    logo_url: "https://www.google.com/imgres?q=image&imgurl=https%3A%2F%2Fwww.bigfootdigital.co.uk%2Fwp-content%2Fuploads%2F2020%2F07%2Fimage-optimisation-scaled.jpg&imgrefurl=https%3A%2F%2Fwww.bigfootdigital.co.uk%2Fhow-to-optimise-images&docid=dTbNgrJF6xXg5M&tbnid=s_UYcOUl07ucGM&vet=12ahUKEwjO267_usWMAxWuSmwGHeJzJlMQM3oECFIQAA..i&w=2560&h=1707&hcb=2&ved=2ahUKEwjO267_usWMAxWuSmwGHeJzJlMQM3oECFIQAA",
    website_url: "https://example.com"
  },
  {
    id: "sponsor-2",
    name: "CAUVERY TATA",
    tier: "Platinum",
    logo_url: "https://nonwsmuudvxiowfqpmor.supabase.co/storage/v1/object/public/qr_codes//Screenshot%202025-04-06%20232644.png",
    website_url: "https://example.com"
  },
  {
    id: "sponsor-3",
    name: "CAUVERY TATA",
    tier: "Platinum",
    logo_url: "https://nonwsmuudvxiowfqpmor.supabase.co/storage/v1/object/public/qr_codes//Screenshot%202025-04-06%20232644.png",
    website_url: "https://example.com"
  },
  // New sponsors
  {
    id: "sponsor-4",
    name: "CAUVERY TATA",
    tier: "Platinum",
    logo_url: "https://nonwsmuudvxiowfqpmor.supabase.co/storage/v1/object/public/qr_codes//Screenshot%202025-04-06%20232644.png",
    website_url: "https://techinnovators.com"
  },
  {
    id: "sponsor-5",
    name: "CAUVERY TATA",
    tier: "Platinum",
    logo_url: "https://nonwsmuudvxiowfqpmor.supabase.co/storage/v1/object/public/qr_codes//Screenshot%202025-04-06%20232644.png",
    website_url: "https://codemasters.com"
  },
  {
    id: "sponsor-6",
    name: "CAUVERY TATA",
    tier: "Platinum",
    logo_url: "https://nonwsmuudvxiowfqpmor.supabase.co/storage/v1/object/public/qr_codes//Screenshot%202025-04-06%20232644.png",
    website_url: "https://futuretech.com"
  },
  {
    id: "sponsor-7",
    name: "CAUVERY TATA",
    tier: "Platinum",
    logo_url: "https://nonwsmuudvxiowfqpmor.supabase.co/storage/v1/object/public/qr_codes//Screenshot%202025-04-06%20232644.png",
    website_url: "https://codemasters.com"
  },
  {
    id: "sponsor-8",
    name: "CAUVERY TATA",
    tier: "Platinum",
    logo_url: "https://nonwsmuudvxiowfqpmor.supabase.co/storage/v1/object/public/qr_codes//Screenshot%202025-04-06%20232644.png",
    website_url: "https://futuretech.com"
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
