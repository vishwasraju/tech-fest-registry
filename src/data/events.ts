export interface Event {
  id: string;
  name: string;
  description: string;
  date_time: string;
  venue: string;
  rules: string;
  team_size: number;
  fees: number;
  cash_prize: number;
  background_image?: string;
  category?: string;
  qr_code_url?: string;
  team_qr_code_url?: string;
  team_registration_fees?: number;
  coordinators?: string[];
  student_coordinators?: string[];
}

// Initial events data
export const EVENTS_DATA: Event[] = [
  {
    id: "event-1",
    name: "BATTLE ZONE",
    description: "Unleash your inner gamer! Join the ultimate gaming showdown",
    date_time: "2025-04-09T10:00:00",
    venue: "AIML",
    rules: "",
    team_size: 4,
    fees: 100,
    cash_prize: 0,
    category: "CSE",
    background_image: "https://nonwsmuudvxiowfqpmor.supabase.co/storage/v1/object/public/qr_codes//p-u-b-g-vs-free-fire-comparison-3vp8zypvwa7j3rhf.jpg"
  },
  {
    id: "event-2",
    name: "Codeblitz",
    description: "CodeBlitz is an on-spot debugging challenge where participants analyze and fix code errors under time constraints, testing their problem-solving skills and coding efficiency.",
    date_time: "2025-04-09T10:00:00",
    venue: "AIML",
    rules: "",
    team_size: 1,
    fees: 50,
    cash_prize: 0,
    category: "CSE",
    background_image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"
  },
  {
    id: "event-3",
    name: "Code Free Creation",
    description: "Code Free Creation is an innovative competition where participants build projects using no-code or low-code platforms, showcasing creativity and problem-solving without traditional coding.",
    date_time: "2025-04-09T10:00:00",
    venue: "AIML",
    rules: "",
    team_size: 1,
    fees: 50,
    cash_prize: 0,
    category: "CSD",
    background_image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
  },
  {
    id: "event-4",
    name: "VidSprint",
    description: "VidSprint is an on-spot videography competition where participants capture, edit, and present a compelling short video within a limited time, showcasing creativity, storytelling, and technical skills.",
    date_time: "2025-04-09T10:00:00",
    venue: "AIML",
    rules: "",
    team_size: 1,
    fees: 50,
    cash_prize: 0,
    category: "AIML"
  },
  {
    id: "event-5",
    name: "DeptVerse(TEAM)",
    description: "DeptVerse is a presentation competition where participants create a PPT showcasing how AI is transforming their department, highlighting innovations, real-world applications, and future potential.",
    date_time: "2025-04-09T10:00:00",
    venue: "AIML",
    rules: "",
    team_size: 4,
    fees: 100,
    cash_prize: 0,
    category: "AIML",
    background_image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e"
  },
  {
    id: "event-6",
    name: "DeptVerse(SOLO)",
    description: "DeptVerse is a presentation competition where participants create a PPT showcasing how AI is transforming their department, highlighting innovations, real-world applications, and future potential.",
    date_time: "2025-04-09T10:00:00",
    venue: "AIML",
    rules: "",
    team_size: 1,
    fees: 50,
    cash_prize: 0,
    category: "MBA",
    background_image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e"
  },
   {
    id: "event-7",
    name: "DeptVerse(solo)",
    description: "DeptVerse is a presentation competition where participants create a PPT showcasing how AI is transforming their department, highlighting innovations, real-world applications, and future potential.",
    date_time: "2025-04-09T10:00:00",
    venue: "AIML",
    rules: "",
    team_size: 1,
    fees: 50,
    cash_prize: 0,
    category: "AIML",
    background_image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e"
  }
];

// Function to load events from Supabase Storage
export const loadEventsFromStorage = async (): Promise<Event[]> => {
  try {
    // Try to load from localStorage first (for quick access)
    const cachedEvents = localStorage.getItem('techfest-events');
    if (cachedEvents) {
      return JSON.parse(cachedEvents);
    }
    
    // If not in localStorage, try to load from Supabase Storage
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data, error } = await supabase.storage
      .from('registrations')
      .download('events.json');
      
    if (error || !data) {
      console.log('No saved events found, using default data');
      // Save the default events to storage for future use
      await saveEventsToStorage(EVENTS_DATA);
      return EVENTS_DATA;
    }
    
    const events: Event[] = JSON.parse(await data.text());
    // Update localStorage for quick access next time
    localStorage.setItem('techfest-events', JSON.stringify(events));
    return events;
  } catch (error) {
    console.error('Error loading events:', error);
    return EVENTS_DATA;
  }
};

// Function to save events to Supabase Storage
export const saveEventsToStorage = async (events: Event[]): Promise<boolean> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    // Convert events to JSON string
    const eventsJson = JSON.stringify(events);
    
    // Save to localStorage for quick access
    localStorage.setItem('techfest-events', eventsJson);
    
    // Create a blob from the JSON string
    const blob = new Blob([eventsJson], { type: 'application/json' });
    const file = new File([blob], 'events.json', { type: 'application/json' });
    
    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from('registrations')
      .upload('events.json', file, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (error) {
      console.error('Error saving events:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving events:', error);
    return false;
  }
};
