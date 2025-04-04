import React, { useState, useEffect } from 'react';
import { Event } from '@/data/events';
import { Registration } from '@/data/registrations';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Download, ChevronDown, ChevronRight, Users } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface RegistrationsManagerProps {
  events: Event[];
  registrations: Registration[];
}

const RegistrationsManager = ({ events, registrations: initialRegistrations }: RegistrationsManagerProps) => {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>(initialRegistrations);
  const [expandedRegistrations, setExpandedRegistrations] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  
  // Load registrations from Supabase on mount and when initial registrations change
  useEffect(() => {
    const loadRegistrations = async () => {
      setLoading(true);
      try {
        // Use the any type to bypass the TypeScript error with Supabase
        const { data, error } = await (supabase as any)
          .from('registrations')
          .select('*');
        
        if (error) {
          console.error('Error loading registrations from Supabase:', error);
          // Use the local registrations as fallback
          setRegistrations(initialRegistrations);
        } else if (data && data.length > 0) {
          // Merge with local registrations to avoid duplicates
          const allRegistrations = [...data];
          
          // Add local registrations that aren't in the DB
          initialRegistrations.forEach(localReg => {
            if (!allRegistrations.some(dbReg => dbReg.id === localReg.id)) {
              allRegistrations.push(localReg);
            }
          });
          
          setRegistrations(allRegistrations);
        } else {
          // No data from Supabase, use local registrations
          setRegistrations(initialRegistrations);
        }
      } catch (error) {
        console.error('Failed to fetch registrations:', error);
        setRegistrations(initialRegistrations);
      } finally {
        setLoading(false);
      }
    };
    
    loadRegistrations();
  }, [initialRegistrations]);
  
  // Toggle expansion for team registrations
  const toggleExpand = (id: string) => {
    setExpandedRegistrations(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Filter registrations by selected event
  const filteredRegistrations = selectedEvent
    ? registrations.filter(reg => reg.event_id === selectedEvent)
    : registrations;
    
  // Function to export registrations to CSV
  const exportToCSV = () => {
    const eventName = selectedEvent 
      ? events.find(e => e.id === selectedEvent)?.name || 'All Events'
      : 'All Events';
      
    // Create CSV headers
    const headers = ['Student Name', 'USN', 'Branch', 'Event', 'Contact', 'UTR Number', 'Email', 'Team Members'];
    
    // Create CSV rows
    const rows = filteredRegistrations.map(registration => {
      const event = events.find(e => e.id === registration.event_id);
      const utrValue = event && event.fees > 0 
        ? registration.utr || 'Not Paid'
        : 'N/A (Free Event)';
        
      // Format team members
      const teamMembers = registration.team_members && registration.team_members.length > 0
        ? registration.team_members.map(m => `${m.name} (${m.usn})`).join('; ')
        : '';
        
      return [
        registration.name,
        registration.usn,
        registration.branch,
        event?.name || 'Unknown Event',
        registration.phone,
        utrValue,
        registration.email,
        teamMembers
      ];
    });
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create a download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `registrations_${eventName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Exported registrations for ${eventName}`);
  };
    
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Registration Entries</h2>
        
        <div className="glass p-4 rounded-lg mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
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
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="border-techfest-neon-blue text-techfest-neon-blue hover:bg-techfest-neon-blue/10"
                onClick={exportToCSV}
              >
                <Download size={16} className="mr-2" />
                Export to CSV
              </Button>
            </div>
          </div>
        </div>
        
        {loading && (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-techfest-neon-blue mx-auto mb-2"></div>
            <p className="text-gray-400">Loading registrations...</p>
          </div>
        )}
      </div>
      
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="py-3 px-4 text-left"></th>
                <th className="py-3 px-4 text-left">Student Name</th>
                <th className="py-3 px-4 text-left">USN</th>
                <th className="py-3 px-4 text-left">Branch</th>
                <th className="py-3 px-4 text-left">Event</th>
                <th className="py-3 px-4 text-left">Contact</th>
                <th className="py-3 px-4 text-left">UTR Number</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.length > 0 ? (
                filteredRegistrations.map(registration => {
                  const event = events.find(e => e.id === registration.event_id);
                  const hasTeam = registration.team_members && registration.team_members.length > 0;
                  const isExpanded = expandedRegistrations[registration.id] || false;
                  
                  return (
                    <React.Fragment key={registration.id}>
                      <tr className="border-b border-gray-800 hover:bg-gray-900/40">
                        <td className="py-3 px-4">
                          {hasTeam && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={() => toggleExpand(registration.id)}
                            >
                              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </Button>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            {registration.name}
                            {hasTeam && (
                              <span className="ml-2 bg-gray-800 text-xs px-2 py-0.5 rounded">
                                Team Lead
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">{registration.usn}</td>
                        <td className="py-3 px-4">{registration.branch}</td>
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
                      
                      {/* Team members expansion panel */}
                      {hasTeam && isExpanded && registration.team_members?.map((member, index) => (
                        <tr key={`${registration.id}-member-${index}`} className="bg-gray-900/20 border-b border-gray-800">
                          <td className="py-3 px-4"></td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Users size={14} className="mr-2 text-gray-500" />
                              {member.name}
                            </div>
                          </td>
                          <td className="py-3 px-4">{member.usn}</td>
                          <td className="py-3 px-4">{member.branch || '-'}</td>
                          <td className="py-3 px-4"></td>
                          <td className="py-3 px-4"></td>
                          <td className="py-3 px-4"></td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    {loading ? 'Loading registrations...' : 'No registrations found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RegistrationsManager;
