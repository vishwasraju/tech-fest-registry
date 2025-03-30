
import React, { useState } from 'react';
import { Event } from '@/data/events';
import { Registration } from '@/data/registrations';
import { Label } from '@/components/ui/label';

interface RegistrationsManagerProps {
  events: Event[];
  registrations: Registration[];
}

const RegistrationsManager = ({ events, registrations }: RegistrationsManagerProps) => {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  
  // Filter registrations by selected event
  const filteredRegistrations = selectedEvent
    ? registrations.filter(reg => reg.event_id === selectedEvent)
    : registrations;
    
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Registration Entries</h2>
        
        <div className="glass p-4 rounded-lg">
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
          </div>
        </div>
      </div>
      
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
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
                  return (
                    <tr key={registration.id} className="border-b border-gray-800 hover:bg-gray-900/40">
                      <td className="py-3 px-4">{registration.name}</td>
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
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    No registrations found
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
