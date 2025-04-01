
import React, { useState } from 'react';
import { Sponsor } from '@/data/sponsors';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus } from 'lucide-react';

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
  
  // Form states
  const [name, setName] = useState('');
  const [tier, setTier] = useState<'Platinum' | 'Gold' | 'Silver' | 'Bronze'>('Gold');
  const [logoUrl, setLogoUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  
  // Reset form
  const resetForm = () => {
    setName('');
    setTier('Gold');
    setLogoUrl('');
    setWebsiteUrl('');
    setSelectedSponsor(null);
  };
  
  // Open edit dialog
  const openEdit = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
    setName(sponsor.name);
    setTier(sponsor.tier);
    setLogoUrl(sponsor.logo_url || '');
    setWebsiteUrl(sponsor.website_url || '');
    setOpenEditDialog(true);
  };
  
  // Handle add sponsor
  const handleAddSponsor = () => {
    if (!name) {
      toast.error('Sponsor name is required');
      return;
    }
    
    onAddSponsor({
      name,
      tier,
      logo_url: logoUrl || undefined,
      website_url: websiteUrl || undefined
    });
    
    resetForm();
    setOpenAddDialog(false);
  };
  
  // Handle update sponsor
  const handleUpdateSponsor = () => {
    if (!selectedSponsor) return;
    
    if (!name) {
      toast.error('Sponsor name is required');
      return;
    }
    
    onUpdateSponsor(selectedSponsor.id, {
      name,
      tier,
      logo_url: logoUrl || undefined,
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
                <Label htmlFor="sponsor-logo">Logo URL</Label>
                <Input 
                  id="sponsor-logo" 
                  value={logoUrl} 
                  onChange={(e) => setLogoUrl(e.target.value)} 
                  placeholder="https://example.com/logo.png"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="sponsor-website">Website URL</Label>
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
              <Button onClick={handleAddSponsor}>
                Add Sponsor
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
              <Label htmlFor="edit-sponsor-logo">Logo URL</Label>
              <Input 
                id="edit-sponsor-logo" 
                value={logoUrl} 
                onChange={(e) => setLogoUrl(e.target.value)} 
                placeholder="https://example.com/logo.png"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-sponsor-website">Website URL</Label>
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
