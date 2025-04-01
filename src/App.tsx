
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { loadEventsFromStorage, saveEventsToStorage, EVENTS_DATA, Event } from "./data/events";
import Index from "./pages/Index";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Register from "./pages/Register";
import RegistrationSuccess from "./pages/RegistrationSuccess";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [events, setEvents] = useState<Event[]>(EVENTS_DATA);
  const [isLoading, setIsLoading] = useState(true);

  // Load events from storage on initial mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const loadedEvents = await loadEventsFromStorage();
        setEvents(loadedEvents);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Function to update events
  const updateEvents = async (newEvents: Event[]) => {
    setEvents(newEvents);
    await saveEventsToStorage(newEvents);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-techfest-neon-blue"></div>
    </div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index events={events} />} />
            <Route path="/events" element={<Events events={events} />} />
            <Route path="/events/:eventId" element={<EventDetails events={events} />} />
            <Route path="/register/:eventId" element={<Register events={events} />} />
            <Route path="/registration-success" element={<RegistrationSuccess />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard events={events} onUpdateEvents={updateEvents} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
