
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Globe, Pencil, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  tier: string;
}

interface SponsorsManagerProps {
  sponsors: Sponsor[];
  onAddSponsor: (data: Partial<Sponsor>) => Promise<void>;
  onUpdateSponsor: (id: string, data: Partial<Sponsor>) => Promise<void>;
  onDeleteSponsor: (id: string) => Promise<void>;
}

const SponsorsManager = ({ sponsors, onAddSponsor, onUpdateSponsor, onDeleteSponsor }: SponsorsManagerProps) => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentSponsor, setCurrentSponsor] = useState<Sponsor | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [tier, setTier] = useState('gold');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  
  // Reset form
  const resetForm = () => {
    setName('');
    setTier('gold');
    setWebsiteUrl('');
    setLogoFile(null);
    setLogoPreview('');
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setLogoPreview(objectUrl);
    }
  };
  
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleEditButtonClick = () => {
    if (editFileInputRef.current) {
      editFileInputRef.current.click();
    }
  };
  
  const handleAddSponsor = () => {
    if (!name || !websiteUrl || !logoPreview) {
      toast.error('Please fill in all fields and upload a logo');
      return;
    }
    
    onAddSponsor({
      name,
      tier,
      website_url: websiteUrl,
      logo_url: logoPreview
    });
    
    resetForm();
    setAddDialogOpen(false);
  };
  
  const handleEditSponsor = (sponsor: Sponsor) => {
    setCurrentSponsor(sponsor);
    setName(sponsor.name);
    setTier(sponsor.tier);
    setWebsiteUrl(sponsor.website_url);
    setLogoPreview(sponsor.logo_url);
    setEditDialogOpen(true);
  };
  
  const handleUpdateSponsor = () => {
    if (!currentSponsor) return;
    
    if (!name || !websiteUrl || !logoPreview) {
      toast.error('Please fill in all fields and upload a logo');
      return;
    }
    
    onUpdateSponsor(currentSponsor.id, {
      name,
      tier,
      website_url: websiteUrl,
      logo_url: logoPreview
    });
    
    resetForm();
    setEditDialogOpen(false);
  };
  
  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setLogoPreview(objectUrl);
    }
  };
  
  const confirmDeleteSponsor = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      onDeleteSponsor(id);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Sponsors</h2>
        
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Sponsor</Button>
          </DialogTrigger>
          <DialogContent className="glass border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>Add Sponsor</DialogTitle>
              <DialogDescription className="text-gray-400">
                Add a new sponsor to the event
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="sponsor-name">Sponsor Name</Label>
                <Input 
                  id="sponsor-name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Enter sponsor name"
                  className="bg-techfest-muted text-white border-techfest-muted"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="sponsor-tier">Sponsor Tier</Label>
                <select 
                  id="sponsor-tier" 
                  value={tier} 
                  onChange={(e) => setTier(e.target.value)}
                  className="bg-techfest-muted text-white border-techfest-muted rounded-md p-2"
                >
                  <option value="platinum">Platinum</option>
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                  <option value="bronze">Bronze</option>
                </select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="sponsor-website">Website URL</Label>
                <Input 
                  id="sponsor-website" 
                  value={websiteUrl} 
                  onChange={(e) => setWebsiteUrl(e.target.value)} 
                  placeholder="https://example.com"
                  className="bg-techfest-muted text-white border-techfest-muted"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="sponsor-logo">Logo</Label>
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
                  {logoFile ? 'Change Logo' : 'Upload Logo'}
                </Button>
                
                {logoPreview && (
                  <div className="mt-2 rounded-md overflow-hidden h-32 bg-white flex items-center justify-center p-2">
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      className="max-h-full max-w-full object-contain" 
                    />
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSponsor}>
                Add Sponsor
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="glass rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {sponsors.length > 0 ? (
            sponsors.map(sponsor => (
              <div key={sponsor.id} className="bg-techfest-muted rounded-xl p-4 relative group">
                <div className="absolute top-2 right-2 space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 w-7 p-0"
                    onClick={() => handleEditSponsor(sponsor)}
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 w-7 p-0 border-red-800 hover:bg-red-900/20"
                    onClick={() => confirmDeleteSponsor(sponsor.id, sponsor.name)}
                  >
                    <Trash2 size={14} className="text-red-500" />
                  </Button>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="h-24 w-full mb-4 flex items-center justify-center bg-white rounded-md p-2">
                    <img 
                      src={sponsor.logo_url} 
                      alt={sponsor.name} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  
                  <h3 className="text-lg font-medium mb-1">{sponsor.name}</h3>
                  <span className="text-sm px-2 py-0.5 rounded bg-gray-800 capitalize mb-2">
                    {sponsor.tier}
                  </span>
                  
                  <a 
                    href={sponsor.website_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-techfest-neon-blue hover:underline"
                  >
                    <Globe size={14} className="mr-1" /> Website
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-400">
              No sponsors added yet
            </div>
          )}
        </div>
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="glass border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Edit Sponsor</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update sponsor information
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-sponsor-name">Sponsor Name</Label>
              <Input 
                id="edit-sponsor-name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Enter sponsor name"
                className="bg-techfest-muted text-white border-techfest-muted"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-sponsor-tier">Sponsor Tier</Label>
              <select 
                id="edit-sponsor-tier" 
                value={tier} 
                onChange={(e) => setTier(e.target.value)}
                className="bg-techfest-muted text-white border-techfest-muted rounded-md p-2"
              >
                <option value="platinum">Platinum</option>
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="bronze">Bronze</option>
              </select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-sponsor-website">Website URL</Label>
              <Input 
                id="edit-sponsor-website" 
                value={websiteUrl} 
                onChange={(e) => setWebsiteUrl(e.target.value)} 
                placeholder="https://example.com"
                className="bg-techfest-muted text-white border-techfest-muted"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-sponsor-logo">Logo</Label>
              <input
                type="file"
                ref={editFileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleEditFileChange}
              />
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={handleEditButtonClick}
              >
                <Upload size={16} className="mr-2" />
                Change Logo
              </Button>
              
              {logoPreview && (
                <div className="mt-2 rounded-md overflow-hidden h-32 bg-white flex items-center justify-center p-2">
                  <img 
                    src={logoPreview} 
                    alt="Logo preview" 
                    className="max-h-full max-w-full object-contain" 
                  />
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSponsor}>
              Update Sponsor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SponsorsManager;
