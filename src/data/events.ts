
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
    date_time: "09-APRIL-2025",
    venue: "AIML",
    rules: "rul",
    team_size: 4,
    fees: 100,
    cash_prize: 0,
    category: "CSE",
    background_image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
  },
  {
    id: "event-2",
    name: "Codeblitz",
    description: "CodeBlitz is an on-spot debugging challenge where participants analyze and fix code errors under time constraints, testing their problem-solving skills and coding efficiency.",
    date_time: "09-APRIL-2025",
    venue: "AIML",
    rules: " ",
    team_size: 1,
    fees: 50,
    cash_prize:0,
    category: "CSE",
    background_image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"
  },
  {
    id: "event-3",
    name: "Code Free Creation",
    description: "Code Free Creation is an innovative competition where participants build projects using no-code or low-code platforms, showcasing creativity and problem-solving without traditional programming skills. 🚀",
    date_time: "09-APRIL-2025",
    venue: "AIML",
    rules: " ",
    team_size: 1,
    fees: 50,
    cash_prize: ,
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
