
import React, { useState } from 'react';
import { Paintbrush } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BACKGROUND_IMAGES } from './AddEventDialog';

interface BackgroundImageDialogProps {
  eventId: string;
  eventName: string;
  currentBackground: string;
  onUpdate: (eventId: string, backgroundUrl: string) => void;
}

const BackgroundImageDialog = ({ 
  eventId, 
  eventName, 
  currentBackground, 
  onUpdate 
}: BackgroundImageDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState(currentBackground || 'none');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(eventId, selectedBackground === 'none' ? '' : selectedBackground);
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          variant="outline"
          className="h-8 w-8 p-0 border-gray-600"
        >
          <Paintbrush size={14} />
        </Button>
      </DialogTrigger>
      <DialogContent className="glass border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Update Background Image</DialogTitle>
          <DialogDescription className="text-gray-400">
            Change the background image for {eventName}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Select 
              value={selectedBackground} 
              onValueChange={setSelectedBackground}
            >
              <SelectTrigger className="bg-techfest-muted text-white border-techfest-muted">
                <SelectValue placeholder="Select background image" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 text-white border-gray-700">
                <SelectItem value="none" className="hover:bg-gray-800">None</SelectItem>
                {BACKGROUND_IMAGES.map((image) => (
                  <SelectItem key={image.url} value={image.url} className="hover:bg-gray-800">
                    {image.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedBackground && selectedBackground !== 'none' && (
            <div className="h-40 rounded-lg overflow-hidden">
              <img 
                src={selectedBackground} 
                alt="Selected background" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <DialogFooter>
            <Button type="submit">Update Background</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BackgroundImageDialog;
