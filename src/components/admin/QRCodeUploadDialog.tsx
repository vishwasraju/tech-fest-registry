
import React, { useState } from 'react';
import { QrCode, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface QRCodeUploadDialogProps {
  eventId: string;
  eventName: string;
  currentQRUrl?: string;
  onUpdate: (eventId: string, qrCodeUrl: string) => void;
}

const QRCodeUploadDialog = ({ eventId, eventName, currentQRUrl, onUpdate }: QRCodeUploadDialogProps) => {
  const [open, setOpen] = useState(false);
  const [qrCodeUrl, setQRCodeUrl] = useState(currentQRUrl || '');
  const [previewUrl, setPreviewUrl] = useState(currentQRUrl || '');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQRCodeUrl(e.target.value);
    if (e.target.value) setPreviewUrl(e.target.value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrCodeUrl) {
      toast.error('Please enter a QR code URL');
      return;
    }
    
    onUpdate(eventId, qrCodeUrl);
    setOpen(false);
    toast.success('QR code updated successfully');
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          variant="outline"
          className="h-8 w-8 p-0 border-gray-600"
          title="Update QR Code"
        >
          <QrCode size={14} />
        </Button>
      </DialogTrigger>
      <DialogContent className="glass border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Update Payment QR Code</DialogTitle>
          <DialogDescription className="text-gray-400">
            Change the payment QR code for {eventName}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="qrcode-url">QR Code Image URL</Label>
            <Input
              id="qrcode-url"
              value={qrCodeUrl}
              onChange={handleChange}
              placeholder="Enter image URL for QR code"
              className="bg-techfest-muted text-white border-techfest-muted"
            />
          </div>
          
          {previewUrl && (
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">Preview:</p>
              <div className="bg-white p-2 rounded-lg mx-auto w-48 h-48">
                <img 
                  src={previewUrl} 
                  alt="QR Code Preview" 
                  className="w-full h-full object-contain"
                  onError={() => {
                    setPreviewUrl('');
                    toast.error('Invalid image URL');
                  }}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button type="submit">Update QR Code</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeUploadDialog;
