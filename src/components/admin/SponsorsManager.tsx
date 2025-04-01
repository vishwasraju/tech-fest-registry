
import React, { useState } from 'react';
import { Sponsor } from '@/data/sponsors';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus, Upload } from 'lucide-react';
import { uploadFile } from '@/utils/storageUtils';

interface SponsorsManagerProps {
  sponsors: Sponsor[];
  onAddSponsor: (data: Omit<Sponsor, 'id'>) => void;
  onUpdateSponsor: (id: string, data: Partial<Sponsor>) => void;
  onDeleteSponsor: (id: string) => void;
}

const SponsorsManager = ({ 
  sponsors, 
  onAddSponsor, 
  onUpdateSponsor, 
  onDeleteSponsor 
}: SponsorsManagerProps) => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form states
  const [name, setName] = useState('');
  const [tier, setTier] = useState<'Platinum' | 'Gold' | 'Silver' | 'Bronze'>('Gold');
  const [logoUrl, setLogoUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  
  // Reset form
  const resetForm = () => {
    setName('');
    setTier('Gold');
    setLogoUrl('');
    setWebsiteUrl('');
    setLogoFile(null);
    setSelectedSponsor(null);
  };
  
  // Open edit dialog
  const openEdit = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
    setName(sponsor.name);
    setTier(sponsor.tier);
    setLogoUrl(sponsor.logo_url || '');
    setWebsiteUrl(sponsor.website_url || '');
    setLogoFile(null);
    setOpenEditDialog(true);
  };
  
  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setLogoFile(files[0]);
    }
  };
  
  // Handle logo upload
  const handleLogoUpload = async (file: File) => {
    if (!file) return null;
    
    setIsUploading(true);
    try {
      // Create a unique path for the file based on timestamp
      const timestamp = new Date().getTime();
      const path = `sponsor-logos/${timestamp}-${file.name.replace(/\s+/g, '-').toLowerCase()}`;
      
      // Upload the file to the server
      const url = URL.createObjectURL(file);
      
      // In a real implementation with Supabase, you would use:
      // const url = await uploadFile(file, 'registrations', path);
      
      setIsUploading(false);
      return url;
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
      setIsUploading(false);
      return null;
    }
  };
  
  // Handle add sponsor
  const handleAddSponsor = async () => {
    if (!name) {
      toast.error('Sponsor name is required');
      return;
    }
    
    let finalLogoUrl = logoUrl;
    
    // Upload logo if file is selected
    if (logoFile) {
      const uploadedUrl = await handleLogoUpload(logoFile);
      if (uploadedUrl) {
        finalLogoUrl = uploadedUrl;
      }
    }
    
    onAddSponsor({
      name,
      tier,
      logo_url: finalLogoUrl || undefined,
      website_url: websiteUrl || undefined
    });
    
    resetForm();
    setOpenAddDialog(false);
  };
  
  // Handle update sponsor
  const handleUpdateSponsor = async () => {
    if (!selectedSponsor) return;
    
    if (!name) {
      toast.error('Sponsor name is required');
      return;
    }
    
    let finalLogoUrl = logoUrl;
    
    // Upload logo if file is selected
    if (logoFile) {
      const uploadedUrl = await handleLogoUpload(logoFile);
      if (uploadedUrl) {
        finalLogoUrl = uploadedUrl;
      }
    }
    
    onUpdateSponsor(selectedSponsor.id, {
      name,
      tier,
      logo_url: finalLogoUrl || undefined,
      website_url: websiteUrl || undefined
    });
    
    resetForm();
    setOpenEditDialog(false);
  };
  
  // Handle delete sponsor
  const handleDeleteSponsor = (id: string) => {
    if (confirm('Are you sure you want to delete this sponsor?')) {
      onDeleteSponsor(id);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Manage Sponsors</h2>
        
        <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Add Sponsor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Sponsor</DialogTitle>
              <DialogDescription>
                Add a new sponsor to the TechFest.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="sponsor-name">Name</Label>
                <Input 
                  id="sponsor-name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Sponsor name"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="sponsor-tier">Tier</Label>
                <Select value={tier} onValueChange={(value: any) => setTier(value)}>
                  <SelectTrigger id="sponsor-tier">
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Platinum">Platinum</SelectItem>
                    <SelectItem value="Gold">Gold</SelectItem>
                    <SelectItem value="Silver">Silver</SelectItem>
                    <SelectItem value="Bronze">Bronze</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="sponsor-logo-url">Logo URL (Optional)</Label>
                <Input 
                  id="sponsor-logo-url" 
                  value={logoUrl} 
                  onChange={(e) => setLogoUrl(e.target.value)} 
                  placeholder="https://example.com/logo.png"
                />
              </div>
              
              <div className="grid gap-2">
                <Label>Upload Logo Image (Optional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                    type="button"
                    className="w-full flex items-center justify-center"
                  >
                    <Upload size={16} className="mr-2" />
                    {logoFile ? logoFile.name : 'Choose Image'}
                  </Button>
                </div>
                {logoFile && (
                  <div className="p-2 border border-gray-600 rounded">
                    <p className="text-sm text-gray-400 truncate">{logoFile.name}</p>
                  </div>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="sponsor-website">Website URL (Optional)</Label>
                <Input 
                  id="sponsor-website" 
                  value={websiteUrl} 
                  onChange={(e) => setWebsiteUrl(e.target.value)} 
                  placeholder="https://example.com"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSponsor} disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Add Sponsor'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-center">Tier</th>
                <th className="py-3 px-4 text-center">Logo</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sponsors.map(sponsor => (
                <tr key={sponsor.id} className="border-b border-gray-800 hover:bg-gray-900/40">
                  <td className="py-3 px-4">{sponsor.name}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      sponsor.tier === 'Platinum' ? 'bg-gray-300 text-gray-900' :
                      sponsor.tier === 'Gold' ? 'bg-yellow-500/30 text-yellow-300' :
                      sponsor.tier === 'Silver' ? 'bg-gray-400/30 text-gray-300' :
                      'bg-amber-700/30 text-amber-500'
                    }`}>
                      {sponsor.tier}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {sponsor.logo_url ? (
                      <img 
                        src={sponsor.logo_url} 
                        alt={sponsor.name} 
                        className="h-10 max-w-[100px] object-contain mx-auto"
                      />
                    ) : (
                      <span className="text-gray-500">No logo</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-8 w-8 p-0 border-gray-600"
                        onClick={() => openEdit(sponsor)}
                      >
                        <Pencil size={14} />
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-8 w-8 p-0 border-gray-600 hover:bg-red-900/30 hover:border-red-600"
                        onClick={() => handleDeleteSponsor(sponsor.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Sponsor</DialogTitle>
            <DialogDescription>
              Update the sponsor information.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-sponsor-name">Name</Label>
              <Input 
                id="edit-sponsor-name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Sponsor name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-sponsor-tier">Tier</Label>
              <Select value={tier} onValueChange={(value: any) => setTier(value)}>
                <SelectTrigger id="edit-sponsor-tier">
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Platinum">Platinum</SelectItem>
                  <SelectItem value="Gold">Gold</SelectItem>
                  <SelectItem value="Silver">Silver</SelectItem>
                  <SelectItem value="Bronze">Bronze</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-sponsor-logo-url">Logo URL (Optional)</Label>
              <Input 
                id="edit-sponsor-logo-url" 
                value={logoUrl} 
                onChange={(e) => setLogoUrl(e.target.value)} 
                placeholder="https://example.com/logo.png"
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Upload Logo Image (Optional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="edit-logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('edit-logo-upload')?.click()}
                  type="button"
                  className="w-full flex items-center justify-center"
                >
                  <Upload size={16} className="mr-2" />
                  {logoFile ? logoFile.name : 'Choose Image'}
                </Button>
              </div>
              {logoFile && (
                <div className="p-2 border border-gray-600 rounded">
                  <p className="text-sm text-gray-400 truncate">{logoFile.name}</p>
                </div>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-sponsor-website">Website URL (Optional)</Label>
              <Input 
                id="edit-sponsor-website" 
                value={websiteUrl} 
                onChange={(e) => setWebsiteUrl(e.target.value)} 
                placeholder="https://example.com"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSponsor} disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Update Sponsor'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SponsorsManager;
