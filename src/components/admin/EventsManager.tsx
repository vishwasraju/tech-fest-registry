
import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit, QrCode } from 'lucide-react';
import { Event } from '@/data/events';
import { Registration } from '@/data/registrations';
import { Button } from '@/components/ui/button';
import { AddEventDialog } from './AddEventDialog';
import BackgroundImageDialog from './BackgroundImageDialog';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import QRCodeUploadDialog from './QRCodeUploadDialog';
import { EditEventDialog } from './EditEventDialog';
import { useAdmin } from '@/contexts/AdminContext';

interface EventsManagerProps {
  events: Event[];
  registrations: Registration[];
}

const EventsManager = ({ events, registrations }: EventsManagerProps) => {
  const { 
    handleAddEvent, 
    handleDeleteEvent, 
    handleUpdateEventBackground, 
    handleUpdateEventQRCode,
    handleEditEvent
  } = useAdmin();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Manage Events</h2>
        
        <div className="flex items-center gap-4">
          <AddEventDialog onAddEvent={handleAddEvent} />
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
                      
                      <EditEventDialog 
                        event={event}
                        onEditEvent={(eventId, formData) => handleEditEvent(eventId, formData)}
                      />
                      
                      <BackgroundImageDialog 
                        eventId={event.id} 
                        eventName={event.name}
                        currentBackground={event.background_image}
                        onUpdate={handleUpdateEventBackground}
                      />
                      
                      {event.fees > 0 && (
                        <>
                          <QRCodeUploadDialog 
                            eventId={event.id} 
                            eventName={event.name}
                            currentQRUrl={event.qr_code_url}
                            onUpdate={handleUpdateEventQRCode}
                          />
                          
                          {event.team_size > 1 && (
                            <QRCodeUploadDialog 
                              eventId={`${event.id}_team`}
                              eventName={`${event.name} (Team)`}
                              currentQRUrl={event.team_qr_code_url}
                              onUpdate={(eventId, url) => {
                                // Update the team QR code URL
                                handleUpdateEventQRCode(event.id, url, true);
                              }}
                            />
                          )}
                        </>
                      )}
                      
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
  );
};

export default EventsManager;
