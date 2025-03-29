
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { EVENTS_DATA } from '@/data/events';
import { REGISTRATIONS_DATA } from '@/data/registrations';
import { AreaChart, Calendar, Users, LogOut, Plus, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [events, setEvents] = useState(EVENTS_DATA);
  const [registrations, setRegistrations] = useState(REGISTRATIONS_DATA);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  
  // Check admin authentication
  useEffect(() => {
    const adminAuth = localStorage.getItem('techfest-admin');
    if (!adminAuth) {
      navigate('/admin');
      return;
    }
    
    try {
      const { isAuthenticated, timestamp } = JSON.parse(adminAuth);
      const authTime = new Date(timestamp).getTime();
      const currentTime = new Date().getTime();
      const twoHoursMs = 2 * 60 * 60 * 1000;
      
      if (!isAuthenticated || (currentTime - authTime > twoHoursMs)) {
        // Auth expired after 2 hours
        localStorage.removeItem('techfest-admin');
        navigate('/admin');
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      localStorage.removeItem('techfest-admin');
      navigate('/admin');
    }
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('techfest-admin');
    toast.success('Logged out successfully');
    navigate('/admin');
  };
  
  const handleAddEvent = (formData: any) => {
    // In a real app, this would be an API call
    const newEvent = {
      id: `event-${events.length + 1}`,
      ...formData
    };
    
    setEvents([...events, newEvent]);
    toast.success('Event added successfully');
  };
  
  const handleDeleteEvent = (eventId: string) => {
    // In a real app, this would be an API call
    setEvents(events.filter(event => event.id !== eventId));
    // Also filter out registrations for this event
    setRegistrations(registrations.filter(reg => reg.event_id !== eventId));
    toast.success('Event deleted successfully');
  };
  
  // Filter registrations by selected event
  const filteredRegistrations = selectedEvent
    ? registrations.filter(reg => reg.event_id === selectedEvent)
    : registrations;
  
  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-techfest-neon-blue to-techfest-neon-purple text-transparent bg-clip-text">
                Admin Dashboard
              </span>
            </h1>
            
            <Button 
              variant="outline" 
              className="mt-4 md:mt-0 border-gray-600 hover:bg-gray-800"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
          
          {/* Admin Tabs */}
          <div className="flex border-b border-gray-800 mb-8">
            <button
              className={`py-3 px-4 font-medium text-sm border-b-2 ${
                activeTab === 'overview'
                  ? 'border-techfest-neon-blue text-techfest-neon-blue'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              <div className="flex items-center">
                <AreaChart size={16} className="mr-2" />
                Overview
              </div>
            </button>
            
            <button
              className={`py-3 px-4 font-medium text-sm border-b-2 ${
                activeTab === 'events'
                  ? 'border-techfest-neon-purple text-techfest-neon-purple'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('events')}
            >
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                Events
              </div>
            </button>
            
            <button
              className={`py-3 px-4 font-medium text-sm border-b-2 ${
                activeTab === 'registrations'
                  ? 'border-techfest-neon-pink text-techfest-neon-pink'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('registrations')}
            >
              <div className="flex items-center">
                <Users size={16} className="mr-2" />
                Registrations
              </div>
            </button>
          </div>
          
          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-2">Total Events</h3>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-bold">{events.length}</span>
                    <Calendar size={24} className="text-techfest-neon-blue" />
                  </div>
                </div>
                
                <div className="glass p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-2">Total Registrations</h3>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-bold">{registrations.length}</span>
                    <Users size={24} className="text-techfest-neon-purple" />
                  </div>
                </div>
                
                <div className="glass p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-2">Paid Registrations</h3>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-bold">
                      {registrations.filter(reg => {
                        const event = events.find(e => e.id === reg.event_id);
                        return event && event.fees > 0;
                      }).length}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-techfest-neon-pink">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                      <path d="M12 18V6" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="glass p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Registration Summary by Event</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="py-3 px-4 text-left">Event Name</th>
                        <th className="py-3 px-4 text-center">Registrations</th>
                        <th className="py-3 px-4 text-right">Entry Fee</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map(event => (
                        <tr key={event.id} className="border-b border-gray-800 hover:bg-gray-900/40">
                          <td className="py-3 px-4">{event.name}</td>
                          <td className="py-3 px-4 text-center">
                            {registrations.filter(reg => reg.event_id === event.id).length}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {event.fees > 0 ? `₹${event.fees}` : 'Free'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'events' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Manage Events</h2>
                
                <AddEventDialog onAddEvent={handleAddEvent} />
              </div>
              
              <div className="glass rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="py-3 px-4 text-left">Event Name</th>
                        <th className="py-3 px-4 text-center">Date & Time</th>
                        <th className="py-3 px-4 text-center">Venue</th>
                        <th className="py-3 px-4 text-center">Entry Fee</th>
                        <th className="py-3 px-4 text-center">Prize</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map(event => (
                        <tr key={event.id} className="border-b border-gray-800 hover:bg-gray-900/40">
                          <td className="py-3 px-4">{event.name}</td>
                          <td className="py-3 px-4 text-center">{event.date_time}</td>
                          <td className="py-3 px-4 text-center">{event.venue}</td>
                          <td className="py-3 px-4 text-center">
                            {event.fees > 0 ? `₹${event.fees}` : 'Free'}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {event.cash_prize > 0 ? `₹${event.cash_prize}` : '-'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Link to={`/events/${event.id}`}>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="h-8 w-8 p-0 border-gray-600"
                                >
                                  <Eye size={14} />
                                </Button>
                              </Link>
                              
                              <ConfirmDeleteDialog 
                                eventId={event.id} 
                                eventName={event.name}
                                onDelete={handleDeleteEvent}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'registrations' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">Registration Entries</h2>
                
                <div className="glass p-4 rounded-lg">
                  <Label htmlFor="event-filter">Filter by Event</Label>
                  <select
                    id="event-filter"
                    className="w-full bg-techfest-muted text-white border-gray-700 rounded-md p-2 mt-1"
                    value={selectedEvent || ''}
                    onChange={(e) => setSelectedEvent(e.target.value || null)}
                  >
                    <option value="">All Events</option>
                    {events.map(event => (
                      <option key={event.id} value={event.id}>
                        {event.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="glass rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="py-3 px-4 text-left">Student Name</th>
                        <th className="py-3 px-4 text-left">USN</th>
                        <th className="py-3 px-4 text-left">Event</th>
                        <th className="py-3 px-4 text-left">Contact</th>
                        <th className="py-3 px-4 text-left">UTR Number</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRegistrations.length > 0 ? (
                        filteredRegistrations.map(registration => {
                          const event = events.find(e => e.id === registration.event_id);
                          return (
                            <tr key={registration.id} className="border-b border-gray-800 hover:bg-gray-900/40">
                              <td className="py-3 px-4">{registration.name}</td>
                              <td className="py-3 px-4">{registration.usn}</td>
                              <td className="py-3 px-4">{event?.name || 'Unknown Event'}</td>
                              <td className="py-3 px-4">{registration.phone}</td>
                              <td className="py-3 px-4">
                                {event && event.fees > 0 ? (
                                  registration.utr || 'Not Paid'
                                ) : (
                                  <span className="text-gray-500">N/A (Free Event)</span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-gray-400">
                            No registrations found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Add Event Dialog
const AddEventDialog = ({ onAddEvent }: { onAddEvent: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date_time: '',
    venue: '',
    rules: '',
    team_size: 1,
    fees: 0,
    cash_prize: 0
  });
  
  const [open, setOpen] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'team_size' || name === 'fees' || name === 'cash_prize'
        ? parseInt(value) || 0
        : value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEvent(formData);
    setFormData({
      name: '',
      description: '',
      date_time: '',
      venue: '',
      rules: '',
      team_size: 1,
      fees: 0,
      cash_prize: 0
    });
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus size={16} className="mr-2" />
          Add New Event
        </Button>
      </DialogTrigger>
      <DialogContent className="glass border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogDescription className="text-gray-400">
            Fill in the details to create a new event.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name">Event Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="bg-techfest-muted text-white border-techfest-muted"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="bg-techfest-muted text-white border-techfest-muted"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date_time">Date & Time</Label>
              <Input
                id="date_time"
                name="date_time"
                value={formData.date_time}
                onChange={handleChange}
                className="bg-techfest-muted text-white border-techfest-muted"
                placeholder="e.g. March 15, 2025 - 10:00 AM"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                className="bg-techfest-muted text-white border-techfest-muted"
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="rules">Rules</Label>
            <Textarea
              id="rules"
              name="rules"
              value={formData.rules}
              onChange={handleChange}
              className="bg-techfest-muted text-white border-techfest-muted"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="team_size">Team Size</Label>
              <Input
                id="team_size"
                name="team_size"
                type="number"
                min="1"
                value={formData.team_size}
                onChange={handleChange}
                className="bg-techfest-muted text-white border-techfest-muted"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="fees">Entry Fee (₹)</Label>
              <Input
                id="fees"
                name="fees"
                type="number"
                min="0"
                value={formData.fees}
                onChange={handleChange}
                className="bg-techfest-muted text-white border-techfest-muted"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="cash_prize">Cash Prize (₹)</Label>
              <Input
                id="cash_prize"
                name="cash_prize"
                type="number"
                min="0"
                value={formData.cash_prize}
                onChange={handleChange}
                className="bg-techfest-muted text-white border-techfest-muted"
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit">Add Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Confirm Delete Dialog
const ConfirmDeleteDialog = ({ 
  eventId, 
  eventName,
  onDelete 
}: { 
  eventId: string, 
  eventName: string,
  onDelete: (id: string) => void 
}) => {
  const [open, setOpen] = useState(false);
  
  const handleDelete = () => {
    onDelete(eventId);
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          variant="outline" 
          className="h-8 w-8 p-0 border-red-800 hover:bg-red-900/20"
        >
          <Trash2 size={14} className="text-red-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="glass border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Delete Event</DialogTitle>
          <DialogDescription className="text-gray-400">
            Are you sure you want to delete "{eventName}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="mt-4">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="border-gray-600 hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminDashboard;
