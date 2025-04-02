
import React, { useState, useRef } from 'react';
import { Paintbrush, Upload } from 'lucide-react';
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
  const [customBackground, setCustomBackground] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomBackground(file);
      // Create preview URL for the selected image
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setSelectedBackground('custom');
    }
  };
  
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedBackground === 'custom' && previewUrl) {
      onUpdate(eventId, previewUrl);
    } else if (selectedBackground !== 'none' && selectedBackground !== 'custom') {
      onUpdate(eventId, selectedBackground);
    } else {
      onUpdate(eventId, '');
    }
    
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
                <SelectItem value="custom" className="hover:bg-gray-800">Custom Upload</SelectItem>
                {BACKGROUND_IMAGES.map((image) => (
                  <SelectItem key={image.url} value={image.url} className="hover:bg-gray-800">
                    {image.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedBackground === 'custom' && (
            <div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={handleButtonClick}
              >
                <Upload size={16} className="mr-2" />
                {customBackground ? 'Change Image' : 'Upload Image'}
              </Button>
            </div>
          )}
          
          {((selectedBackground && selectedBackground !== 'none' && selectedBackground !== 'custom') || 
            (selectedBackground === 'custom' && previewUrl)) && (
            <div className="h-40 rounded-lg overflow-hidden">
              <img 
                src={selectedBackground === 'custom' ? previewUrl : selectedBackground} 
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
