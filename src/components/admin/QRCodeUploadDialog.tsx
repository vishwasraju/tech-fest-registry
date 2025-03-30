
import React, { useState } from 'react';
import { QrCode, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { uploadFile } from '@/utils/storageUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQRCodeUrl(e.target.value);
    if (e.target.value) setPreviewUrl(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (uploadMode === 'url') {
      if (!qrCodeUrl) {
        toast.error('Please enter a QR code URL');
        return;
      }
      
      onUpdate(eventId, qrCodeUrl);
      setOpen(false);
      toast.success('QR code updated successfully');
    } else if (uploadMode === 'file') {
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
          <DialogTitle>Update Payment QR Code</DialogTitle>
          <DialogDescription className="text-gray-400">
            Change the payment QR code for {eventName}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="url" onValueChange={(value) => setUploadMode(value as 'url' | 'file')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url">URL</TabsTrigger>
            <TabsTrigger value="file">Upload Image</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <TabsContent value="url">
              <div>
                <Label htmlFor="qrcode-url">QR Code Image URL</Label>
                <Input
                  id="qrcode-url"
                  value={qrCodeUrl}
                  onChange={handleUrlChange}
                  placeholder="Enter image URL for QR code"
                  className="bg-techfest-muted text-white border-techfest-muted"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="file">
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
            </TabsContent>
            
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
                {isUploading ? 'Uploading...' : 'Update QR Code'}
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeUploadDialog;
