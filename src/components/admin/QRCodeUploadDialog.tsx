
import React, { useState } from 'react';
import { QrCode, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { uploadFile } from '@/utils/storageUtils';

interface QRCodeUploadDialogProps {
  eventId: string;
  eventName: string;
  currentQRUrl?: string;
  onUpdate: (eventId: string, qrCodeUrl: string) => void;
}

const QRCodeUploadDialog = ({ eventId, eventName, currentQRUrl, onUpdate }: QRCodeUploadDialogProps) => {
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentQRUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }
    
    setIsUploading(true);
    try {
      // Upload file to Supabase Storage
      const filePath = `${eventId}/${selectedFile.name}`;
      const uploadedUrl = await uploadFile(selectedFile, 'qr_codes', filePath);
      
      if (uploadedUrl) {
        onUpdate(eventId, uploadedUrl);
        setOpen(false);
        toast.success('QR code uploaded and updated successfully');
      } else {
        toast.error('Failed to upload QR code');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload QR code');
    } finally {
      setIsUploading(false);
    }
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
          <DialogTitle>Upload Payment QR Code</DialogTitle>
          <DialogDescription className="text-gray-400">
            Upload a QR code image for {eventName}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="qrcode-file">Upload QR Code Image</Label>
            <Input
              id="qrcode-file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="bg-techfest-muted text-white border-techfest-muted"
            />
            <p className="text-xs text-gray-400 mt-1">
              Recommended: Square image in JPG or PNG format
            </p>
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
            <Button type="submit" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Upload QR Code'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeUploadDialog;
