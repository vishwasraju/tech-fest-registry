
import React, { useState } from 'react';
import { QrCode, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { uploadFile } from '@/utils/storageUtils';

interface QRCodeUploadDialogProps {
  eventId: string;
  eventName: string;
  currentQRUrl?: string;
  currentTeamQRUrl?: string;
  onUpdate: (eventId: string, qrCodeUrl: string, isTeamQR?: boolean) => void;
}

const QRCodeUploadDialog = ({ 
  eventId, 
  eventName, 
  currentQRUrl, 
  currentTeamQRUrl, 
  onUpdate 
}: QRCodeUploadDialogProps) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('solo');
  
  // Solo QR state
  const [soloPreviewUrl, setSoloPreviewUrl] = useState(currentQRUrl || '');
  const [soloSelectedFile, setSoloSelectedFile] = useState<File | null>(null);
  
  // Team QR state
  const [teamPreviewUrl, setTeamPreviewUrl] = useState(currentTeamQRUrl || '');
  const [teamSelectedFile, setTeamSelectedFile] = useState<File | null>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  
  const handleSoloFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSoloSelectedFile(file);
      setSoloPreviewUrl(URL.createObjectURL(file));
    }
  };
  
  const handleTeamFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTeamSelectedFile(file);
      setTeamPreviewUrl(URL.createObjectURL(file));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isTeamQR = activeTab === 'team';
    const selectedFile = isTeamQR ? teamSelectedFile : soloSelectedFile;
    
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }
    
    setIsUploading(true);
    try {
      // Upload file to Supabase Storage
      const filePath = `${eventId}/${isTeamQR ? 'team_' : ''}${selectedFile.name}`;
      const uploadedUrl = await uploadFile(selectedFile, 'qr_codes', filePath);
      
      if (uploadedUrl) {
        onUpdate(eventId, uploadedUrl, isTeamQR);
        setOpen(false);
        toast.success(`${isTeamQR ? 'Team' : 'Solo'} QR code uploaded successfully`);
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
          title="Update QR Codes"
        >
          <QrCode size={14} />
        </Button>
      </DialogTrigger>
      <DialogContent className="glass border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Upload Payment QR Codes</DialogTitle>
          <DialogDescription className="text-gray-400">
            Upload QR code images for {eventName}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="solo" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="solo">Solo Registration</TabsTrigger>
            <TabsTrigger value="team">Team Registration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="solo">
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="solo-qrcode-file">Upload Solo QR Code Image</Label>
                <Input
                  id="solo-qrcode-file"
                  type="file"
                  accept="image/*"
                  onChange={handleSoloFileChange}
                  className="bg-techfest-muted text-white border-techfest-muted"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Used for individual registrations
                </p>
              </div>
              
              {soloPreviewUrl && (
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-2">Preview:</p>
                  <div className="bg-white p-2 rounded-lg mx-auto w-48 h-48">
                    <img 
                      src={soloPreviewUrl} 
                      alt="Solo QR Code Preview" 
                      className="w-full h-full object-contain"
                      onError={() => {
                        setSoloPreviewUrl('');
                        toast.error('Invalid image URL');
                      }}
                    />
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? 'Uploading...' : 'Upload Solo QR Code'}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="team">
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="team-qrcode-file">Upload Team QR Code Image</Label>
                <Input
                  id="team-qrcode-file"
                  type="file"
                  accept="image/*"
                  onChange={handleTeamFileChange}
                  className="bg-techfest-muted text-white border-techfest-muted"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Used for team registrations
                </p>
              </div>
              
              {teamPreviewUrl && (
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-2">Preview:</p>
                  <div className="bg-white p-2 rounded-lg mx-auto w-48 h-48">
                    <img 
                      src={teamPreviewUrl} 
                      alt="Team QR Code Preview" 
                      className="w-full h-full object-contain"
                      onError={() => {
                        setTeamPreviewUrl('');
                        toast.error('Invalid image URL');
                      }}
                    />
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? 'Uploading...' : 'Upload Team QR Code'}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeUploadDialog;
