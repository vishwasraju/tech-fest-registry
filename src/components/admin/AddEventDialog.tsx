
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { BRANCH_OPTIONS } from '@/types/admin';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface AddEventDialogProps {
  onAddEvent: (data: any) => void;
}

export function AddEventDialog({ onAddEvent }: AddEventDialogProps) {
  const [open, setOpen] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [venue, setVenue] = useState('');
  const [rules, setRules] = useState('');
  const [teamSize, setTeamSize] = useState('1');
  const [fees, setFees] = useState('0');
  const [category, setCategory] = useState('');
  const [cashPrize, setCashPrize] = useState('0');
  const [coordinators, setCoordinators] = useState('');
  const [studentCoordinators, setStudentCoordinators] = useState('');
  
  // Reset form
  const resetForm = () => {
    setName('');
    setDescription('');
    setDateTime('');
    setVenue('');
    setRules('');
    setTeamSize('1');
    setFees('0');
    setCategory('');
    setCashPrize('0');
    setCoordinators('');
    setStudentCoordinators('');
  };
  
  const handleSubmit = () => {
    // Validate form
    if (!name || !description || !dateTime || !venue || !category) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Process coordinators into arrays
    const coordinatorsArray = coordinators.split(',')
      .map(coord => coord.trim())
      .filter(coord => coord.length > 0);
      
    const studentCoordinatorsArray = studentCoordinators.split(',')
      .map(coord => coord.trim())
      .filter(coord => coord.length > 0);
    
    // Create event data
    const eventData = {
      name,
      description,
      date_time: dateTime,
      venue,
      rules,
      team_size: parseInt(teamSize),
      fees: parseInt(fees),
      cash_prize: parseInt(cashPrize),
      category,
      coordinators: coordinatorsArray,
      student_coordinators: studentCoordinatorsArray
    };
    
    onAddEvent(eventData);
    resetForm();
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus size={16} className="mr-2" />
          Add Event
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogDescription>
            Fill in the details for the new event.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="event-name">Event Name <span className="text-red-500">*</span></Label>
            <Input 
              id="event-name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Enter event name"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="event-date">Date & Time <span className="text-red-500">*</span></Label>
            <Input 
              id="event-date" 
              value={dateTime} 
              onChange={(e) => setDateTime(e.target.value)} 
              placeholder="e.g., March 15, 2025 - 10:00 AM"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="event-venue">Venue <span className="text-red-500">*</span></Label>
            <Input 
              id="event-venue" 
              value={venue} 
              onChange={(e) => setVenue(e.target.value)} 
              placeholder="Enter venue"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="event-category">Category <span className="text-red-500">*</span></Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="event-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {BRANCH_OPTIONS.filter(opt => opt !== 'ALL').map((branch) => (
                  <SelectItem key={branch} value={branch}>
                    {branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="event-team-size">Team Size</Label>
            <Input 
              id="event-team-size" 
              type="number" 
              min="1" 
              value={teamSize} 
              onChange={(e) => setTeamSize(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="event-fees">Entry Fee (₹)</Label>
            <Input 
              id="event-fees" 
              type="number" 
              min="0" 
              value={fees} 
              onChange={(e) => setFees(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="event-prize">Cash Prize (₹)</Label>
            <Input 
              id="event-prize" 
              type="number" 
              min="0" 
              value={cashPrize} 
              onChange={(e) => setCashPrize(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="event-coordinators">Coordinators (comma separated)</Label>
            <Input 
              id="event-coordinators" 
              value={coordinators} 
              onChange={(e) => setCoordinators(e.target.value)} 
              placeholder="Dr. John Doe, Prof. Jane Smith"
            />
          </div>
          
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="event-student-coordinators">Student Coordinators (comma separated)</Label>
            <Input 
              id="event-student-coordinators" 
              value={studentCoordinators} 
              onChange={(e) => setStudentCoordinators(e.target.value)} 
              placeholder="Alex Johnson, Sarah Williams"
            />
          </div>
          
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="event-description">Description <span className="text-red-500">*</span></Label>
            <Textarea 
              id="event-description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Event description"
              rows={4}
            />
          </div>
          
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="event-rules">Rules & Guidelines</Label>
            <Textarea 
              id="event-rules" 
              value={rules} 
              onChange={(e) => setRules(e.target.value)} 
              placeholder="Event rules (one per line)"
              rows={4}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Add Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
