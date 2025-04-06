
import React, { useState, useRef } from 'react';
import { QrCode, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// QR code sample images
const SAMPLE_QR_CODES = [
  {
    name: 'UPI 1',
    url: '/lovable-uploads/52204412-75bf-4c5a-8291-863ee5b054bc.png'
  },
  {
    name: 'UPI 2',
    url: '/lovable-uploads/24fe700b-9cd0-4745-a2af-a58676eaf367.png'
  }
];

interface QRCodeUploadDialogProps {
  eventId: string;
  eventName: string;
  currentQRUrl?: string;
  onUpdate: (eventId: string, qrCodeUrl: string, isTeam?: boolean) => void;
}

const QRCodeUploadDialog = ({ eventId, eventName, currentQRUrl, onUpdate }: QRCodeUploadDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedQR, setSelectedQR] = useState<string>(currentQRUrl || '');
  const [customQR, setCustomQR] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Check if this is a team QR code (eventId contains "_team")
  const isTeam = eventId.includes('_team');
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomQR(file);
      // Create preview URL for the selected image
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setSelectedQR('custom');
    }
  };
  
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleSampleQRSelect = (url: string) => {
    setSelectedQR(url);
    setPreviewUrl('');
    setCustomQR(null);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let qrCodeUrl = '';
    
    if (selectedQR === 'custom' && customQR) {
      // For custom uploaded QR code, use the preview URL
      // Later this will be replaced with the uploaded file URL
      qrCodeUrl = previewUrl;
    } else if (selectedQR && selectedQR !== 'custom') {
      qrCodeUrl = selectedQR;
    } else {
      toast.error('Please select or upload a QR code');
      return;
    }
    
    // Extract the real event ID (without "_team" suffix if present)
    const actualEventId = isTeam ? eventId.replace('_team', '') : eventId;
    
    // Call the update function with the QR code URL and isTeam flag
    onUpdate(actualEventId, qrCodeUrl, isTeam);
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
          <QrCode size={14} />
        </Button>
      </DialogTrigger>
      <DialogContent className="glass border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Upload Payment QR Code</DialogTitle>
          <DialogDescription className="text-gray-400">
            Set the payment QR code for {eventName}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {SAMPLE_QR_CODES.map((qr) => (
              <div 
                key={qr.url}
                className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                  selectedQR === qr.url ? 'border-techfest-neon-blue' : 'border-gray-700'
                }`}
                onClick={() => handleSampleQRSelect(qr.url)}
              >
                <div className="h-40 overflow-hidden">
                  <img 
                    src={qr.url} 
                    alt={qr.name} 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-2 text-center bg-gray-800">
                  <span className="text-sm">{qr.name}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium mb-2">Or upload your own QR code</span>
            </div>
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
              {customQR ? 'Change Image' : 'Upload Image'}
            </Button>
          </div>
          
          {selectedQR === 'custom' && previewUrl && (
            <div className="mt-4">
              <div className="h-40 rounded-lg overflow-hidden">
                <img 
                  src={previewUrl} 
                  alt="Custom QR code" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}
          
          {currentQRUrl && (
            <div className="mt-4">
              <div className="text-sm text-gray-400 mb-2">Current QR Code:</div>
              <div className="h-40 rounded-lg overflow-hidden">
                <img 
                  src={currentQRUrl} 
                  alt="Current QR code" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button type="submit">Save QR Code</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeUploadDialog;
