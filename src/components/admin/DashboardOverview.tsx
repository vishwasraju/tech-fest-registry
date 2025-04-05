
import React from 'react';
import { Calendar, Users } from 'lucide-react';
import { Event } from '@/data/events';
import { Registration } from '@/data/registrations';
import { BRANCH_OPTIONS } from '@/types/admin';

interface DashboardOverviewProps {
  events: Event[];
  registrations: Registration[];
}

const DashboardOverview = ({ events, registrations }: DashboardOverviewProps) => {
  // Get total registration count
  const totalRegistrations = registrations.length;
  
  // Get paid registrations count
  const paidRegistrations = registrations.filter(reg => {
    const event = events.find(e => e.id === reg.event_id);
    return event && event.fees > 0;
  }).length;
  
  // Get registration counts by branch
  const registrationsByBranch = BRANCH_OPTIONS.filter(branch => branch !== 'ALL').map(branch => {
    const count = registrations.filter(reg => reg.branch === branch).length;
    return { branch, count };
  });
  
  return (
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
            <span className="text-3xl font-bold">{totalRegistrations}</span>
            <Users size={24} className="text-techfest-neon-purple" />
          </div>
        </div>
        
        <div className="glass p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">Paid Registrations</h3>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold">{paidRegistrations}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-techfest-neon-pink">
              <circle cx="12" cy="12" r="10" />
              <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
              <path d="M12 18V6" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
        
        <div className="glass p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Registration Summary by Branch</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="py-3 px-4 text-left">Branch</th>
                  <th className="py-3 px-4 text-center">Registrations</th>
                </tr>
              </thead>
              <tbody>
                {registrationsByBranch.map(({ branch, count }) => (
                  <tr key={branch} className="border-b border-gray-800 hover:bg-gray-900/40">
                    <td className="py-3 px-4">{branch}</td>
                    <td className="py-3 px-4 text-center">{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
