
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { QrCode, Upload } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface QRCodeUploadDialogProps {
  eventId: string;
  eventName: string;
  currentQRUrl?: string;
  currentTeamQRUrl?: string;
  onUpdate: (eventId: string, qrCodeUrl: string, isTeamQR?: boolean) => Promise<void>;
}

const QRCodeUploadDialog = ({ 
  eventId, 
  eventName, 
  currentQRUrl, 
  currentTeamQRUrl, 
  onUpdate 
}: QRCodeUploadDialogProps) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'solo' | 'team'>('solo');
  const [soloQRFile, setSoloQRFile] = useState<File | null>(null);
  const [teamQRFile, setTeamQRFile] = useState<File | null>(null);
  const [soloPreviewUrl, setSoloPreviewUrl] = useState<string>(currentQRUrl || '');
  const [teamPreviewUrl, setTeamPreviewUrl] = useState<string>(currentTeamQRUrl || '');

  const soloFileInputRef = useRef<HTMLInputElement>(null);
  const teamFileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSoloFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSoloQRFile(file);
      // Create preview URL for the selected image
      const objectUrl = URL.createObjectURL(file);
      setSoloPreviewUrl(objectUrl);
    }
  };
  
  const handleTeamFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTeamQRFile(file);
      // Create preview URL for the selected image
      const objectUrl = URL.createObjectURL(file);
      setTeamPreviewUrl(objectUrl);
    }
  };
  
  const handleSoloButtonClick = () => {
    if (soloFileInputRef.current) {
      soloFileInputRef.current.click();
    }
  };
  
  const handleTeamButtonClick = () => {
    if (teamFileInputRef.current) {
      teamFileInputRef.current.click();
    }
  };
  
  const handleSave = async () => {
    if (activeTab === 'solo' && soloPreviewUrl) {
      await onUpdate(eventId, soloPreviewUrl, false);
    } else if (activeTab === 'team' && teamPreviewUrl) {
      await onUpdate(eventId, teamPreviewUrl, true);
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
          <QrCode size={14} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Payment QR Codes</DialogTitle>
          <DialogDescription>
            Upload QR codes for payment for {eventName}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'solo' | 'team')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="solo">Solo Registration</TabsTrigger>
            <TabsTrigger value="team">Team Registration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="solo" className="space-y-4">
            <div className="mb-4">
              <Label htmlFor="qr-code" className="mb-2 block">Solo Payment QR Code</Label>
              <input
                type="file"
                ref={soloFileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleSoloFileChange}
              />
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={handleSoloButtonClick}
              >
                <Upload size={16} className="mr-2" />
                {soloQRFile ? 'Change QR Code' : 'Upload QR Code'}
              </Button>
            </div>
            
            {soloPreviewUrl && (
              <div className="mt-4">
                <Label className="mb-2 block">Preview</Label>
                <div className="rounded-md overflow-hidden max-w-xs mx-auto">
                  <img 
                    src={soloPreviewUrl} 
                    alt="QR Code preview" 
                    className="w-full h-auto" 
                  />
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="team" className="space-y-4">
            <div className="mb-4">
              <Label htmlFor="team-qr-code" className="mb-2 block">Team Payment QR Code</Label>
              <input
                type="file"
                ref={teamFileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleTeamFileChange}
              />
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={handleTeamButtonClick}
              >
                <Upload size={16} className="mr-2" />
                {teamQRFile ? 'Change QR Code' : 'Upload QR Code'}
              </Button>
            </div>
            
            {teamPreviewUrl && (
              <div className="mt-4">
                <Label className="mb-2 block">Preview</Label>
                <div className="rounded-md overflow-hidden max-w-xs mx-auto">
                  <img 
                    src={teamPreviewUrl} 
                    alt="Team QR Code preview" 
                    className="w-full h-auto" 
                  />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeUploadDialog;
