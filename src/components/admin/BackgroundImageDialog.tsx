
import React, { useState } from 'react';
import { Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BACKGROUND_IMAGES } from './AddEventDialog';

interface BackgroundImageDialogProps {
  eventId: string;
  eventName: string;
  currentBackground?: string;
  onUpdate: (id: string, backgroundUrl: string) => void;
}

const BackgroundImageDialog = ({ 
  eventId, 
  eventName,
  currentBackground,
  onUpdate 
}: BackgroundImageDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(currentBackground || '');
  
  const handleUpdate = () => {
    onUpdate(eventId, selectedImage);
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          variant="outline" 
          className="h-8 w-8 p-0 border-gray-600 hover:bg-blue-900/20"
        >
          <Image size={14} className="text-blue-400" />
        </Button>
      </DialogTrigger>
      <DialogContent className="glass border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Change Event Background</DialogTitle>
          <DialogDescription className="text-gray-400">
            Select a background image for "{eventName}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 my-4">
          <div 
            onClick={() => setSelectedImage('')}
            className={`relative cursor-pointer rounded-lg overflow-hidden h-24 border-2 ${selectedImage === '' ? 'border-techfest-neon-blue' : 'border-transparent'}`}
          >
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <span className="text-sm text-gray-400">No Background</span>
            </div>
          </div>
          
          {BACKGROUND_IMAGES.map((image) => (
            <div 
              key={image.url}
              onClick={() => setSelectedImage(image.url)}
              className={`relative cursor-pointer rounded-lg overflow-hidden h-24 border-2 ${selectedImage === image.url ? 'border-techfest-neon-blue' : 'border-transparent'}`}
            >
              <img 
                src={image.url} 
                alt={image.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-end p-2">
                <span className="text-xs text-white">{image.name}</span>
              </div>
            </div>
          ))}
        </div>
        
        <DialogFooter className="mt-4">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="border-gray-600 hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdate}
          >
            Update Background
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BackgroundImageDialog;
