
import React, { useState } from 'react';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Event } from '@/data/events';
import { BRANCH_OPTIONS } from '@/types/admin';

interface EditEventDialogProps {
  event: Event;
  onEditEvent: (eventId: string, formData: any) => Promise<void>;
}

export const EditEventDialog: React.FC<EditEventDialogProps> = ({ event, onEditEvent }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: event.name,
    description: event.description,
    date_time: event.date_time,
    venue: event.venue,
    rules: event.rules,
    team_size: event.team_size,
    fees: event.fees,
    cash_prize: event.cash_prize,
    category: event.category || 'CSE',
    team_registration_fees: event.team_registration_fees || 0
  });
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'fees' || name === 'cash_prize' || name === 'team_size' || name === 'team_registration_fees'
        ? Number(value)
        : value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onEditEvent(event.id, formData);
      setOpen(false);
    } catch (error) {
      console.error('Error updating event:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          variant="outline"
          className="h-8 w-8 p-0 border-gray-600"
        >
          <Edit size={14} />
        </Button>
      </DialogTrigger>
      <DialogContent className="glass border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription className="text-gray-400">
            Edit the details for {event.name}
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
              placeholder="Enter event name"
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
              className="bg-techfest-muted text-white border-techfest-muted min-h-32"
              placeholder="Enter event description"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date_time">Date & Time</Label>
              <Input
                id="date_time"
                name="date_time"
                value={formData.date_time}
                onChange={handleChange}
                className="bg-techfest-muted text-white border-techfest-muted"
                placeholder="e.g., March 15, 2025 - 10:00 AM"
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
                placeholder="Enter venue"
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleSelectChange('category', value)}
            >
              <SelectTrigger className="bg-techfest-muted text-white border-techfest-muted">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 text-white border-gray-700">
                {BRANCH_OPTIONS.filter(branch => branch !== 'ALL').map((branch) => (
                  <SelectItem key={branch} value={branch} className="hover:bg-gray-800">
                    {branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="rules">Rules</Label>
            <Textarea
              id="rules"
              name="rules"
              value={formData.rules}
              onChange={handleChange}
              className="bg-techfest-muted text-white border-techfest-muted min-h-32"
              placeholder="Enter event rules"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="team_size">Team Size</Label>
              <Input
                id="team_size"
                name="team_size"
                type="number"
                min="0"
                value={formData.team_size}
                onChange={handleChange}
                className="bg-techfest-muted text-white border-techfest-muted"
                placeholder="Enter team size"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Set 0 for individual event, 1 for solo only, 2+ for team events
              </p>
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
                placeholder="Enter fee amount"
                required
              />
            </div>
          </div>
          
          {formData.team_size > 1 && (
            <div>
              <Label htmlFor="team_registration_fees">Team Registration Fee (₹)</Label>
              <Input
                id="team_registration_fees"
                name="team_registration_fees"
                type="number"
                min="0"
                value={formData.team_registration_fees}
                onChange={handleChange}
                className="bg-techfest-muted text-white border-techfest-muted"
                placeholder="Enter team registration fee"
              />
              <p className="text-xs text-gray-400 mt-1">
                Optional: special team registration fee (if different from individual fee)
              </p>
            </div>
          )}
          
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
              placeholder="Enter prize amount"
              required
            />
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
