
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { Event } from '@/data/events';
import { Registration } from '@/data/registrations';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddEventDialog, BRANCH_OPTIONS } from './AddEventDialog';
import BackgroundImageDialog from './BackgroundImageDialog';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import QRCodeUploadDialog from './QRCodeUploadDialog';

interface EventsManagerProps {
  events: Event[];
  registrations: Registration[];
  onAddEvent: (data: any) => void;
  onDeleteEvent: (id: string) => void;
  onUpdateEventBackground: (id: string, backgroundUrl: string) => void;
  onUpdateEventQRCode?: (id: string, qrCodeUrl: string) => void;
}

const EventsManager = ({ 
  events, 
  registrations, 
  onAddEvent, 
  onDeleteEvent, 
  onUpdateEventBackground,
  onUpdateEventQRCode
}: EventsManagerProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  
  const filteredEvents = selectedCategory === 'ALL' 
    ? events 
    : events.filter(event => event.category === selectedCategory);
    
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Manage Events</h2>
        
        <div className="flex items-center gap-4">
          <AddEventDialog onAddEvent={onAddEvent} />
        </div>
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
              {filteredEvents.map(event => (
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
                      
                      <BackgroundImageDialog 
                        eventId={event.id} 
                        eventName={event.name}
                        currentBackground={event.background_image}
                        onUpdate={onUpdateEventBackground}
                      />
                      
                      {onUpdateEventQRCode && event.fees > 0 && (
                        <QRCodeUploadDialog 
                          eventId={event.id} 
                          eventName={event.name}
                          currentQRUrl={event.qr_code_url}
                          onUpdate={onUpdateEventQRCode}
                        />
                      )}
                      
                      <ConfirmDeleteDialog 
                        eventId={event.id} 
                        eventName={event.name}
                        onDelete={onDeleteEvent}
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
  );
};

export default EventsManager;
