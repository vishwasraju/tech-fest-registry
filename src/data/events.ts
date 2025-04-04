
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
  has_solo_option?: boolean; // Property to enable solo registration option
  registration_type?: 'solo' | 'team' | 'both'; // Field for registration type
  solo_cash_prize?: number; // New field for solo cash prize
}

// Initial events data
export const EVENTS_DATA: Event[] = [
  {
    id: "event-1",
    name: "Hackathon",
    description: "A 24-hour coding marathon where teams of programmers collaborate to build innovative software solutions. Push your coding skills to the limit and compete for prizes!",
    date_time: "March 15, 2025 - 10:00 AM",
    venue: "Main Auditorium",
    rules: "1. Teams of 3-4 members.\n2. Bring your own laptops and necessary equipment.\n3. Internet access will be provided.\n4. Projects must be original work created during the event.\n5. Final presentations will be 5 minutes per team.",
    team_size: 4,
    fees: 500,
    cash_prize: 10000,
    category: "CSE",
    background_image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
  },
  {
    id: "event-2",
    name: "Code Wars",
    description: "A competitive programming contest where participants solve algorithmic challenges within a time limit. Test your problem-solving skills against the best coders!",
    date_time: "March 16, 2025 - 9:30 AM",
    venue: "CS Department Lab",
    rules: "1. Individual participation only.\n2. Time limit: 3 hours.\n3. Participants must solve algorithmic problems in any programming language.\n4. Internet access will be restricted during the competition.\n5. Rankings will be based on number of problems solved and time taken.",
    team_size: 1,
    fees: 200,
    cash_prize: 5000,
    category: "CSE",
    background_image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"
  },
  {
    id: "event-3",
    name: "UI/UX Design Challenge",
    description: "A design competition where participants create user interfaces for given problem statements. Show your creative design skills and usability expertise!",
    date_time: "March 17, 2025 - 11:00 AM",
    venue: "Design Studio",
    rules: "1. Individual or team of 2 allowed.\n2. Bring your own design tools (laptop with design software).\n3. Problem statements will be provided on the spot.\n4. Final designs must be submitted within 5 hours.\n5. Judging based on creativity, usability, and presentation.",
    team_size: 2,
    fees: 300,
    cash_prize: 6000,
    category: "CSD",
    background_image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
  },
  {
    id: "event-4",
    name: "Tech Quiz",
    description: "A quiz competition testing knowledge across various technology domains including programming, hardware, tech history, and current trends.",
    date_time: "March 18, 2025 - 2:00 PM",
    venue: "Mini Auditorium",
    rules: "1. Teams of 2 members.\n2. Multiple rounds including written elimination, rapid fire, and buzzer rounds.\n3. Quiz master's decision will be final.\n4. Use of mobile phones or other devices is prohibited during the quiz.",
    team_size: 2,
    fees: 0,
    cash_prize: 3000,
    category: "AIML"
  },
  {
    id: "event-5",
    name: "Robotics Challenge",
    description: "Build and program robots to navigate an obstacle course and complete specific tasks. Showcase your robotics and automation skills!",
    date_time: "March 19, 2025 - 10:00 AM",
    venue: "Robotics Lab",
    rules: "1. Teams of 3-5 members.\n2. Robots must be pre-built and brought to the event.\n3. No remote controls allowed - robots must be autonomous.\n4. Maximum robot dimensions: 30cm x 30cm x 30cm.\n5. Time limit for course completion: 5 minutes.",
    team_size: 5,
    fees: 800,
    cash_prize: 12000,
    category: "ECE",
    background_image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e"
  },
  {
    id: "event-6",
    name: "Paper Presentation",
    description: "Present your research papers or innovative ideas in computer science, information technology, or related engineering fields.",
    date_time: "March 20, 2025 - 9:00 AM",
    venue: "Conference Hall",
    rules: "1. Individual or team of 2 allowed.\n2. Abstract submission deadline: March 1, 2025.\n3. Selected participants will be notified by March 5, 2025.\n4. Presentation time: 8 minutes + 2 minutes Q&A.\n5. Judging based on innovation, research quality, and presentation skills.",
    team_size: 2,
    fees: 0,
    cash_prize: 4000,
    category: "MBA"
  },
  {
    id: "event-7",
    name: "Bug Bounty",
    description: "Find bugs and vulnerabilities in a sample application. Test your cybersecurity skills and compete to discover the most critical issues.",
    date_time: "March 20, 2025 - 2:00 PM",
    venue: "Network Security Lab",
    rules: "1. Individual participation only.\n2. Time limit: 4 hours.\n3. Participants must document all discovered vulnerabilities.\n4. Points awarded based on severity and number of bugs found.\n5. Ethical hacking principles must be followed.",
    team_size: 1,
    fees: 250,
    cash_prize: 7000,
    category: "CSE",
    background_image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    id: "event-8",
    name: "Technical Debate",
    description: "Engage in structured debates on controversial tech topics like AI ethics, data privacy, and the future of technology.",
    date_time: "March 21, 2025 - 10:00 AM",
    venue: "Seminar Hall",
    rules: "1. Teams of 2 members.\n2. Topics will be announced 3 days before the event.\n3. Each team gets 5 minutes for opening arguments, 3 minutes for rebuttal, and 2 minutes for closing.\n4. Judges' decision will be final.\n5. Professional and respectful conduct is required.",
    team_size: 2,
    fees: 0,
    cash_prize: 2500,
    category: "AIML"
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
