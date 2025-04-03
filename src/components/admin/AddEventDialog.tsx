
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Add and export the background images data
export const BACKGROUND_IMAGES = [
  { name: 'Tech Pattern', url: '/lovable-uploads/0dfb5f28-6575-4422-8a3e-b97a9c059cbd.png' },
  { name: 'Circuit Board', url: '/lovable-uploads/24fe700b-9cd0-4745-a2af-a58676eaf367.png' },
];

interface AddEventDialogProps {
  onAddEvent: (data: any) => void;
}

export function AddEventDialog({ onAddEvent }: AddEventDialogProps) {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [venue, setVenue] = useState('');
  const [rules, setRules] = useState('');
  const [teamSize, setTeamSize] = useState('1');
  const [fees, setFees] = useState('0');
  const [teamFees, setTeamFees] = useState('0');
  const [cashPrize, setCashPrize] = useState('0');
  const [coordinators, setCoordinators] = useState('');
  const [studentCoordinators, setStudentCoordinators] = useState('');
  const [registrationType, setRegistrationType] = useState<'solo' | 'team' | 'both'>('solo');
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  // Reset form
  const resetForm = () => {
    setName('');
    setDescription('');
    setDateTime('');
    setVenue('');
    setRules('');
    setTeamSize('1');
    setFees('0');
    setTeamFees('0');
    setCashPrize('0');
    setCoordinators('');
    setStudentCoordinators('');
    setRegistrationType('solo');
    setBackgroundImage(null);
    setPreviewUrl('');
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackgroundImage(file);
      // Create preview URL for the selected image
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };
  
  const handleSubmit = () => {
    // Validate form
    if (!name || !description || !dateTime || !venue) {
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
    
    // Determine if team event should have solo option
    const hasSoloOption = registrationType === 'both';
    
    // Create event data
    const eventData: any = {
      name,
      description,
      date_time: dateTime,
      venue,
      rules,
      team_size: parseInt(teamSize),
      fees: parseInt(fees),
      cash_prize: parseInt(cashPrize),
      coordinators: coordinatorsArray,
      student_coordinators: studentCoordinatorsArray,
      registration_type: registrationType
    };
    
    // Add team fees if it's a team event
    if (registrationType === 'team' || registrationType === 'both') {
      eventData.team_registration_fees = parseInt(teamFees);
      
      // Add has_solo_option if registration type is 'both'
      if (registrationType === 'both') {
        eventData.has_solo_option = true;
      }
    }
    
    // Add background image if it exists
    if (backgroundImage && previewUrl) {
      eventData.background_image = previewUrl;
    }
    
    onAddEvent(eventData);
    resetForm();
    setOpen(false);
  };
  
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Determine if we should show team size input
  const showTeamSizeInput = registrationType === 'team' || registrationType === 'both';
  
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
          
          <div className="grid gap-2 md:col-span-2">
            <Label>Registration Type</Label>
            <RadioGroup 
              value={registrationType} 
              onValueChange={(value: 'solo' | 'team' | 'both') => setRegistrationType(value)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-800">
                <RadioGroupItem value="solo" id="solo" />
                <Label htmlFor="solo" className="cursor-pointer">Solo Registration Only</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-800">
                <RadioGroupItem value="team" id="team" />
                <Label htmlFor="team" className="cursor-pointer">Team Registration Only</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-800">
                <RadioGroupItem value="both" id="both" />
                <Label htmlFor="both" className="cursor-pointer">Allow Both Solo & Team Registration</Label>
              </div>
            </RadioGroup>
          </div>
          
          {showTeamSizeInput && (
            <div className="grid gap-2">
              <Label htmlFor="event-team-size">Team Size</Label>
              <Input 
                id="event-team-size" 
                type="number" 
                min="2" 
                value={teamSize} 
                onChange={(e) => setTeamSize(e.target.value)}
              />
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="event-fees">Solo Entry Fee (₹)</Label>
            <Input 
              id="event-fees" 
              type="number" 
              min="0" 
              value={fees} 
              onChange={(e) => setFees(e.target.value)}
            />
          </div>
          
          {showTeamSizeInput && (
            <div className="grid gap-2">
              <Label htmlFor="event-team-fees">Team Entry Fee (₹)</Label>
              <Input 
                id="event-team-fees" 
                type="number" 
                min="0" 
                value={teamFees} 
                onChange={(e) => setTeamFees(e.target.value)}
              />
            </div>
          )}
          
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
            <Label htmlFor="event-background">Background Image</Label>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <div className="flex items-center gap-2">
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={handleButtonClick}
              >
                <Upload size={16} className="mr-2" />
                {backgroundImage ? 'Change Image' : 'Upload Image'}
              </Button>
            </div>
            {previewUrl && (
              <div className="mt-2 rounded-md overflow-hidden h-32 w-full">
                <img 
                  src={previewUrl} 
                  alt="Background preview" 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
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
