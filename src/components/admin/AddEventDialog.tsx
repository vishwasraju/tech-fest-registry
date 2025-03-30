
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Background image options
const BACKGROUND_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475', name: 'Circuit Board' },
  { url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e', name: 'Robot' },
  { url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5', name: 'Matrix Code' },
  { url: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7', name: 'Colorful Code' },
  { url: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81', name: 'Display Screens' },
  { url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e', name: 'Gaming Setup' },
  { url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420', name: 'Gaming Controller' }
];

interface AddEventDialogProps {
  onAddEvent: (data: any) => void;
}

const AddEventDialog = ({ onAddEvent }: AddEventDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date_time: '',
    venue: '',
    rules: '',
    team_size: 1,
    fees: 0,
    cash_prize: 0,
    background_image: '',
    qr_code_url: ''
  });
  
  const [open, setOpen] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'team_size' || name === 'fees' || name === 'cash_prize'
        ? parseInt(value) || 0
        : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEvent(formData);
    setFormData({
      name: '',
      description: '',
      date_time: '',
      venue: '',
      rules: '',
      team_size: 1,
      fees: 0,
      cash_prize: 0,
      background_image: '',
      qr_code_url: ''
    });
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus size={16} className="mr-2" />
          Add New Event
        </Button>
      </DialogTrigger>
      <DialogContent className="glass border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogDescription className="text-gray-400">
            Fill in the details to create a new event.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name">Event Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="bg-techfest-muted text-white border-techfest-muted"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="bg-techfest-muted text-white border-techfest-muted"
              required
            />
          </div>

          <div>
            <Label htmlFor="background_image">Background Image</Label>
            <Select 
              value={formData.background_image} 
              onValueChange={(value) => handleSelectChange('background_image', value)}
            >
              <SelectTrigger className="bg-techfest-muted text-white border-techfest-muted">
                <SelectValue placeholder="Select background image" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 text-white border-gray-700">
                <SelectItem value="none" className="hover:bg-gray-800">None</SelectItem>
                {BACKGROUND_IMAGES.map((image) => (
                  <SelectItem key={image.url} value={image.url} className="hover:bg-gray-800">
                    {image.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date_time">Date & Time</Label>
              <Input
                id="date_time"
                name="date_time"
                value={formData.date_time}
                onChange={handleChange}
                className="bg-techfest-muted text-white border-techfest-muted"
                placeholder="e.g. March 15, 2025 - 10:00 AM"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                className="bg-techfest-muted text-white border-techfest-muted"
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="rules">Rules</Label>
            <Textarea
              id="rules"
              name="rules"
              value={formData.rules}
              onChange={handleChange}
              className="bg-techfest-muted text-white border-techfest-muted"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="team_size">Team Size</Label>
              <Input
                id="team_size"
                name="team_size"
                type="number"
                min="1"
                value={formData.team_size}
                onChange={handleChange}
                className="bg-techfest-muted text-white border-techfest-muted"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="fees">Entry Fee (₹)</Label>
              <Input
                id="fees"
                name="fees"
                type="number"
                min="0"
                value={formData.fees}
                onChange={handleChange}
                className="bg-techfest-muted text-white border-techfest-muted"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="cash_prize">Cash Prize (₹)</Label>
              <Input
                id="cash_prize"
                name="cash_prize"
                type="number"
                min="0"
                value={formData.cash_prize}
                onChange={handleChange}
                className="bg-techfest-muted text-white border-techfest-muted"
                required
              />
            </div>
          </div>
          
          {formData.fees > 0 && (
            <div>
              <Label htmlFor="qr_code_url">Payment QR Code URL (Optional)</Label>
              <Input
                id="qr_code_url"
                name="qr_code_url"
                value={formData.qr_code_url}
                onChange={handleChange}
                className="bg-techfest-muted text-white border-techfest-muted"
                placeholder="Enter URL for payment QR code image"
              />
            </div>
          )}
          
          <DialogFooter>
            <Button type="submit">Add Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { AddEventDialog, BACKGROUND_IMAGES };
