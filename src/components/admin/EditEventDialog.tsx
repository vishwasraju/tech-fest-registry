import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Event } from '@/data/events';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface EditEventDialogProps {
  event: Event;
  onUpdateEvent: (eventId: string, data: any) => Promise<void>;
}

export function EditEventDialog({ event, onUpdateEvent }: EditEventDialogProps) {
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
  const [soloCashPrize, setSoloCashPrize] = useState('0');
  const [coordinators, setCoordinators] = useState('');
  const [studentCoordinators, setStudentCoordinators] = useState('');
  const [registrationType, setRegistrationType] = useState<'solo' | 'team' | 'both'>('solo');
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  // Load event data into form when dialog opens
  useEffect(() => {
    if (open) {
      setName(event.name);
      setDescription(event.description);
      setDateTime(event.date_time);
      setVenue(event.venue);
      setRules(event.rules);
      setTeamSize(event.team_size.toString());
      setFees(event.fees.toString());
      setTeamFees(event.team_registration_fees?.toString() || event.fees.toString());
      setCashPrize(event.cash_prize.toString());
      setSoloCashPrize(event.solo_cash_prize?.toString() || '0');
      
      // Determine registration type from event data
      if (event.team_size > 1) {
        if (event.has_solo_option) {
          setRegistrationType('both');
        } else {
          setRegistrationType('team');
        }
      } else {
        setRegistrationType('solo');
      }
      
      setCoordinators(event.coordinators?.join(', ') || '');
      setStudentCoordinators(event.student_coordinators?.join(', ') || '');
      
      if (event.background_image) {
        setPreviewUrl(event.background_image);
      }
    }
  }, [open, event]);
  
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
      solo_cash_prize: parseInt(soloCashPrize),
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
    
    // Add background image if it exists and was newly uploaded
    if (backgroundImage) {
      eventData.background_image = previewUrl;
    } else if (previewUrl) {
      // If there's a preview URL but no new background image, it's using the existing one
      eventData.background_image = previewUrl;
    }
    
    onUpdateEvent(event.id, eventData);
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
        <Button 
          size="sm" 
          variant="outline"
          className="h-8 w-8 p-0 border-gray-600"
        >
          <Edit size={14} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Event: {event.name}</DialogTitle>
          <DialogDescription>
            Update the details for this event.
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
                <RadioGroupItem value="solo" id="edit-solo" />
                <Label htmlFor="edit-solo" className="cursor-pointer">Solo Registration Only</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-800">
                <RadioGroupItem value="team" id="edit-team" />
                <Label htmlFor="edit-team" className="cursor-pointer">Team Registration Only</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-800">
                <RadioGroupItem value="both" id="edit-both" />
                <Label htmlFor="edit-both" className="cursor-pointer">Allow Both Solo & Team Registration</Label>
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
            <Label htmlFor="event-prize">Team Cash Prize (₹)</Label>
            <Input 
              id="event-prize" 
              type="number" 
              min="0" 
              value={cashPrize} 
              onChange={(e) => setCashPrize(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="solo-event-prize">Solo Cash Prize (₹)</Label>
            <Input 
              id="solo-event-prize" 
              type="number" 
              min="0" 
              value={soloCashPrize} 
              onChange={(e) => setSoloCashPrize(e.target.value)}
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
            Update Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
